import { NotFoundError } from 'interface-store'
import { BaseDatastore } from './base.js'
import type { Pair, Query, KeyQuery } from 'interface-datastore'
import type { Key } from 'interface-datastore/key'
import type { AbortOptions, Await, AwaitIterable } from 'interface-store'

export class BlackHoleDatastore extends BaseDatastore {
  put (key: Key, value: Uint8Array, options?: AbortOptions): Await<Key> {
    options?.signal?.throwIfAborted()
    return key
  }

  get (key: Key, options?: AbortOptions): Await<Uint8Array> {
    options?.signal?.throwIfAborted()
    throw new NotFoundError()
  }

  has (key: Key, options?: AbortOptions): Await<boolean> {
    options?.signal?.throwIfAborted()
    return false
  }

  delete (key: Key, options?: AbortOptions): Await<void> {
    options?.signal?.throwIfAborted()
  }

  // eslint-disable-next-line require-yield
  * _all (q: Query, options?: AbortOptions): AwaitIterable<Pair> {
    options?.signal?.throwIfAborted()
  }

  // eslint-disable-next-line require-yield
  * _allKeys (q: KeyQuery, options?: AbortOptions): AwaitIterable<Key> {
    options?.signal?.throwIfAborted()
  }
}
