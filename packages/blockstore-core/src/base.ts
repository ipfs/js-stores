import type { Blockstore, InputPair, Pair } from 'interface-blockstore'
import type { AbortOptions, Await, AwaitGenerator, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

export class BaseBlockstore implements Blockstore {
  has (key: CID, options?: AbortOptions): Await<boolean> {
    return Promise.reject(new Error('.has is not implemented'))
  }

  put (key: CID, val: Uint8Array | AwaitIterable<Uint8Array>, options?: AbortOptions): Await<CID> {
    return Promise.reject(new Error('.put is not implemented'))
  }

  async * putMany (source: AwaitIterable<InputPair>, options?: AbortOptions): AwaitGenerator<CID> {
    for await (const { cid, bytes } of source) {
      await this.put(cid, bytes, options)
      yield cid
    }
  }

  get (key: CID, options?: AbortOptions): AwaitGenerator<Uint8Array> {
    throw new Error('.get is not implemented')
  }

  async * getMany (source: AwaitIterable<CID>, options?: AbortOptions): AwaitGenerator<Pair> {
    for await (const key of source) {
      yield {
        cid: key,
        bytes: this.get(key, options)
      }
    }
  }

  delete (key: CID, options?: AbortOptions): Await<void> {
    return Promise.reject(new Error('.delete is not implemented'))
  }

  async * deleteMany (source: AwaitIterable<CID>, options?: AbortOptions): AwaitGenerator<CID> {
    for await (const key of source) {
      await this.delete(key, options)
      yield key
    }
  }

  /**
   * Extending classes should override `query` or implement this method
   */
  async * getAll (options?: AbortOptions): AwaitGenerator<Pair> { // eslint-disable-line require-yield
    throw new Error('.getAll is not implemented')
  }
}
