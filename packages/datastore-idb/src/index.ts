import { openDB, deleteDB, IDBPDatabase } from 'idb'
import { Batch, Key, KeyQuery, Pair, Query } from 'interface-datastore'
import { Errors, BaseDatastore } from 'datastore-core'
import filter from 'it-filter'
import sort from 'it-sort'

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
      throw Errors.dbOpenFailedError(err)
    }
  }

  async close (): Promise<void> {
    this.db?.close()
  }

  async put (key: Key, val: Uint8Array): Promise<Key> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    try {
      await this.db.put(this.location, val, key.toString())

      return key
    } catch (err: any) {
      throw Errors.dbWriteFailedError(err)
    }
  }

  async get (key: Key): Promise<Uint8Array> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    let val: Uint8Array | undefined

    try {
      val = await this.db.get(this.location, key.toString())
    } catch (err: any) {
      throw Errors.dbReadFailedError(err)
    }

    if (val === undefined) {
      throw Errors.notFoundError()
    }

    return val
  }

  async has (key: Key): Promise<boolean> {
    if (this.db == null) {
      throw new Error('Blockstore needs to be opened.')
    }

    try {
      return Boolean(await this.db.getKey(this.location, key.toString()))
    } catch (err: any) {
      throw Errors.dbReadFailedError(err)
    }
  }

  async delete (key: Key): Promise<void> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    try {
      await this.db.delete(this.location, key.toString())
    } catch (err: any) {
      throw Errors.dbWriteFailedError(err)
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
      commit: async () => {
        if (this.db == null) {
          throw new Error('Datastore needs to be opened.')
        }

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

          await Promise.all(ops.map(async op => { await op() }))
        } catch {
          tx.abort()
        }
      }
    }
  }

  async * query (q: Query): AsyncIterable<Pair> {
    let it = this.#queryIt(q, (key, value) => {
      return { key, value }
    })

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sort(it, f), it)
    }

    yield * it
  }

  async * queryKeys (q: KeyQuery): AsyncIterable<Key> {
    let it = this.#queryIt(q, (key) => key)

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sort(it, f), it)
    }

    yield * it
  }

  async * #queryIt <T> (q: { prefix?: string, offset?: number, limit?: number }, transform: (key: Key, value: Uint8Array) => T): AsyncIterable<T> {
    if (this.db == null) {
      throw new Error('Datastore needs to be opened.')
    }

    let yielded = 0
    let index = -1

    for (const key of await this.db.getAllKeys(this.location)) {
      if (q.prefix != null && !key.toString().startsWith(q.prefix)) { // eslint-disable-line @typescript-eslint/no-base-to-string
        continue
      }

      if (q.limit != null && yielded === q.limit) {
        return
      }

      index++

      if (q.offset != null && index < q.offset) {
        continue
      }

      const k = new Key(key.toString()) // eslint-disable-line @typescript-eslint/no-base-to-string
      let value: Uint8Array | undefined

      try {
        value = await this.get(k)
      } catch (err: any) {
        if (err.code !== 'ERR_NOT_FOUND') {
          throw err
        }
        continue
      }

      if (value == null) {
        continue
      }

      yield transform(k, value)

      yielded++
    }
  }

  async destroy (): Promise<void> {
    await deleteDB(this.location)
  }
}
