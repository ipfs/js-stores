import { logger } from '@libp2p/logger'
import { NotFoundError } from 'interface-store'
import { BaseDatastore } from './base.js'
import type { Batch, Datastore, Key, KeyQuery, Pair, Query } from 'interface-datastore'
import type { AbortOptions, AwaitIterable } from 'interface-store'

const log = logger('datastore:core:tiered')

/**
 * A datastore that can combine multiple stores. Puts and deletes
 * will write through to all datastores. Has and get will
 * try each store sequentially. Query will always try the
 * last one first.
 *
 */
export class TieredDatastore extends BaseDatastore {
  private readonly stores: Datastore[]

  constructor (stores: Datastore[]) {
    super()

    this.stores = stores.slice()
  }

  async put (key: Key, value: Uint8Array, options?: AbortOptions): Promise<Key> {
    await Promise.all(
      this.stores.map(async store => {
        await store.put(key, value, options)
      })
    )

    return key
  }

  async get (key: Key, options?: AbortOptions): Promise<Uint8Array> {
    let error: Error | undefined

    for (const store of this.stores) {
      try {
        const res = await store.get(key, options)

        if (res != null) {
          return res
        }
      } catch (err: any) {
        error = err
        log.error(err)
      }
    }

    throw error ?? new NotFoundError()
  }

  async has (key: Key, options?: AbortOptions): Promise<boolean> {
    for (const s of this.stores) {
      if (await s.has(key, options)) {
        return true
      }
    }

    return false
  }

  async delete (key: Key, options?: AbortOptions): Promise<void> {
    await Promise.all(
      this.stores.map(async store => {
        await store.delete(key, options)
      })
    )
  }

  async * putMany (source: AwaitIterable<Pair>, options: AbortOptions = {}): AsyncIterable<Key> {
    for await (const pair of source) {
      await this.put(pair.key, pair.value, options)
      yield pair.key
    }
  }

  async * deleteMany (source: AwaitIterable<Key>, options: AbortOptions = {}): AsyncIterable<Key> {
    for await (const key of source) {
      await this.delete(key, options)
      yield key
    }
  }

  batch (): Batch {
    const batches = this.stores.map(store => store.batch())

    return {
      put: (key, value) => {
        batches.forEach(b => { b.put(key, value) })
      },
      delete: (key) => {
        batches.forEach(b => { b.delete(key) })
      },
      commit: async (options) => {
        for (const batch of batches) {
          await batch.commit(options)
        }
      }
    }
  }

  query (q: Query, options?: AbortOptions): AwaitIterable<Pair> {
    return this.stores[this.stores.length - 1].query(q, options)
  }

  queryKeys (q: KeyQuery, options?: AbortOptions): AwaitIterable<Key> {
    return this.stores[this.stores.length - 1].queryKeys(q, options)
  }
}
