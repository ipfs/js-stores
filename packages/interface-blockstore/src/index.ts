/* eslint-disable @typescript-eslint/ban-types */
// this ignore is so we can use {} as the default value for the options
// extensions below - it normally means "any non-nullish value" but here
// we are using it as an intersection type - see the aside at the bottom:
// https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492

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

export interface Blockstore <HasOptionsExtension = {},
PutOptionsExtension = {}, PutManyOptionsExtension = {},
GetOptionsExtension = {}, GetManyOptionsExtension = {}, GetAllOptionsExtension = {},
DeleteOptionsExtension = {}, DeleteManyOptionsExtension = {}> extends Store<CID, Uint8Array, Pair, HasOptionsExtension,
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
