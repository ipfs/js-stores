import type {
  Options as StoreOptions,
  AwaitIterable,
  Store
} from 'interface-store'
import type { CID } from 'multiformats/cid'

export interface Options extends StoreOptions {

}

export interface Pair {
  cid: CID
  block: Uint8Array
}

export interface Blockstore extends Store<CID, Uint8Array, Pair> {
  /**
   * Retrieve all cid/block pairs from the blockstore as an unordered iterable
   *
   * @example
   * ```js
   * for await (const { multihash, block } of store.getAll()) {
   *   console.log('got:', multihash, block)
   *   // => got MultihashDigest('Qmfoo') Uint8Array[...]
   * }
   * ```
   */
  getAll: (options?: Options) => AwaitIterable<Pair>
}
