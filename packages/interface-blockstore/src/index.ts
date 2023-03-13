import type {
  Options as StoreOptions,
  AwaitIterable,
  Store
} from 'interface-store'
import type {
  CID
} from 'multiformats'

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
   * for await (const { cid, block } of store.getAll()) {
   *   console.log('got:', cid, block)
   *   // => got CID('Qmfoo') Uint8Array[...]
   * }
   * ```
   */
  getAll: (options?: Options) => AwaitIterable<Pair>
}
