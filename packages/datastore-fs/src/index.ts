/**
 * @packageDocumentation
 *
 * ⚠️ This package is deprecated. Instead, use `datastore-level` in Node.js, and `datastore-idb` in browsers.
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
import { BaseDatastore } from 'datastore-core'
import { Key } from 'interface-datastore'
import { OpenFailedError, NotFoundError, PutFailedError, DeleteFailedError } from 'interface-store'
import glob from 'it-glob'
import map from 'it-map'
import parallel from 'it-parallel-batch'
import { raceSignal } from 'race-signal'
import { Writer } from 'steno'
import type { KeyQuery, Pair, Query } from 'interface-datastore'
import type { AbortOptions, AwaitIterable } from 'interface-store'

/**
 * Write a file atomically
 */
async function writeFile (file: string, contents: Uint8Array, options?: AbortOptions): Promise<void> {
  try {
    options?.signal?.throwIfAborted()
    await raceSignal(fs.mkdir(path.dirname(file), {
      recursive: true
    }), options?.signal)

    const writer = new Writer(file)
    options?.signal?.throwIfAborted()
    await raceSignal(writer.write(contents), options?.signal)
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

  async put (key: Key, val: Uint8Array, options?: AbortOptions): Promise<Key> {
    const parts = this._encode(key)

    try {
      await writeFile(parts.file, val, options)

      return key
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async * putMany (source: AwaitIterable<Pair>, options?: AbortOptions): AsyncIterable<Key> {
    yield * parallel(
      map(source, ({ key, value }) => {
        return async () => {
          await this.put(key, value, options)

          return key
        }
      }),
      this.putManyConcurrency
    )
  }

  async get (key: Key, options?: AbortOptions): Promise<Uint8Array> {
    const parts = this._encode(key)
    try {
      options?.signal?.throwIfAborted()
      return await raceSignal(fs.readFile(parts.file), options?.signal)
    } catch (err: any) {
      throw new NotFoundError(String(err))
    }
  }

  async * getMany (source: AwaitIterable<Key>, options?: AbortOptions): AsyncIterable<Pair> {
    yield * parallel(
      map(source, key => {
        return async () => {
          return {
            key,
            value: await this.get(key, options)
          }
        }
      }),
      this.getManyConcurrency
    )
  }

  async * deleteMany (source: AwaitIterable<Key>, options?: AbortOptions): AsyncIterable<Key> {
    yield * parallel(
      map(source, key => {
        return async () => {
          await this.delete(key, options)

          return key
        }
      }),
      this.deleteManyConcurrency
    )
  }

  async has (key: Key, options?: AbortOptions): Promise<boolean> {
    const parts = this._encode(key)

    try {
      options?.signal?.throwIfAborted()
      await raceSignal(fs.access(parts.file), options?.signal)
    } catch (err: any) {
      return false
    }

    return true
  }

  async delete (key: Key, options?: AbortOptions): Promise<void> {
    const parts = this._encode(key)
    try {
      options?.signal?.throwIfAborted()
      await raceSignal(fs.unlink(parts.file), options?.signal)
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return
      }

      throw new DeleteFailedError(String(err))
    }
  }

  async * _all (q: Query, options?: AbortOptions): AsyncIterable<Pair> {
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
        options?.signal?.throwIfAborted()
        const buf = await raceSignal(fs.readFile(file), options?.signal)

        const pair: Pair = {
          key: this._decode(file),
          value: buf
        }

        yield pair
        options?.signal?.throwIfAborted()
      } catch (err: any) {
        // if keys are removed from the datastore while the query is
        // running, we may encounter missing files.
        if (err.code !== 'ENOENT') {
          throw err
        }
      }
    }
  }

  async * _allKeys (q: KeyQuery, options?: AbortOptions): AsyncIterable<Key> {
    let prefix = q.prefix ?? '**'

    // strip leading slashes
    prefix = prefix.replace(/^\/+/, '')

    const pattern = `${prefix}/*${this.extension}`
      .split(path.sep)
      .join('/')
    const files = glob(this.path, pattern, {
      absolute: true
    })

    yield * map(files, f => {
      options?.signal?.throwIfAborted()
      return this._decode(f)
    })
  }
}
