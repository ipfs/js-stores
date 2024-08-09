/**
 * @packageDocumentation
 *
 * A Datastore implementation with a file system backend.
 *
 * @example
 *
 * ```js
 * import { FsDatastore } from 'datastore-fs'
 *
 * const store = new FsDatastore('path/to/store')
 * ```
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { Writer } from 'steno'
import { BaseDatastore } from 'datastore-core'
import { Key } from 'interface-datastore'
import { OpenFailedError, NotFoundError, PutFailedError, DeleteFailedError } from 'interface-store'
import glob from 'it-glob'
import map from 'it-map'
import parallel from 'it-parallel-batch'
import type { KeyQuery, Pair, Query } from 'interface-datastore'
import type { AwaitIterable } from 'interface-store'

/**
 * Write a file atomically
 */
async function writeFile (path: string, contents: Uint8Array): Promise<void> {
  try {
    const writer = new Writer(path)
    await writer.write(contents)
  } catch (err: any) {
    if (err.syscall === 'rename' && ['ENOENT', 'EPERM'].includes(err.code)) {
      // steno writes a file to a temp location before renaming it.
      // If the final file already exists this error is thrown.
      // Make sure we can read & write to this file
      await fs.access(path, fs.constants.F_OK | fs.constants.W_OK)

      // The file was created by another context - this means there were
      // attempts to write the same block by two different function calls
      return
    }

    throw err
  }
}

export interface FsDatastoreInit {
  createIfMissing?: boolean
  errorIfExists?: boolean
  extension?: string
  putManyConcurrency?: number
  getManyConcurrency?: number
  deleteManyConcurrency?: number
}

/**
 * A datastore backed by the file system.
 *
 * Keys need to be sanitized before use, as they are written
 * to the file system as is.
 */
export class FsDatastore extends BaseDatastore {
  public path: string
  private readonly createIfMissing: boolean
  private readonly errorIfExists: boolean
  private readonly extension: string
  private readonly deleteManyConcurrency: number
  private readonly getManyConcurrency: number
  private readonly putManyConcurrency: number

  constructor (location: string, init: FsDatastoreInit = {}) {
    super()

    this.path = path.resolve(location)
    this.createIfMissing = init.createIfMissing ?? true
    this.errorIfExists = init.errorIfExists ?? false
    this.extension = init.extension ?? '.data'
    this.deleteManyConcurrency = init.deleteManyConcurrency ?? 50
    this.getManyConcurrency = init.getManyConcurrency ?? 50
    this.putManyConcurrency = init.putManyConcurrency ?? 50
  }

  async open (): Promise<void> {
    try {
      await fs.access(this.path, fs.constants.F_OK | fs.constants.W_OK)

      if (this.errorIfExists) {
        throw new OpenFailedError(`Datastore directory: ${this.path} already exists`)
      }
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        if (this.createIfMissing) {
          await fs.mkdir(this.path, { recursive: true })
          return
        } else {
          throw new NotFoundError(`Datastore directory: ${this.path} does not exist`)
        }
      }

      throw err
    }
  }

  async close (): Promise<void> {

  }

  /**
   * Calculate the directory and file name for a given key.
   */
  _encode (key: Key): { dir: string, file: string } {
    const parent = key.parent().toString()
    const dir = path.join(this.path, parent)
    const name = key.toString().slice(parent.length)
    const file = path.join(dir, name + this.extension)

    return {
      dir,
      file
    }
  }

  /**
   * Calculate the original key, given the file name.
   */
  _decode (file: string): Key {
    const ext = this.extension
    if (path.extname(file) !== ext) {
      throw new Error(`Invalid extension: ${path.extname(file)}`)
    }

    const keyname = file
      .slice(this.path.length, -ext.length)
      .split(path.sep)
      .join('/')

    return new Key(keyname)
  }

  /**
   * Store the given value under the key
   */
  async put (key: Key, val: Uint8Array): Promise<Key> {
    const parts = this._encode(key)

    try {
      await fs.mkdir(parts.dir, {
        recursive: true
      })
      await writeFile(parts.file, val)

      return key
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async * putMany (source: AwaitIterable<Pair>): AsyncIterable<Key> {
    yield * parallel(
      map(source, ({ key, value }) => {
        return async () => {
          await this.put(key, value)

          return key
        }
      }),
      this.putManyConcurrency
    )
  }

  /**
   * Read from the file system
   */
  async get (key: Key): Promise<Uint8Array> {
    const parts = this._encode(key)
    let data
    try {
      data = await fs.readFile(parts.file)
    } catch (err: any) {
      throw new NotFoundError(String(err))
    }
    return data
  }

  async * getMany (source: AwaitIterable<Key>): AsyncIterable<Pair> {
    yield * parallel(
      map(source, key => {
        return async () => {
          return {
            key,
            value: await this.get(key)
          }
        }
      }),
      this.getManyConcurrency
    )
  }

  async * deleteMany (source: AwaitIterable<Key>): AsyncIterable<Key> {
    yield * parallel(
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
  async has (key: Key): Promise<boolean> {
    const parts = this._encode(key)

    try {
      await fs.access(parts.file)
    } catch (err: any) {
      return false
    }
    return true
  }

  /**
   * Delete the record under the given key
   */
  async delete (key: Key): Promise<void> {
    const parts = this._encode(key)
    try {
      await fs.unlink(parts.file)
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return
      }

      throw new DeleteFailedError(String(err))
    }
  }

  async * _all (q: Query): AsyncIterable<Pair> {
    let prefix = q.prefix ?? '**'

    // strip leading slashes
    prefix = prefix.replace(/^\/+/, '')

    const pattern = `${prefix}/*${this.extension}`
      .split(path.sep)
      .join('/')
    const files = glob(this.path, pattern, {
      absolute: true
    })

    for await (const file of files) {
      try {
        const buf = await fs.readFile(file)

        const pair: Pair = {
          key: this._decode(file),
          value: buf
        }

        yield pair
      } catch (err: any) {
        // if keys are removed from the datastore while the query is
        // running, we may encounter missing files.
        if (err.code !== 'ENOENT') {
          throw err
        }
      }
    }
  }

  async * _allKeys (q: KeyQuery): AsyncIterable<Key> {
    let prefix = q.prefix ?? '**'

    // strip leading slashes
    prefix = prefix.replace(/^\/+/, '')

    const pattern = `${prefix}/*${this.extension}`
      .split(path.sep)
      .join('/')
    const files = glob(this.path, pattern, {
      absolute: true
    })

    yield * map(files, f => this._decode(f))
  }
}
