import { NotFoundError } from 'interface-store'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'
import { BaseBlockstore } from './base.js'
import type { Pair } from 'interface-blockstore'
import type { AbortOptions, Await, AwaitIterable } from 'interface-store'

export class MemoryBlockstore extends BaseBlockstore {
  private readonly data: Map<string, Uint8Array>

  constructor () {
    super()

    this.data = new Map()
  }

  put (key: CID, val: Uint8Array, options?: AbortOptions): Await<CID> {
    options?.signal?.throwIfAborted()
    this.data.set(base32.encode(key.multihash.bytes), val)

    return key
  }

  get (key: CID, options?: AbortOptions): Await<Uint8Array> {
    options?.signal?.throwIfAborted()
    const buf = this.data.get(base32.encode(key.multihash.bytes))

    if (buf == null) {
      throw new NotFoundError()
    }

    return buf
  }

  has (key: CID, options?: AbortOptions): Await<boolean> {
    options?.signal?.throwIfAborted()
    return this.data.has(base32.encode(key.multihash.bytes))
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    options?.signal?.throwIfAborted()
    this.data.delete(base32.encode(key.multihash.bytes))
  }

  async * getAll (options?: AbortOptions): AwaitIterable<Pair> {
    options?.signal?.throwIfAborted()

    for (const [key, value] of this.data.entries()) {
      yield {
        cid: CID.createV1(raw.code, Digest.decode(base32.decode(key))),
        block: value
      }
      options?.signal?.throwIfAborted()
    }
  }
}
