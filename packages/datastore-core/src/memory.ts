import { Key } from 'interface-datastore/key'
import { NotFoundError } from 'interface-store'
import { BaseDatastore } from './base.js'
import type { KeyQuery, Pair, Query } from 'interface-datastore'
import type { AbortOptions, Await, AwaitIterable } from 'interface-store'

export class MemoryDatastore extends BaseDatastore {
  private readonly data: Map<string, Uint8Array>

  constructor () {
    super()

    this.data = new Map()
  }

  put (key: Key, val: Uint8Array, options?: AbortOptions): Await<Key> {
    options?.signal?.throwIfAborted()

    this.data.set(key.toString(), val)

    return key
  }

  get (key: Key, options?: AbortOptions): Await<Uint8Array> {
    options?.signal?.throwIfAborted()

    const result = this.data.get(key.toString())

    if (result == null) {
      throw new NotFoundError()
    }

    return result
  }

  has (key: Key, options?: AbortOptions): Await<boolean> {
    options?.signal?.throwIfAborted()
    return this.data.has(key.toString())
  }

  delete (key: Key, options?: AbortOptions): Await<void> {
    options?.signal?.throwIfAborted()
    this.data.delete(key.toString())
  }

  * _all (q: Query, options?: AbortOptions): AwaitIterable<Pair> {
    options?.signal?.throwIfAborted()
    for (const [key, value] of this.data.entries()) {
      yield { key: new Key(key), value }
      options?.signal?.throwIfAborted()
    }
  }

  * _allKeys (q: KeyQuery, options?: AbortOptions): AwaitIterable<Key> {
    options?.signal?.throwIfAborted()
    for (const key of this.data.keys()) {
      yield new Key(key)
      options?.signal?.throwIfAborted()
    }
  }
}
