/**
 * @packageDocumentation
 *
 * A Blockstore implementation that stores blocks in Origin Private Filesystem.
 *
 * @example
 *
 * ```js
 * import { OpfsBlockstore } from 'blockstore-opfs'
 *
 * const store = new OpfsBlockstore('store-name')
 * ```
 */

import {
  Errors
} from 'blockstore-core'
import map from 'it-map'
import parallelBatch from 'it-parallel-batch'
import { FlatDirectory, NextToLast, type ShardingStrategy } from './sharding.js'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

export interface OpfsBlockstoreInit {
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
 * A blockstore backed by the Origin Private Filesystem
 */
export class OpfsBlockstore implements Blockstore {
  public name: string
  private directory: FileSystemDirectoryHandle | null
  private readonly createIfMissing: boolean
  private readonly errorIfExists: boolean
  private readonly putManyConcurrency: number
  private readonly getManyConcurrency: number
  private readonly deleteManyConcurrency: number
  private readonly shardingStrategy: ShardingStrategy

  constructor (name: string, init: OpfsBlockstoreInit = {}) {
    this.name = name
    this.directory = null
    this.createIfMissing = init.createIfMissing ?? true
    this.errorIfExists = init.errorIfExists ?? false
    this.deleteManyConcurrency = init.deleteManyConcurrency ?? 50
    this.getManyConcurrency = init.getManyConcurrency ?? 50
    this.putManyConcurrency = init.putManyConcurrency ?? 50
    this.shardingStrategy = init.shardingStrategy ?? new NextToLast()
  }

  async open (): Promise<void> {
    let opfsRootDir: FileSystemDirectoryHandle
    try {
      opfsRootDir = await window.navigator.storage.getDirectory()
    } catch (err: unknown) {
      throw Errors.openFailedError(new Error('Failed to get root directory of bucket file system. OPFS may not be supported by environment.'))
    }

    try {
      const directory = await opfsRootDir.getDirectoryHandle(this.name)

      if (this.errorIfExists) {
        throw Errors.openFailedError(new Error(`Blockstore name: ${this.name} already exists`))
      }

      this.directory = directory
    } catch (err: unknown) {
      if (err instanceof DOMException) {
        if (err.name === 'NotFoundError') {
          if (!this.createIfMissing) {
            throw Errors.openFailedError(new Error(`Blockstore name: ${this.name} does not exist`))
          } else {
            this.directory = await opfsRootDir.getDirectoryHandle(this.name, { create: true })
            return
          }
        }

        if (err.name === 'TypeMismatchError') {
          throw Errors.openFailedError(new Error(`Blockstore name: ${this.name} exists but is not a directory`))
        }
      }

      throw err
    }
  }

  async close (): Promise<void> {
    this.directory = null
  }

  /**
   * Does not support path strings atm ('/path/to/dir')
   * Only supports directory names ('name-of-dir')
   */
  async #getParentDirectory (dir?: string): Promise<FileSystemDirectoryHandle> {
    let directory = this.directory

    if (directory === null) {
      throw new Error('Blockstore is not open.')
    }

    if (typeof dir === 'string' && dir !== '') {
      try {
        directory = await directory.getDirectoryHandle(dir, { create: true })
      } catch (err: any) {
        if (err.name === 'TypeMismatchError') {
          throw Errors.openFailedError(new Error(`Blockstore directory: ${dir} exists but is not a directory`))
        }

        throw err
      }
    }

    return directory
  }

  async put (key: CID, val: Uint8Array): Promise<CID> {
    const { dir, file: name } = this.shardingStrategy.encode(key)

    try {
      const directory = await this.#getParentDirectory(dir)
      const file = await directory.getFileHandle(name, { create: true })
      const writeable = await file.createWritable()
      await writeable.write(val)
      await writeable.close()
    } catch (err: any) {
      throw Errors.putFailedError(err)
    }

    return key
  }

  async * putMany (source: AwaitIterable<Pair>): AsyncIterable<CID> {
    yield * parallelBatch(
      map(source, ({ cid, block }: Pair) => {
        return async () => {
          await this.put(cid, block)

          return cid
        }
      }),
      this.putManyConcurrency
    )
  }

  async get (key: CID): Promise<Uint8Array> {
    const { dir, file: name } = this.shardingStrategy.encode(key)

    let directory: FileSystemDirectoryHandle
    try {
      directory = await this.#getParentDirectory(dir)
    } catch (err: any) {
      throw Errors.getFailedError(err)
    }

    try {
      const fileHandle = await directory.getFileHandle(name)
      const file = await fileHandle.getFile()
      return new Uint8Array(await file.arrayBuffer())
    } catch (err: any) {
      throw Errors.notFoundError(err)
    }
  }

  async * getMany (source: AwaitIterable<CID>): AsyncIterable<Pair> {
    yield * parallelBatch(
      map(source, (key: CID) => {
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
    const { dir, file: name } = this.shardingStrategy.encode(key)

    let directory
    try {
      directory = await this.#getParentDirectory(dir)

      await directory.getFileHandle(name)

      // succeeds regardless if name exists or not, only fails if name is a non-empty directoy
      await directory.removeEntry(name)
    } catch (err: any) {
      if (err instanceof DOMException && err.name === 'NotFoundError') {
        return
      }

      throw Errors.deleteFailedError(err)
    }
  }

  async * deleteMany (source: AwaitIterable<CID>): AsyncIterable<CID> {
    yield * parallelBatch(
      map(source, (key: CID) => {
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
    const { dir, file: name } = this.shardingStrategy.encode(key)

    try {
      const directory = await this.#getParentDirectory(dir)
      return Boolean(await directory.getFileHandle(name))
    } catch (err: any) {
      if (err instanceof DOMException && err.name === 'NotFoundError') {
        return false
      }

      throw Errors.hasFailedError(err)
    }
  }

  async * getAll (): AsyncIterable<Pair> {
    const directory = await this.#getParentDirectory()

    let directories: AwaitIterable<[string, FileSystemHandle]>
    if (this.shardingStrategy instanceof NextToLast) {
      directories = directory.entries()
    } else if (this.shardingStrategy instanceof FlatDirectory) {
      directories = [[this.name, directory]]
    } else {
      throw new Error('unsupported sharding strategy')
    }

    for await (const [, dirHandle] of directories) {
      if (dirHandle instanceof FileSystemDirectoryHandle && dirHandle[Symbol.asyncIterator] !== null) {
        for await (const [name, fileHandle] of dirHandle) {
          if (fileHandle instanceof FileSystemFileHandle && name.endsWith(this.shardingStrategy.extension)) {
            const file = await fileHandle.getFile()
            yield {
              cid: this.shardingStrategy.decode(name),
              block: new Uint8Array(await file.arrayBuffer())
            }
          }
        }
      }
    }
  }
}
