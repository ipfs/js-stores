import type { Blockstore, Pair } from 'interface-blockstore'
import type { AbortOptions, Await, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

export class BaseBlockstore implements Blockstore {
  has (key: CID, options?: AbortOptions): Await<boolean> {
    return Promise.reject(new Error('.has is not implemented'))
  }

  put (key: CID, val: Uint8Array, options?: AbortOptions): Await<CID> {
    return Promise.reject(new Error('.put is not implemented'))
  }

  async * putMany (source: AwaitIterable<Pair>, options?: AbortOptions): AwaitIterable<CID> {
    for await (const { cid, block } of source) {
      await this.put(cid, block, options)
      yield cid
    }
  }

  get (key: CID, options?: AbortOptions): Await<Uint8Array> {
    return Promise.reject(new Error('.get is not implemented'))
  }

  async * getMany (source: AwaitIterable<CID>, options?: AbortOptions): AwaitIterable<Pair> {
    for await (const key of source) {
      yield {
        cid: key,
        block: await this.get(key, options)
      }
    }
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    await Promise.reject(new Error('.delete is not implemented'))
  }

  async * deleteMany (source: AwaitIterable<CID>, options?: AbortOptions): AwaitIterable<CID> {
    for await (const key of source) {
      await this.delete(key, options)
      yield key
    }
  }

  /**
   * Extending classes should override `query` or implement this method
   */
  async * getAll (options?: AbortOptions): AwaitIterable<Pair> { // eslint-disable-line require-yield
    throw new Error('.getAll is not implemented')
  }
}
