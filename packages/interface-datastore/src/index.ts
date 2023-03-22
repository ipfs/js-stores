import type {
  Await,
  AwaitIterable,
  Store,
  AbortOptions
} from 'interface-store'
import { Key } from './key.js'

export interface Pair {
  key: Key
  value: Uint8Array
}

export interface Batch<BatchOptionsExtension = {}> {
  put: (key: Key, value: Uint8Array) => void
  delete: (key: Key) => void
  commit: (options?: AbortOptions & BatchOptionsExtension) => Await<void>
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
  batch: () => Batch<BatchOptionsExtension>

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
  query: (query: Query, options?: AbortOptions & QueryOptionsExtension) => AwaitIterable<Pair>

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
  queryKeys: (query: KeyQuery, options?: AbortOptions & QueryKeysOptionsExtension) => AwaitIterable<Key>
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
