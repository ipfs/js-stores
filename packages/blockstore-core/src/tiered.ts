import { logger } from '@libp2p/logger'
import { NotFoundError } from 'interface-store'
import filter from 'it-filter'
import merge from 'it-merge'
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
    await Promise.all(
      this.stores.map(async store => {
        await store.put(key, value, options)
      })
    )

    return key
  }

  async get (key: CID, options?: AbortOptions): Promise<Uint8Array> {
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

  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    for (const s of this.stores) {
      if (await s.has(key, options)) {
        return true
      }
    }

    return false
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    await Promise.all(
      this.stores.map(async store => {
        await store.delete(key, options)
      })
    )
  }

  async * putMany (source: AwaitIterable<Pair>, options: AbortOptions = {}): AsyncIterable<CID> {
    for await (const pair of source) {
      await this.put(pair.cid, pair.block, options)
      yield pair.cid
    }
  }

  async * deleteMany (source: AwaitIterable<CID>, options: AbortOptions = {}): AsyncIterable<CID> {
    for await (const cid of source) {
      await this.delete(cid, options)
      yield cid
    }
  }

  async * getAll (options?: AbortOptions): AwaitIterable<Pair> {
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
