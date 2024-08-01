import { logger } from '@libp2p/logger'
import { DeleteFailedError, NotFoundError, PutFailedError } from 'interface-store'
import drain from 'it-drain'
import filter from 'it-filter'
import merge from 'it-merge'
import { pushable } from 'it-pushable'
import { BaseBlockstore } from './base.js'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { AbortOptions, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

const log = logger('blockstore:core:tiered')

/**
 * A blockstore that can combine multiple stores. Puts and deletes
 * will write through to all blockstores. Has and get will
 * try each store sequentially. getAll will use every store but also
 * deduplicate any yielded pairs.
 */
export class TieredBlockstore extends BaseBlockstore {
  private readonly stores: Blockstore[]

  constructor (stores: Blockstore[]) {
    super()

    this.stores = stores.slice()
  }

  async put (key: CID, value: Uint8Array, options?: AbortOptions): Promise<CID> {
    try {
      await Promise.all(this.stores.map(async store => { await store.put(key, value, options) }))
      return key
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async get (key: CID, options?: AbortOptions): Promise<Uint8Array> {
    for (const store of this.stores) {
      try {
        const res = await store.get(key, options)
        if (res != null) return res
      } catch (err) {
        log.error(err)
      }
    }
    throw new NotFoundError()
  }

  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    for (const s of this.stores) {
      if (await s.has(key, options)) {
        return true
      }
    }

    return false
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    try {
      await Promise.all(this.stores.map(async store => { await store.delete(key, options) }))
    } catch (err: any) {
      throw new DeleteFailedError(String(err))
    }
  }

  async * putMany (source: AwaitIterable<Pair>, options: AbortOptions = {}): AsyncIterable<CID> {
    let error: Error | undefined
    const pushables = this.stores.map(store => {
      const source = pushable<Pair>({
        objectMode: true
      })

      drain(store.putMany(source, options))
        .catch(err => {
          // store threw while putting, make sure we bubble the error up
          error = err
        })

      return source
    })

    try {
      for await (const pair of source) {
        if (error != null) {
          throw error
        }

        pushables.forEach(p => p.push(pair))

        yield pair.cid
      }
    } finally {
      pushables.forEach(p => p.end())
    }
  }

  async * deleteMany (source: AwaitIterable<CID>, options: AbortOptions = {}): AsyncIterable<CID> {
    let error: Error | undefined
    const pushables = this.stores.map(store => {
      const source = pushable<CID>({
        objectMode: true
      })

      drain(store.deleteMany(source, options))
        .catch(err => {
          // store threw while deleting, make sure we bubble the error up
          error = err
        })

      return source
    })

    try {
      for await (const key of source) {
        if (error != null) {
          throw error
        }

        pushables.forEach(p => p.push(key))

        yield key
      }
    } finally {
      pushables.forEach(p => p.end())
    }
  }

  async * getAll (options?: AbortOptions): AwaitIterable<Pair> { // eslint-disable-line require-yield
    // deduplicate yielded pairs
    const seen = new Set<string>()

    yield * filter(merge(...this.stores.map(s => s.getAll(options))), (pair) => {
      const cidStr = pair.cid.toString()

      if (seen.has(cidStr)) {
        return false
      }

      seen.add(cidStr)

      return true
    })
  }
}
