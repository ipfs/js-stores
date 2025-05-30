/**
 * @packageDocumentation
 *
 * A Datastore implementation that uses a flavour of [Level](https://leveljs.org/) as a backend.
 *
 * This module is targetted at Node.js. It is possible to use it in a browser but you should probably use IDBDatastore instead.
 *
 * @example
 *
 * ```js
 * import { LevelDatastore } from 'datastore-level'
 *
 * // Default using level as backend for node or the browser
 * const store = new LevelDatastore('path/to/store')
 *
 * // another leveldown compliant backend like memory-level
 * const memStore = new LevelDatastore(
 *   new MemoryLevel({
 *     keyEncoding: 'utf8',
 *     valueEncoding: 'view'
 *   })
 * )
 * ```
 *
 * ## Browser Shimming Leveldown
 *
 * `LevelStore` uses the `level` module to automatically use `level` if a modern bundler is used which can detect bundle targets based on the `pkg.browser` property in your `package.json`.
 *
 * If you are using a bundler that does not support `pkg.browser`, you will need to handle the shimming yourself, as was the case with versions of `LevelStore` 0.7.0 and earlier.
 *
 * ## Database names
 *
 * `level-js@3` changed the database prefix from `IDBWrapper-` to `level-js-`, so please specify the old prefix if you wish to continue using databases created using `datastore-level` prior to `v0.12.0`.  E.g.
 *
 * ```javascript
 * import leveljs from 'level-js'
 * import browserStore = new LevelDatastore(
 *   new Level('my/db/name', {
 *     prefix: 'IDBWrapper-'
 *   })
 * })
 * ```
 *
 * More information: [https://github.com/Level/level-js/blob/master/UPGRADING.md#new-database-prefix](https://github.com/Level/level-js/blob/99831913e905d19e5f6dee56d512b7264fbed7bd/UPGRADING.md#new-database-prefix)
 */

import { BaseDatastore } from 'datastore-core'
import { Key } from 'interface-datastore'
import { DeleteFailedError, GetFailedError, NotFoundError, OpenFailedError, PutFailedError } from 'interface-store'
import filter from 'it-filter'
import map from 'it-map'
import sort from 'it-sort'
import take from 'it-take'
import { Level } from 'level'
import { raceSignal } from 'race-signal'
import type { Batch, KeyQuery, Pair, Query } from 'interface-datastore'
import type { AbortOptions } from 'interface-store'
import type { DatabaseOptions, OpenOptions, IteratorOptions } from 'level'

interface BatchPut {
  type: 'put'
  key: string
  value: Uint8Array
}

interface BatchDel {
  type: 'del'
  key: string
}

type BatchOp = BatchPut | BatchDel

/**
 * A datastore backed by leveldb
 */
export class LevelDatastore extends BaseDatastore {
  public db: Level<string, Uint8Array>
  private readonly opts: OpenOptions

  constructor (path: string | Level<string, Uint8Array>, opts: DatabaseOptions<string, Uint8Array> & OpenOptions = {}) {
    super()

    this.db = typeof path === 'string'
      ? new Level(path, {
        ...opts,
        keyEncoding: 'utf8',
        valueEncoding: 'view'
      })
      : path

    this.opts = {
      createIfMissing: true,
      compression: false, // same default as go
      ...opts
    }
  }

  async open (): Promise<void> {
    try {
      await this.db.open(this.opts)
    } catch (err: any) {
      throw new OpenFailedError(String(err))
    }
  }

  async put (key: Key, value: Uint8Array, options?: AbortOptions): Promise<Key> {
    try {
      options?.signal?.throwIfAborted()
      await raceSignal(this.db.put(key.toString(), value), options?.signal)

      return key
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async get (key: Key, options?: AbortOptions): Promise<Uint8Array> {
    let data
    try {
      options?.signal?.throwIfAborted()
      data = await raceSignal(this.db.get(key.toString()), options?.signal)
    } catch (err: any) {
      if (err.notFound != null) {
        throw new NotFoundError(String(err))
      }

      throw new GetFailedError(String(err))
    }
    return data
  }

  async has (key: Key, options?: AbortOptions): Promise<boolean> {
    try {
      options?.signal?.throwIfAborted()
      await raceSignal(this.db.get(key.toString()), options?.signal)
    } catch (err: any) {
      if (err.notFound != null) {
        return false
      }

      throw err
    }
    return true
  }

  async delete (key: Key, options?: AbortOptions): Promise<void> {
    try {
      options?.signal?.throwIfAborted()
      await raceSignal(this.db.del(key.toString()), options?.signal)
    } catch (err: any) {
      throw new DeleteFailedError(String(err))
    }
  }

  async close (): Promise<void> {
    await this.db.close()
  }

  batch (): Batch {
    const ops: BatchOp[] = []

    return {
      put: (key, value) => {
        ops.push({
          type: 'put',
          key: key.toString(),
          value
        })
      },
      delete: (key) => {
        ops.push({
          type: 'del',
          key: key.toString()
        })
      },
      commit: async (options?: AbortOptions) => {
        if (this.db.batch == null) {
          throw new Error('Batch operations unsupported by underlying Level')
        }

        options?.signal?.throwIfAborted()
        await raceSignal(this.db.batch(ops), options?.signal)
      }
    }
  }

  query (q: Query, options?: AbortOptions): AsyncIterable<Pair> {
    let it = map(this._query({
      values: true,
      prefix: q.prefix
    }), (res) => {
      options?.signal?.throwIfAborted()
      return res
    })

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sort(it, f), it)
    }

    const { offset, limit } = q
    if (offset != null) {
      let i = 0
      it = filter(it, () => i++ >= offset)
    }

    if (limit != null) {
      it = take(it, limit)
    }

    return it
  }

  queryKeys (q: KeyQuery, options?: AbortOptions): AsyncIterable<Key> {
    let it = map(this._query({
      values: false,
      prefix: q.prefix
    }), ({ key }) => {
      options?.signal?.throwIfAborted()
      return key
    })

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sort(it, f), it)
    }

    const { offset, limit } = q
    if (offset != null) {
      let i = 0
      it = filter(it, () => i++ >= offset)
    }

    if (limit != null) {
      it = take(it, limit)
    }

    return it
  }

  _query (opts: { values: boolean, prefix?: string }): AsyncIterable<Pair> {
    const iteratorOpts: IteratorOptions<string, Uint8Array> = {
      keys: true,
      keyEncoding: 'buffer',
      values: opts.values
    }

    // Let the db do the prefix matching
    if (opts.prefix != null) {
      const prefix = opts.prefix.toString()
      // Match keys greater than or equal to `prefix` and
      iteratorOpts.gte = prefix
      // less than `prefix` + \xFF (hex escape sequence)
      iteratorOpts.lt = prefix + '\xFF'
    }

    const iterator = this.db.iterator(iteratorOpts)

    if (iterator[Symbol.asyncIterator] != null) {
      return levelIteratorToIterator(iterator)
    }

    // @ts-expect-error support older level
    if (iterator.next != null && iterator.end != null) {
      // @ts-expect-error support older level
      return oldLevelIteratorToIterator(iterator)
    }

    throw new Error('Level returned incompatible iterator')
  }
}

async function * levelIteratorToIterator (li: AsyncIterable<[string, Uint8Array]> & { close(): Promise<void> }): AsyncIterable<Pair> {
  for await (const [key, value] of li) {
    yield { key: new Key(key, false), value }
  }

  await li.close()
}

interface OldLevelIterator {
  next(cb: (err: Error, key: string | Uint8Array | null, value: any) => void): void
  end(cb: (err: Error) => void): void
}

function oldLevelIteratorToIterator (li: OldLevelIterator): AsyncIterable<Pair> {
  return {
    [Symbol.asyncIterator] () {
      return {
        next: async () => new Promise((resolve, reject) => {
          li.next((err, key, value) => {
            if (err != null) {
              reject(err); return
            }
            if (key == null) {
              li.end(err => {
                if (err != null) {
                  reject(err)
                  return
                }
                resolve({ done: true, value: undefined })
              }); return
            }
            resolve({ done: false, value: { key: new Key(key, false), value } })
          })
        }),
        return: async () => new Promise((resolve, reject) => {
          li.end(err => {
            if (err != null) {
              reject(err); return
            }
            resolve({ done: true, value: undefined })
          })
        })
      }
    }
  }
}
