import { logger } from '@libp2p/logger'
import { NotFoundError } from 'interface-store'
import filter from 'it-filter'
import merge from 'it-merge'
import { BaseBlockstore } from './base.ts'
import type { AbortOptions } from 'abort-error'
import type { Blockstore, InputPair, Pair } from 'interface-blockstore'
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

  async put (key: CID, value: Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array>, options?: AbortOptions): Promise<CID> {
    await Promise.all(
      this.stores.map(async store => {
        await store.put(key, value, options)
      })
    )

    return key
  }

  async * get (key: CID, options?: AbortOptions): Generator<Uint8Array> | AsyncGenerator<Uint8Array> {
    let error: Error | undefined

    for (const store of this.stores) {
      try {
        yield * store.get(key, options)
        return
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

  async * putMany (source: Iterable<InputPair> | AsyncIterable<InputPair>, options: AbortOptions = {}): Generator<CID> | AsyncGenerator<CID> {
    for await (const pair of source) {
      await this.put(pair.cid, pair.bytes, options)
      yield pair.cid
    }
  }

  async * deleteMany (source: Iterable<CID> | AsyncIterable<CID>, options: AbortOptions = {}): Generator<CID> | AsyncGenerator<CID> {
    for await (const cid of source) {
      await this.delete(cid, options)
      yield cid
    }
  }

  async * getAll (options?: AbortOptions): Generator<Pair> | AsyncGenerator<Pair> {
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
