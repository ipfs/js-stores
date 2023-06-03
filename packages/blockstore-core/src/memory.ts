import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'
import { BaseBlockstore } from './base.js'
import * as Errors from './errors.js'
import type { Pair } from 'interface-blockstore'
import type { Await, AwaitIterable } from 'interface-store'

export class MemoryBlockstore extends BaseBlockstore {
  private readonly data: Map<string, Uint8Array>

  constructor () {
    super()

    this.data = new Map()
  }

  put (key: CID, val: Uint8Array): Await<CID> { // eslint-disable-line require-await
    this.data.set(base32.encode(key.multihash.bytes), val)

    return key
  }

  get (key: CID): Await<Uint8Array> {
    const buf = this.data.get(base32.encode(key.multihash.bytes))

    if (buf == null) {
      throw Errors.notFoundError()
    }

    return buf
  }

  has (key: CID): Await<boolean> {
    return this.data.has(base32.encode(key.multihash.bytes))
  }

  async delete (key: CID): Promise<void> {
    this.data.delete(base32.encode(key.multihash.bytes))
  }

  async * getAll (): AwaitIterable<Pair> {
    for (const [key, value] of this.data.entries()) {
      yield {
        cid: CID.createV1(raw.code, Digest.decode(base32.decode(key))),
        block: value
      }
    }
  }
}
