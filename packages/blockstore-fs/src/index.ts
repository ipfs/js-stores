/**
 * @packageDocumentation
 *
 * A Blockstore implementation that stores blocks in the local filesystem.
 *
 * @example
 *
 * ```js
 * import { FsBlockstore } from 'blockstore-fs'
 *
 * const store = new FsBlockstore('path/to/store')
 * ```
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { OpenFailedError, PutFailedError, NotFoundError, DeleteFailedError } from 'interface-store'
import glob from 'it-glob'
import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
import { raceSignal } from 'race-signal'
import { Writer } from 'steno'
import { NextToLast } from './sharding.js'
import type { ShardingStrategy } from './sharding.js'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { AbortOptions, AwaitGenerator, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'
import type { FileHandle } from 'node:fs/promises'

/**
 * Write a file atomically
 */
async function writeFile (file: string, contents: Uint8Array | AwaitIterable<Uint8Array>, options?: AbortOptions): Promise<void> {
  try {
    options?.signal?.throwIfAborted()
    await raceSignal(fs.mkdir(path.dirname(file), {
      recursive: true
    }), options?.signal)

    const writer = new Writer(file)

    options?.signal?.throwIfAborted()

    await writer.write(contents)
  } catch (err: any) {
    if (err.syscall === 'rename' && ['ENOENT', 'EPERM'].includes(err.code)) {
      // steno writes a file to a temp location before renaming it.
      // If the final file already exists this error is thrown.
      // Make sure we can read & write to this file
      options?.signal?.throwIfAborted()
      await raceSignal(fs.access(file, fs.constants.F_OK | fs.constants.W_OK), options?.signal)

      // The file was created by another context - this means there were
      // attempts to write the same block by two different function calls
      return
    }
    throw err
  }
}

export interface FsBlockstoreInit {
  /**
   * If true and the passed blockstore location does not exist, create
   * it on startup. default: true
   */
  createIfMissing?: boolean

  /**
   * If true and the passed blockstore location exists on startup, throw
   * an error. default: false
   */
  errorIfExists?: boolean

  /**
   * The file extension to use when storing blocks. default: '.data'
   */
  extension?: string

  /**
   * How many blocks to put in parallel when `.putMany` is called.
   * default: 50
   */
  putManyConcurrency?: number

  /**
   * How many blocks to read in parallel when `.getMany` is called.
   * default: 50
   */
  getManyConcurrency?: number

  /**
   * How many blocks to delete in parallel when `.deleteMany` is called.
   * default: 50
   */
  deleteManyConcurrency?: number

  /**
   * Control how CIDs map to paths and back
   */
  shardingStrategy?: ShardingStrategy
}

/**
 * A blockstore backed by the file system
 */
export class FsBlockstore implements Blockstore {
  public path: string
  private readonly createIfMissing: boolean
  private readonly errorIfExists: boolean
  private readonly putManyConcurrency: number
  private readonly getManyConcurrency: number
  private readonly deleteManyConcurrency: number
  private readonly shardingStrategy: ShardingStrategy

  constructor (location: string, init: FsBlockstoreInit = {}) {
    this.path = path.resolve(location)
    this.createIfMissing = init.createIfMissing ?? true
    this.errorIfExists = init.errorIfExists ?? false
    this.deleteManyConcurrency = init.deleteManyConcurrency ?? 50
    this.getManyConcurrency = init.getManyConcurrency ?? 50
    this.putManyConcurrency = init.putManyConcurrency ?? 50
    this.shardingStrategy = init.shardingStrategy ?? new NextToLast()
  }

  async open (): Promise<void> {
    try {
      await fs.access(this.path, fs.constants.F_OK | fs.constants.W_OK)

      if (this.errorIfExists) {
        throw new OpenFailedError(`Blockstore directory: ${this.path} already exists`)
      }
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        if (this.createIfMissing) {
          await fs.mkdir(this.path, { recursive: true })
          return
        } else {
          throw new OpenFailedError(`Blockstore directory: ${this.path} does not exist`)
        }
      }

      throw err
    }
  }

  async close (): Promise<void> {
    await Promise.resolve()
  }

  async put (key: CID, val: Uint8Array | AwaitIterable<Uint8Array>, options?: AbortOptions): Promise<CID> {
    const { dir, file } = this.shardingStrategy.encode(key)

    try {
      await writeFile(path.join(this.path, dir, file), val, options)

      return key
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async * putMany (source: AwaitIterable<Pair>, options?: AbortOptions): AsyncIterable<CID> {
    yield * parallelBatch(
      map(source, ({ cid, bytes }) => {
        return async () => {
          await this.put(cid, bytes, options)

          return cid
        }
      }),
      this.putManyConcurrency
    )
  }

  async * get (key: CID, options?: AbortOptions): AsyncGenerator<Uint8Array> {
    const { dir, file } = this.shardingStrategy.encode(key)
    let handle: fs.FileHandle | undefined

    try {
      options?.signal?.throwIfAborted()

      handle = await raceSignal(fs.open(path.join(this.path, dir, file)), options?.signal)

      yield * handle.createReadStream()
    } catch (err: any) {
      if (handle != null) {
        await raceSignal(handle.close(), options?.signal)
      }

      throw new NotFoundError(String(err))
    }
  }

  async * getMany (source: AwaitIterable<CID>, options?: AbortOptions): AsyncIterable<Pair> {
    yield * parallelBatch(
      map(source, key => {
        return async () => {
          return {
            cid: key,
            bytes: this.get(key, options)
          }
        }
      }),
      this.getManyConcurrency
    )
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    const { dir, file } = this.shardingStrategy.encode(key)

    try {
      options?.signal?.throwIfAborted()
      await raceSignal(fs.unlink(path.join(this.path, dir, file)), options?.signal)
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return
      }

      throw new DeleteFailedError(String(err))
    }
  }

  async * deleteMany (source: AwaitIterable<CID>, options?: AbortOptions): AsyncIterable<CID> {
    yield * parallelBatch(
      map(source, key => {
        return async () => {
          await this.delete(key, options)

          return key
        }
      }),
      this.deleteManyConcurrency
    )
  }

  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    const { dir, file } = this.shardingStrategy.encode(key)

    try {
      options?.signal?.throwIfAborted()
      await raceSignal(fs.access(path.join(this.path, dir, file)), options?.signal)
    } catch (err: any) {
      return false
    }
    return true
  }

  async * getAll (options?: AbortOptions): AwaitGenerator<Pair> {
    const pattern = `**/*${this.shardingStrategy.extension}`
      .split(path.sep)
      .join('/')
    const files = glob(this.path, pattern, {
      absolute: true
    })

    for await (const file of files) {
      try {
        options?.signal?.throwIfAborted()
        const pair: Pair = {
          cid: this.shardingStrategy.decode(file),
          bytes: (async function * () {
            let handle: FileHandle | undefined

            try {
              handle = await raceSignal(fs.open(file), options?.signal)

              yield * handle.createReadStream()
            } finally {
              if (handle != null) {
                await raceSignal(handle.close(), options?.signal)
              }
            }
          })()
        }

        yield pair
        options?.signal?.throwIfAborted()
      } catch (err: any) {
        // if keys are removed from the blockstore while the query is
        // running, we may encounter missing files.
        if (err.code !== 'ENOENT') {
          throw err
        }
      }
    }
  }
}
