/**
 * @packageDocumentation
 *
 * Various Blockstore implementations are available.
 *
 * ## BaseBlockstore
 *
 * Provides a complete implementation of the Blockstore interface.  You must implement `.get`, `.put`, etc.
 *
 * @example
 *
 * ```js
 * import { BaseBlockstore } from 'blockstore-core'
 *
 * class MyCustomBlockstore extends BaseBlockstore {
 *   put (key, val, options) {
 *     // store a block
 *   }
 *
 *   get (key, options) {
 *     // retrieve a block
 *   }
 *
 *   // ...etc
 * }
 * ```
 *
 * ## MemoryBlockstore
 *
 * A simple Blockstore that stores blocks in memory.
 *
 * @example
 *
 * ```js
 * import { MemoryBlockstore } from 'blockstore-core'
 *
 * const store = new MemoryBlockstore()
 * ```
 *
 * ## BlackHoleBlockstore
 *
 * A Blockstore that does not store any blocks.
 *
 * @example
 *
 * ```js
 * import { BlackHoleBlockstore } from 'blockstore-core'
 *
 * const store = new BlackHoleBlockstore()
 * ```
 *
 * ## TieredBlockstore
 *
 * A tiered blockstore wraps one or more blockstores and will query each in parallel to retrieve a block - the operation will succeed if any wrapped store has the block.
 *
 * Writes are invoked on all wrapped blockstores.
 *
 * @example
 *
 * ```js
 * import { TieredBlockstore } from 'blockstore-core'
 *
 * const store = new TieredBlockstore([
 *   store1,
 *   store2,
 *   // ...etc
 * ])
 * ```
 *
 * ## IdentityBlockstore
 *
 * An identity blockstore is one that deals exclusively in Identity CIDs - this is a special CID with the codec [0x00](https://github.com/multiformats/multicodec/blob/d06fc6194710e8909bac64273c43f16b56ca4c34/table.csv#L2) where the multihash digest is the data that makes up the block.
 *
 * @example
 *
 * ```TypeScript
 * import { IdentityBlockstore } from 'blockstore-core'
 * import { CID } from 'multiformats/cid'
 *
 * const blockstore = new IdentityBlockstore()
 *
 * blockstore.has(CID.parse('QmFoo')) // false
 *
 * blockstore.has(CID.parse('bafkqac3imvwgy3zao5xxe3de')) // true
 * ```
 */

export { BaseBlockstore } from './base.ts'
export { MemoryBlockstore } from './memory.ts'
export { BlackHoleBlockstore } from './black-hole.ts'
export { TieredBlockstore } from './tiered.ts'
