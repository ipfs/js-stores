import { Key } from 'interface-datastore/key'
import { NotFoundError } from 'interface-store'
import { BaseDatastore } from './base.ts'
import type { AbortOptions } from 'abort-error'
import type { KeyQuery, Pair, Query } from 'interface-datastore'

export class MemoryDatastore extends BaseDatastore {
  private readonly data: Map<string, Uint8Array>

  constructor () {
    super()

    this.data = new Map()
  }

  put (key: Key, val: Uint8Array, options?: AbortOptions): Key | Promise<Key> {
    options?.signal?.throwIfAborted()

    this.data.set(key.toString(), val)

    return key
  }

  get (key: Key, options?: AbortOptions): Uint8Array | Promise<Uint8Array> {
    options?.signal?.throwIfAborted()

    const result = this.data.get(key.toString())

    if (result == null) {
      throw new NotFoundError()
    }

    return result
  }

  has (key: Key, options?: AbortOptions): boolean | Promise<boolean> {
    options?.signal?.throwIfAborted()
    return this.data.has(key.toString())
  }

  delete (key: Key, options?: AbortOptions): void | Promise<void> {
    options?.signal?.throwIfAborted()
    this.data.delete(key.toString())
  }

  * _all (q: Query, options?: AbortOptions): Generator<Pair> | AsyncGenerator<Pair> {
    options?.signal?.throwIfAborted()
    for (const [key, value] of this.data.entries()) {
      yield { key: new Key(key), value }
      options?.signal?.throwIfAborted()
    }
  }

  * _allKeys (q: KeyQuery, options?: AbortOptions): Generator<Key> | AsyncGenerator<Key> {
    options?.signal?.throwIfAborted()
    for (const key of this.data.keys()) {
      yield new Key(key)
      options?.signal?.throwIfAborted()
    }
  }
}
