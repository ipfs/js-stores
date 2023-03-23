import { Batch, Key, KeyQuery, Pair, Query } from 'interface-datastore'
import { BaseDatastore, Errors } from 'datastore-core'
import filter from 'it-filter'
import map from 'it-map'
import take from 'it-take'
import sort from 'it-sort'
import { Level } from 'level'
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
      throw Errors.dbOpenFailedError(err)
    }
  }

  async put (key: Key, value: Uint8Array): Promise<Key> {
    try {
      await this.db.put(key.toString(), value)

      return key
    } catch (err: any) {
      throw Errors.dbWriteFailedError(err)
    }
  }

  async get (key: Key): Promise<Uint8Array> {
    let data
    try {
      data = await this.db.get(key.toString())
    } catch (err: any) {
      if (err.notFound != null) {
        throw Errors.notFoundError(err)
      }

      throw Errors.dbWriteFailedError(err)
    }
    return data
  }

  async has (key: Key): Promise<boolean> {
    try {
      await this.db.get(key.toString())
    } catch (err: any) {
      if (err.notFound != null) {
        return false
      }

      throw err
    }
    return true
  }

  async delete (key: Key): Promise<void> {
    try {
      await this.db.del(key.toString())
    } catch (err: any) {
      throw Errors.dbDeleteFailedError(err)
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
      commit: async () => {
        if (this.db.batch == null) {
          throw new Error('Batch operations unsupported by underlying Level')
        }

        await this.db.batch(ops)
      }
    }
  }

  query (q: Query): AsyncIterable<Pair> {
    let it = this._query({
      values: true,
      prefix: q.prefix
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

  queryKeys (q: KeyQuery): AsyncIterable<Key> {
    let it = map(this._query({
      values: false,
      prefix: q.prefix
    }), ({ key }) => key)

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

async function * levelIteratorToIterator (li: AsyncIterable<[string, Uint8Array]> & { close: () => Promise<void> }): AsyncIterable<Pair> {
  for await (const [key, value] of li) {
    yield { key: new Key(key, false), value }
  }

  await li.close()
}

interface OldLevelIterator {
  next: (cb: (err: Error, key: string | Uint8Array | null, value: any) => void) => void
  end: (cb: (err: Error) => void) => void
}

function oldLevelIteratorToIterator (li: OldLevelIterator): AsyncIterable<Pair> {
  return {
    [Symbol.asyncIterator] () {
      return {
        next: async () => await new Promise((resolve, reject) => {
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
        return: async () => await new Promise((resolve, reject) => {
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
