import filter from 'it-filter'
import merge from 'it-merge'
import sort from 'it-sort'
import take from 'it-take'
import { BaseDatastore } from './base.js'
import * as Errors from './errors.js'
import type { Batch, Datastore, Key, KeyQuery, Pair, Query } from 'interface-datastore'
import type { AbortOptions } from 'interface-store'

/**
 * A datastore that can combine multiple stores inside various
 * key prefixes
 */
export class MountDatastore extends BaseDatastore {
  private readonly mounts: Array<{ prefix: Key, datastore: Datastore }>

  constructor (mounts: Array<{ prefix: Key, datastore: Datastore }>) {
    super()

    this.mounts = mounts.slice()
  }

  /**
   * Lookup the matching datastore for the given key
   */
  private _lookup (key: Key): { datastore: Datastore, mountpoint: Key } | undefined {
    for (const mount of this.mounts) {
      if (mount.prefix.toString() === key.toString() || mount.prefix.isAncestorOf(key)) {
        return {
          datastore: mount.datastore,
          mountpoint: mount.prefix
        }
      }
    }
  }

  async put (key: Key, value: Uint8Array, options?: AbortOptions): Promise<Key> {
    const match = this._lookup(key)
    if (match == null) {
      throw Errors.dbWriteFailedError(new Error('No datastore mounted for this key'))
    }

    await match.datastore.put(key, value, options)

    return key
  }

  /**
   * @param {Key} key
   * @param {Options} [options]
   */
  async get (key: Key, options: AbortOptions = {}): Promise<Uint8Array> {
    const match = this._lookup(key)
    if (match == null) {
      throw Errors.notFoundError(new Error('No datastore mounted for this key'))
    }
    return match.datastore.get(key, options)
  }

  async has (key: Key, options?: AbortOptions): Promise<boolean> {
    const match = this._lookup(key)
    if (match == null) {
      return Promise.resolve(false)
    }
    return match.datastore.has(key, options)
  }

  async delete (key: Key, options?: AbortOptions): Promise<void> {
    const match = this._lookup(key)
    if (match == null) {
      throw Errors.dbDeleteFailedError(new Error('No datastore mounted for this key'))
    }

    await match.datastore.delete(key, options)
  }

  batch (): Batch {
    const batchMounts: Record<string, Batch> = {}

    const lookup = (key: Key): { batch: Batch } => {
      const match = this._lookup(key)
      if (match == null) {
        throw new Error('No datastore mounted for this key')
      }

      const m = match.mountpoint.toString()
      if (batchMounts[m] == null) {
        batchMounts[m] = match.datastore.batch()
      }

      return {
        batch: batchMounts[m]
      }
    }

    return {
      put: (key, value) => {
        const match = lookup(key)
        match.batch.put(key, value)
      },
      delete: (key) => {
        const match = lookup(key)
        match.batch.delete(key)
      },
      commit: async (options) => {
        await Promise.all(Object.keys(batchMounts).map(async p => { await batchMounts[p].commit(options) }))
      }
    }
  }

  query (q: Query, options?: AbortOptions): AsyncIterable<Pair> {
    const qs = this.mounts.map(m => {
      return m.datastore.query({
        prefix: q.prefix,
        filters: q.filters
      }, options)
    })

    let it = merge(...qs)
    if (q.filters != null) q.filters.forEach(f => { it = filter(it, f) })
    if (q.orders != null) q.orders.forEach(o => { it = sort(it, o) })
    if (q.offset != null) {
      let i = 0
      const offset = q.offset
      it = filter(it, () => i++ >= offset)
    }
    if (q.limit != null) it = take(it, q.limit)

    return it
  }

  queryKeys (q: KeyQuery, options?: AbortOptions): AsyncIterable<Key> {
    const qs = this.mounts.map(m => {
      return m.datastore.queryKeys({
        prefix: q.prefix,
        filters: q.filters
      }, options)
    })

    /** @type AsyncIterable<Key> */
    let it = merge(...qs)
    if (q.filters != null) q.filters.forEach(f => { it = filter(it, f) })
    if (q.orders != null) q.orders.forEach(o => { it = sort(it, o) })
    if (q.offset != null) {
      let i = 0
      const offset = q.offset
      it = filter(it, () => i++ >= offset)
    }
    if (q.limit != null) it = take(it, q.limit)

    return it
  }
}
