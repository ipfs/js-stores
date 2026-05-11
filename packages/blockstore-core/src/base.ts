import type { AbortOptions } from 'abort-error'
import type { Blockstore, InputPair, Pair } from 'interface-blockstore'
import type { CID } from 'multiformats/cid'

export class BaseBlockstore implements Blockstore {
  has (key: CID, options?: AbortOptions): boolean | Promise<boolean> {
    return Promise.reject(new Error('.has is not implemented'))
  }

  put (key: CID, val: Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array>, options?: AbortOptions): CID | Promise<CID> {
    return Promise.reject(new Error('.put is not implemented'))
  }

  async * putMany (source: Iterable<InputPair> | AsyncIterable<InputPair>, options?: AbortOptions): Generator<CID> | AsyncGenerator<CID> {
    for await (const { cid, bytes } of source) {
      await this.put(cid, bytes, options)
      yield cid
    }
  }

  get (key: CID, options?: AbortOptions): Generator<Uint8Array> | AsyncGenerator<Uint8Array> {
    throw new Error('.get is not implemented')
  }

  async * getMany (source: Iterable<CID> | AsyncIterable<CID>, options?: AbortOptions): Generator<Pair> | AsyncGenerator<Pair> {
    for await (const key of source) {
      yield {
        cid: key,
        bytes: this.get(key, options)
      }
    }
  }

  delete (key: CID, options?: AbortOptions): void | Promise<void> {
    return Promise.reject(new Error('.delete is not implemented'))
  }

  async * deleteMany (source: Iterable<CID> | AsyncIterable<CID>, options?: AbortOptions): Generator<CID> | AsyncGenerator<CID> {
    for await (const key of source) {
      await this.delete(key, options)
      yield key
    }
  }

  /**
   * Extending classes should override `query` or implement this method
   */
  async * getAll (options?: AbortOptions): Generator<Pair> | AsyncGenerator<Pair> { // eslint-disable-line require-yield
    throw new Error('.getAll is not implemented')
  }
}
