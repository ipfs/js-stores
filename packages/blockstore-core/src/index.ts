/**
 * @packageDocumentation
 *
 * Various Blockstore implementations are available.
 *
 * ## Implementations
 *
 * - Base: [`src/base`](./src/base.ts)
 * - Memory: [`src/memory`](./src/memory.ts)
 * - BlackHole: ['src/black-hole](./src/black-hole.ts)
 * - Tiered: ['src/tiered](./src/tiered.ts)
 *
 * @example BaseBlockstore
 *
 * Provides a complete implementation of the Blockstore interface.  You must implement `.get`, `.put`, etc.
 *
 * ```js
 * import { BaseBlockstore } from 'blockstore-core/base'
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
 * @example MemoryBlockstore
 *
 * A simple Blockstore that stores blocks in memory.
 *
 * ```js
 * import { MemoryBlockstore } from 'blockstore-core/memory'
 *
 * const store = new MemoryBlockstore()
 * ```
 *
 * @example BlackHoleBlockstore
 *
 * A Blockstore that does not store any blocks.
 *
 * ```js
 * import { BlackHoleBlockstore } from 'blockstore-core/black-hole'
 *
 * const store = new BlackHoleBlockstore()
 * ```
 *
 * @example TieredBlockstore
 *
 * A tiered blockstore wraps one or more blockstores and will query each in parallel to retrieve a block - the operation will succeed if any wrapped store has the block.
 *
 * Writes are invoked on all wrapped blockstores.
 *
 * ```js
 * import { TieredBlockstore } from 'blockstore-core/tiered'
 *
 * const store = new TieredBlockstore([
 *   store1,
 *   store2,
 *   // ...etc
 * ])
 * ```
 *
 * @example IdentityBlockstore
 *
 * An identity blockstore is one that deals exclusively in Identity CIDs - this is a special CID with the codec [0x00](https://github.com/multiformats/multicodec/blob/d06fc6194710e8909bac64273c43f16b56ca4c34/table.csv#L2) where the multihash digest is the data that makes up the block.
 *
 * ```TypeScript
 * import { IdentityBlockstore } from 'blockstore-core/identity'
 * import { CID } from 'multiformats/cid'
 *
 * const blockstore = new IdentityBlockstore()
 *
 * blockstore.has(CID.parse('QmFoo')) // false
 *
 * blockstore.has(CID.parse('bafkqac3imvwgy3zao5xxe3de')) // true
 * ```
 */

export { BaseBlockstore } from './base.js'
export { MemoryBlockstore } from './memory.js'
export { BlackHoleBlockstore } from './black-hole.js'
export { TieredBlockstore } from './tiered.js'
