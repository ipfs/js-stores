/**
 * @packageDocumentation
 *
 * Various Datastore implementations are available.
 *
 * ## BaseDatastore
 *
 * An base store is made available to make implementing your own datastore easier.
 *
 * @example
 *
 * ```javascript
 * import { BaseDatastore } from 'datastore-core'
 *
 * class MyDatastore extends BaseDatastore {
 *   constructor () {
 *     super()
 *   }
 *
 *   async put (key, val) {
 *     // your implementation here
 *   }
 *
 *   async get (key) {
 *     // your implementation here
 *   }
 *
 *   // etc...
 * }
 * ```
 *
 * See the [MemoryDatastore](https://github.com/ipfs/js-stores/blob/main/packages/datastore-core/src/memory.ts) for an example of how it is used.
 *
 * ## Wrapping Stores
 *
 * @example
 *
 * ```js
 * import { Key } from 'interface-datastore'
 * import {
 *   MemoryStore,
 *   MountStore
 * } from 'datastore-core'
 *
 * const store = new MountStore({prefix: new Key('/a'), datastore: new MemoryStore()})
 * ```
 *
 * ## BlackHoleDatastore
 *
 * @example
 *
 * A datastore that does not store any data.
 *
 * ```js
 * import { BlackHoleDatastore } from 'datastore-core'
 *
 * const store = new BlackHoleDatastore()
 * ```
 */

import * as shard from './shard.ts'
import type { Key } from 'interface-datastore'

export { BaseDatastore } from './base.ts'
export { MemoryDatastore } from './memory.ts'
export { KeyTransformDatastore } from './keytransform.ts'
export { ShardingDatastore } from './sharding.ts'
export { MountDatastore } from './mount.ts'
export { TieredDatastore } from './tiered.ts'
export { NamespaceDatastore } from './namespace.ts'

export { shard }

export interface Shard {
  name: string
  param: number
  readonly _padding: string
  fun(s: string): string
  toString(): string
}

export interface KeyTransform {
  convert(key: Key): Key
  invert(key: Key): Key
}
