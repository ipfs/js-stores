import { NotFoundError } from 'interface-store'
import all from 'it-all'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'
import { BaseBlockstore } from './base.js'
import type { Pair } from 'interface-blockstore'
import type { AbortOptions, Await, AwaitGenerator, AwaitIterable } from 'interface-store'

function isPromise <T> (p?: any): p is Promise<T> {
  return typeof p?.then === 'function'
}

export class MemoryBlockstore extends BaseBlockstore {
  private readonly data: Map<string, Uint8Array[]>

  constructor () {
    super()

    this.data = new Map()
  }

  put (key: CID, val: Uint8Array | AwaitIterable<Uint8Array>, options?: AbortOptions): Await<CID> {
    options?.signal?.throwIfAborted()

    let buf: Uint8Array[]

    if (val instanceof Uint8Array) {
      buf = [val]
    } else {
      const result = all(val)

      if (isPromise<Uint8Array[]>(result)) {
        return result.then(val => {
          return this._put(key, val, options)
        })
      } else {
        buf = result
      }
    }

    return this._put(key, buf, options)
  }

  private _put (key: CID, val: Uint8Array[], options?: AbortOptions): Await<CID> {
    options?.signal?.throwIfAborted()

    this.data.set(base32.encode(key.multihash.bytes), val)

    return key
  }

  * get (key: CID, options?: AbortOptions): AwaitGenerator<Uint8Array> {
    options?.signal?.throwIfAborted()
    const buf = this.data.get(base32.encode(key.multihash.bytes))

    if (buf == null) {
      throw new NotFoundError()
    }

    yield * buf
  }

  has (key: CID, options?: AbortOptions): Await<boolean> {
    options?.signal?.throwIfAborted()
    return this.data.has(base32.encode(key.multihash.bytes))
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    options?.signal?.throwIfAborted()
    this.data.delete(base32.encode(key.multihash.bytes))
  }

  * getAll (options?: AbortOptions): AwaitGenerator<Pair> {
    options?.signal?.throwIfAborted()

    for (const [key, value] of this.data.entries()) {
      yield {
        cid: CID.createV1(raw.code, Digest.decode(base32.decode(key))),
        bytes: (async function * () {
          yield * value
        })()
      }
      options?.signal?.throwIfAborted()
    }
  }
}
