import { NotFoundError } from 'interface-store'
import { BaseDatastore } from './base.ts'
import type { AbortOptions } from 'abort-error'
import type { Pair, Query, KeyQuery } from 'interface-datastore'
import type { Key } from 'interface-datastore/key'

export class BlackHoleDatastore extends BaseDatastore {
  put (key: Key, value: Uint8Array, options?: AbortOptions): Key | Promise<Key> {
    options?.signal?.throwIfAborted()
    return key
  }

  get (key: Key, options?: AbortOptions): Uint8Array | Promise<Uint8Array> {
    options?.signal?.throwIfAborted()
    throw new NotFoundError()
  }

  has (key: Key, options?: AbortOptions): boolean | Promise<boolean> {
    options?.signal?.throwIfAborted()
    return false
  }

  delete (key: Key, options?: AbortOptions): void | Promise<void> {
    options?.signal?.throwIfAborted()
  }

  // eslint-disable-next-line require-yield
  * _all (q: Query, options?: AbortOptions): Generator<Pair> | AsyncGenerator<Pair> {
    options?.signal?.throwIfAborted()
  }

  // eslint-disable-next-line require-yield
  * _allKeys (q: KeyQuery, options?: AbortOptions): Generator<Key> | AsyncGenerator<Key> {
    options?.signal?.throwIfAborted()
  }
}
