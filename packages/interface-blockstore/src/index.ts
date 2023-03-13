import type {
  Options as StoreOptions,
  AwaitIterable,
  Store
} from 'interface-store'
import type { MultihashDigest } from 'multiformats/hashes/digest'

export interface Options extends StoreOptions {

}

export interface Pair {
  multihash: MultihashDigest
  block: Uint8Array
}

export interface Blockstore extends Store<MultihashDigest, Uint8Array, Pair> {
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
