/**
 * @packageDocumentation
 *
 * A Datastore implementation for browsers that stores data in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
 *
 * @example
 *
 * ```js
 * import { IDBDatastore } from 'datastore-idb'
 *
 * const store = new IDBDatastore('path/to/store')
 * ```
 */

import { BaseDatastore } from 'datastore-core'
import { openDB, deleteDB } from 'idb'
import { Key } from 'interface-datastore'
import { DeleteFailedError, GetFailedError, NotFoundError, OpenFailedError, PutFailedError } from 'interface-store'
import filter from 'it-filter'
import sort from 'it-sort'
import { raceSignal } from 'race-signal'
import type { IDBPDatabase } from 'idb'
import type { Batch, KeyQuery, Pair, Query } from 'interface-datastore'
import type { AbortOptions } from 'interface-store'

export interface IDBDatastoreInit {
  /**
   * A prefix to use for all database keys (default: '')
   */
  prefix?: string

  /**
   * The database version (default: 1)
   */
  version?: number
}

export class IDBDatastore extends BaseDatastore {
  private readonly location: string
  private readonly version: number
  private db?: IDBPDatabase

  constructor (location: string, init: IDBDatastoreInit = {}) {
    super()

    this.location = `${init.prefix ?? ''}${location}`
    this.version = init.version ?? 1
  }

  async open (): Promise<void> {
    try {
      const location = this.location

      this.db = await openDB(location, this.version, {
        upgrade (db) {
          db.createObjectStore(location)
        }
      })
    } catch (err: any) {
      throw new OpenFailedError(String(err))
    }
  }

  async close (): Promise<void> {
    this.db?.close()
  }

  async put (key: Key, val: Uint8Array, options?: AbortOptions): Promise<Key> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    try {
      options?.signal?.throwIfAborted()
      await raceSignal(this.db.put(this.location, val, key.toString()), options?.signal)
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }

    return key
  }

  async get (key: Key, options?: AbortOptions): Promise<Uint8Array> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    let val: Uint8Array | undefined

    try {
      options?.signal?.throwIfAborted()
      val = await raceSignal(this.db.get(this.location, key.toString()), options?.signal)
    } catch (err: any) {
      throw new GetFailedError(String(err))
    }

    if (val === undefined) {
      throw new NotFoundError()
    }

    return val
  }

  async has (key: Key, options?: AbortOptions): Promise<boolean> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    try {
      options?.signal?.throwIfAborted()
      const result = await raceSignal(this.db.getKey(this.location, key.toString()))
      return Boolean(result)
    } catch (err: any) {
      throw new GetFailedError(String(err))
    }
  }

  async delete (key: Key, options?: AbortOptions): Promise<void> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    try {
      options?.signal?.throwIfAborted()
      await raceSignal(this.db.delete(this.location, key.toString()), options?.signal)
    } catch (err: any) {
      throw new DeleteFailedError(String(err))
    }
  }

  batch (): Batch {
    const puts: Pair[] = []
    const dels: Key[] = []

    return {
      put (key, value) {
        puts.push({ key, value })
      },
      delete (key) {
        dels.push(key)
      },
      commit: async (options?: AbortOptions) => {
        if (this.db == null) {
          throw new Error('Datastore needs to be opened.')
        }

        options?.signal?.throwIfAborted()

        const tx = this.db.transaction(this.location, 'readwrite')

        try {
          const ops = puts.filter(({ key }) => {
            // don't put a key we are about to delete
            return dels.find(delKey => delKey.toString() === key.toString()) == null
          })
            .map(put => {
              return async () => {
                await tx.store.put(put.value, put.key.toString())
              }
            })
            .concat(dels.map(key => {
              return async () => {
                await tx.store.delete(key.toString())
              }
            }))
            .concat(async () => {
              await tx.done
            })

          options?.signal?.throwIfAborted()
          await raceSignal(Promise.all(ops.map(async op => { await op() })), options?.signal)
        } catch {
          tx.abort()
        }
      }
    }
  }

  async * query (q: Query, options?: AbortOptions): AsyncIterable<Pair> {
    let it = this.#queryIt(q, (key, value) => {
      return { key, value }
    }, options)

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sort(it, f), it)
    }

    yield * it
  }

  async * queryKeys (q: KeyQuery, options?: AbortOptions): AsyncIterable<Key> {
    let it = this.#queryIt(q, (key) => key, options)

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sort(it, f), it)
    }

    yield * it
  }

  async * #queryIt <T> (q: { prefix?: string, offset?: number, limit?: number }, transform: (key: Key, value: Uint8Array) => T, options?: AbortOptions): AsyncIterable<T> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    let yielded = 0
    let index = -1

    options?.signal?.throwIfAborted()

    for (const key of await this.db.getAllKeys(this.location)) {
      options?.signal?.throwIfAborted()
      if (q.prefix != null && !key.toString().startsWith(q.prefix)) {
        continue
      }

      if (q.limit != null && yielded === q.limit) {
        return
      }

      index++

      if (q.offset != null && index < q.offset) {
        continue
      }

      const k = new Key(key.toString())
      let value: Uint8Array | undefined

      try {
        value = await this.get(k, options)
      } catch (err: any) {
        if (err.name !== 'NotFoundError') {
          throw err
        }
        continue
      }

      if (value == null) {
        continue
      }

      yield transform(k, value)

      options?.signal?.throwIfAborted()

      yielded++
    }
  }

  async destroy (): Promise<void> {
    await deleteDB(this.location)
  }
}
