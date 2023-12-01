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
import { promisify } from 'node:util'
import {
  Errors
} from 'blockstore-core'
// @ts-expect-error no types
import fwa from 'fast-write-atomic'
import glob from 'it-glob'
import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
import { NextToLast, type ShardingStrategy } from './sharding.js'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

const writeAtomic = promisify(fwa)

/**
 * Write a file atomically
 */
async function writeFile (file: string, contents: Uint8Array): Promise<void> {
  try {
    await writeAtomic(file, contents)
  } catch (err: any) {
    if (err.code === 'EPERM' && err.syscall === 'rename') {
      // fast-write-atomic writes a file to a temp location before renaming it.
      // On Windows, if the final file already exists this error is thrown.
      // No such error is thrown on Linux/Mac
      // Make sure we can read & write to this file
      await fs.access(file, fs.constants.F_OK | fs.constants.W_OK)

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
        throw Errors.openFailedError(new Error(`Blockstore directory: ${this.path} already exists`))
      }
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        if (this.createIfMissing) {
          await fs.mkdir(this.path, { recursive: true })
          return
        } else {
          throw Errors.openFailedError(new Error(`Blockstore directory: ${this.path} does not exist`))
        }
      }

      throw err
    }
  }

  async close (): Promise<void> {
    await Promise.resolve()
  }

  async put (key: CID, val: Uint8Array): Promise<CID> {
    const { dir, file } = this.shardingStrategy.encode(key)

    try {
      if (dir != null && dir !== '') {
        await fs.mkdir(path.join(this.path, dir), {
          recursive: true
        })
      }

      await writeFile(path.join(this.path, dir, file), val)

      return key
    } catch (err: any) {
      throw Errors.putFailedError(err)
    }
  }

  async * putMany (source: AwaitIterable<Pair>): AsyncIterable<CID> {
    yield * parallelBatch(
      map(source, ({ cid, block }) => {
        return async () => {
          await this.put(cid, block)

          return cid
        }
      }),
      this.putManyConcurrency
    )
  }

  async get (key: CID): Promise<Uint8Array> {
    const { dir, file } = this.shardingStrategy.encode(key)

    try {
      return await fs.readFile(path.join(this.path, dir, file))
    } catch (err: any) {
      throw Errors.notFoundError(err)
    }
  }

  async * getMany (source: AwaitIterable<CID>): AsyncIterable<Pair> {
    yield * parallelBatch(
      map(source, key => {
        return async () => {
          return {
            cid: key,
            block: await this.get(key)
          }
        }
      }),
      this.getManyConcurrency
    )
  }

  async delete (key: CID): Promise<void> {
    const { dir, file } = this.shardingStrategy.encode(key)

    try {
      await fs.unlink(path.join(this.path, dir, file))
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return
      }

      throw Errors.deleteFailedError(err)
    }
  }

  async * deleteMany (source: AwaitIterable<CID>): AsyncIterable<CID> {
    yield * parallelBatch(
      map(source, key => {
        return async () => {
          await this.delete(key)

          return key
        }
      }),
      this.deleteManyConcurrency
    )
  }

  /**
   * Check for the existence of the given key
   */
  async has (key: CID): Promise<boolean> {
    const { dir, file } = this.shardingStrategy.encode(key)

    try {
      await fs.access(path.join(this.path, dir, file))
    } catch (err: any) {
      return false
    }
    return true
  }

  async * getAll (): AsyncIterable<Pair> {
    const pattern = `**/*${this.shardingStrategy.extension}`
      .split(path.sep)
      .join('/')
    const files = glob(this.path, pattern, {
      absolute: true
    })

    for await (const file of files) {
      try {
        const buf = await fs.readFile(file)

        const pair: Pair = {
          cid: this.shardingStrategy.decode(file),
          block: buf
        }

        yield pair
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
