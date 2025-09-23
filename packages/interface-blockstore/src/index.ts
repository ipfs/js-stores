/**
 * @packageDocumentation
 *
 * A Blockstore is a key/value database that lets use CIDs to store/retrieve binary blobs.
 *
 * It is used by IPFS to store/retrieve the block that a given CID resolves to.
 *
 * ## Implementations
 *
 * - File System: [`blockstore-fs`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-fs)
 * - IndexedDB: [`blockstore-idb`](https://github.com/ipfs/js-stores/blob/main/packages/blockstore-idb)
 * - level: [`blockstore-level`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-level) (supports any levelup compatible backend)
 * - Memory: [`blockstore-core/memory`](https://github.com/ipfs/js-stores/blob/main/packages/blockstore-core/src/memory.ts)
 * - S3: [`blockstore-s3`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-s3)
 */

import type {
  AbortOptions,
  AwaitGenerator,
  AwaitIterable,
  Store
} from 'interface-store'
import type { CID } from 'multiformats/cid'

export interface Pair {
  cid: CID
  bytes: AwaitGenerator<Uint8Array>
}

export interface InputPair {
  cid: CID
  bytes: Uint8Array | AwaitIterable<Uint8Array>
}

export interface Blockstore <HasOptionsExtension = {},
PutOptionsExtension = {}, PutManyOptionsExtension = {},
GetOptionsExtension = {}, GetManyOptionsExtension = {}, GetAllOptionsExtension = {},
DeleteOptionsExtension = {}, DeleteManyOptionsExtension = {}> extends Store<CID, Uint8Array | AwaitIterable<Uint8Array>, AwaitGenerator<Uint8Array>, InputPair, Pair, HasOptionsExtension,
  PutOptionsExtension, PutManyOptionsExtension,
  GetOptionsExtension, GetManyOptionsExtension,
  DeleteOptionsExtension, DeleteManyOptionsExtension> {
  /**
   * Retrieve all cid/block pairs from the blockstore as an unordered iterable
   *
   * @example
   * ```js
   * for await (const { multihash, bytes } of store.getAll()) {
   *   console.log('got:', multihash, bytes)
   *   // => got MultihashDigest('Qmfoo') [Uint8Array[...]...]
   * }
   * ```
   */
  getAll(options?: AbortOptions & GetAllOptionsExtension): AwaitGenerator<Pair>
}
