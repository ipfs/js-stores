import type {
  AbortOptions,
  AwaitIterable,
  Store
} from 'interface-store'
import type { CID } from 'multiformats/cid'

export interface Pair {
  cid: CID
  block: Uint8Array
}

export interface Blockstore <HasOptionsExtension = unknown,
PutOptionsExtension = unknown, PutManyOptionsExtension = unknown,
GetOptionsExtension = unknown, GetManyOptionsExtension = unknown, GetAllOptionsExtension = unknown,
DeleteOptionsExtension = unknown, DeleteManyOptionsExtension = unknown> extends Store<CID, Uint8Array, Pair, HasOptionsExtension,
  PutOptionsExtension, PutManyOptionsExtension,
  GetOptionsExtension, GetManyOptionsExtension,
  DeleteOptionsExtension, DeleteManyOptionsExtension> {
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
  getAll: (options?: AbortOptions & GetAllOptionsExtension) => AwaitIterable<Pair>
}
