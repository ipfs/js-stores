/* eslint-disable @typescript-eslint/ban-types */
// this ignore is so we can use {} as the default value for the options
// extensions below - it normally means "any non-nullish value" but here
// we are using it as an intersection type - see the aside at the bottom:
// https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492

/**
 * @packageDocumentation
 *
 * A Datastore is a key/value database that lets store/retrieve binary blobs using namespaced Keys.
 *
 * It is used by IPFS to store/retrieve arbitrary metadata needed to run the node - DHT provider records, signed peer records, etc.
 *
 * ## Backed Implementations
 *
 * - File System: [`datastore-fs`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-fs)
 * - IndexedDB: [`datastore-idb`](https://github.com/ipfs/js-stores/blob/main/packages/datastore-idb)
 * - level: [`datastore-level`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-level) (supports any levelup compatible backend)
 * - Memory: [`datastore-core/memory`](https://github.com/ipfs/js-stores/blob/main/packages/datastore-core/src/memory.ts)
 * - S3: [`datastore-s3`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-s3)
 *
 * ## Wrapper Implementations
 *
 * - Keytransform: [`datstore-core/src/keytransform`](https://github.com/ipfs/js-stores/blob/main/packages/datastore-core/src/keytransform.ts)
 * - Mount: [`datastore-core/src/mount`](https://github.com/ipfs/js-stores/blob/main/packages/datastore-core/src/mount.ts)
 * - Namespace: [`datastore-core/src/namespace`](https://github.com/ipfs/js-stores/blob/main/packages/datastore-core/src/namespace.ts)
 * - Sharding: [`datastore-core/src/sharding`](https://github.com/ipfs/js-stores/blob/main/packages/datastore-core/src/sharding.ts)
 * - Tiered: [`datstore-core/src/tiered`](https://github.com/ipfs/js-stores/blob/main/packages/datastore-core/src/tiered.ts)
 *
 * If you want the same functionality as [go-ds-flatfs](https://github.com/ipfs/go-ds-flatfs), use sharding with fs.
 *
 * @example
 *
 * ```js
 * import FsStore from 'datastore-fs'
 * import { ShardingDataStore, shard } from 'datastore-core'
 *
 * const fs = new FsStore('path/to/store')
 *
 * // flatfs now works like go-flatfs
 * const flatfs = await ShardingStore.createOrOpen(fs, new shard.NextToLast(2))
 * ```
 *
 * ### Test suite
 *
 * Available via the [`interface-datastore-tests`](https://npmjs.com/package/interface-datastore-tests) module
 *
 * ```js
 * import { interfaceDatastoreTests } from 'interface-datastore-tests'
 *
 * describe('mystore', () => {
 *   interfaceDatastoreTests({
 *     async setup () {
 *       return instanceOfMyStore
 *     },
 *     async teardown () {
 *       // cleanup resources
 *     }
 *   })
 * })
 * ```
 *
 * ### Aborting requests
 *
 * Most API methods accept an \[AbortSignal]\[] as part of an options object.  Implementations may listen for an `abort` event emitted by this object, or test the `signal.aborted` property. When received implementations should tear down any long-lived requests or resources created.
 *
 * ### Concurrency
 *
 * The streaming `(put|get|delete)Many` methods are intended to be used with modules such as [it-parallel-batch](https://www.npmjs.com/package/it-parallel-batch) to allow calling code to control levels of parallelisation.  The batching method ensures results are returned in the correct order, but interface implementations should be thread safe.
 *
 * ```js
 * import batch from 'it-parallel-batch'
 * const source = [{
 *   key: ..,
 *   value: ..
 * }]
 *
 * // put values into the datastore concurrently, max 10 at a time
 * for await (const { key, data } of batch(store.putMany(source), 10)) {
 *   console.info(`Put ${key}`)
 * }
 * ```
 *
 * ### Keys
 *
 * To allow a better abstraction on how to address values, there is a `Key` class which is used as identifier. It's easy to create a key from a `Uint8Array` or a `string`.
 *
 * ```js
 * const a = new Key('a')
 * const b = new Key(new Uint8Array([0, 1, 2, 3]))
 * ```
 *
 * The key scheme is inspired by file systems and Google App Engine key model. Keys are meant to be unique across a system. They are typically hierarchical, incorporating more and more specific namespaces. Thus keys can be deemed 'children' or 'ancestors' of other keys:
 *
 * - `new Key('/Comedy')`
 * - `new Key('/Comedy/MontyPython')`
 *
 * Also, every namespace can be parameterized to embed relevant object information. For example, the Key `name` (most specific namespace) could include the object type:
 *
 * - `new Key('/Comedy/MontyPython/Actor:JohnCleese')`
 * - `new Key('/Comedy/MontyPython/Sketch:CheeseShop')`
 * - `new Key('/Comedy/MontyPython/Sketch:CheeseShop/Character:Mousebender')`
 */

import { Key } from './key.js'
import type {
  Await,
  AwaitIterable,
  Store,
  AbortOptions
} from 'interface-store'

export interface Pair {
  key: Key
  value: Uint8Array
}

export interface Batch<BatchOptionsExtension = {}> {
  put(key: Key, value: Uint8Array): void
  delete(key: Key): void
  commit(options?: AbortOptions & BatchOptionsExtension): Await<void>
}

export interface Datastore <HasOptionsExtension = {},
PutOptionsExtension = {}, PutManyOptionsExtension = {},
GetOptionsExtension = {}, GetManyOptionsExtension = {},
DeleteOptionsExtension = {}, DeleteManyOptionsExtension = {},
QueryOptionsExtension = {}, QueryKeysOptionsExtension = {},
BatchOptionsExtension = {}
> extends Store<Key, Uint8Array, Pair, HasOptionsExtension,
  PutOptionsExtension, PutManyOptionsExtension,
  GetOptionsExtension, GetManyOptionsExtension,
  DeleteOptionsExtension, DeleteManyOptionsExtension> {
  /**
   * This will return an object with which you can chain multiple operations together, with them only being executed on calling `commit`.
   *
   * @example
   * ```js
   * const b = store.batch()
   *
   * for (let i = 0; i < 100; i++) {
   *   b.put(new Key(`hello${i}`), new TextEncoder('utf8').encode(`hello world ${i}`))
   * }
   *
   * await b.commit()
   * console.log('put 100 values')
   * ```
   */
  batch(): Batch<BatchOptionsExtension>

  /**
   * Query the datastore.
   *
   * @example
   * ```js
   * // retrieve __all__ key/value pairs from the store
   * let list = []
   * for await (const { key, value } of store.query({})) {
   *   list.push(value)
   * }
   * console.log('ALL THE VALUES', list)
   * ```
   */
  query(query: Query, options?: AbortOptions & QueryOptionsExtension): AwaitIterable<Pair>

  /**
   * Query the datastore.
   *
   * @example
   * ```js
   * // retrieve __all__ keys from the store
   * let list = []
   * for await (const key of store.queryKeys({})) {
   *   list.push(key)
   * }
   * console.log('ALL THE KEYS', key)
   * ```
   */
  queryKeys(query: KeyQuery, options?: AbortOptions & QueryKeysOptionsExtension): AwaitIterable<Key>
}

export interface QueryFilter { (item: Pair): boolean }
export interface QueryOrder { (a: Pair, b: Pair): -1 | 0 | 1 }

export interface Query {
  prefix?: string
  filters?: QueryFilter[]
  orders?: QueryOrder[]
  limit?: number
  offset?: number
}

export interface KeyQueryFilter { (item: Key): boolean }
export interface KeyQueryOrder { (a: Key, b: Key): -1 | 0 | 1 }

export interface KeyQuery {
  prefix?: string
  filters?: KeyQueryFilter[]
  orders?: KeyQueryOrder[]
  limit?: number
  offset?: number
}

export { Key }
