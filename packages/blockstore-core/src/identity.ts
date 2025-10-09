import { NotFoundError } from 'interface-store'
import { BaseBlockstore } from './base.js'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { AbortOptions, Await, AwaitGenerator, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

// https://github.com/multiformats/multicodec/blob/d06fc6194710e8909bac64273c43f16b56ca4c34/table.csv#L2
const IDENTITY_CODEC = 0x00

class IdentityHashDigestTooLongError extends Error {
  static name = 'IdentityHashDigestTooLongError'
  name = 'IdentityHashDigestTooLongError'
}

export interface IdentityBlockstoreInit {
  maxDigestLength?: number
}

export class IdentityBlockstore extends BaseBlockstore {
  private readonly child?: Blockstore
  private readonly maxDigestLength?: number

  constructor (child?: Blockstore, init?: IdentityBlockstoreInit) {
    super()

    this.child = child
    this.maxDigestLength = init?.maxDigestLength
  }

  put (key: CID, block: Uint8Array | AwaitIterable<Uint8Array>, options?: AbortOptions): Await<CID> {
    if (key.multihash.code === IDENTITY_CODEC) {
      if (this.maxDigestLength != null && key.multihash.digest.byteLength > this.maxDigestLength) {
        throw new IdentityHashDigestTooLongError(`Identity digest too long - ${key.multihash.digest.byteLength} > this.maxDigestLength`)
      }

      options?.signal?.throwIfAborted()
      return key
    }

    if (this.child == null) {
      options?.signal?.throwIfAborted()
      return key
    }

    return this.child.put(key, block, options)
  }

  * get (key: CID, options?: AbortOptions): AwaitGenerator<Uint8Array> {
    if (key.multihash.code === IDENTITY_CODEC) {
      if (this.maxDigestLength != null && key.multihash.digest.byteLength > this.maxDigestLength) {
        throw new IdentityHashDigestTooLongError(`Identity digest too long - ${key.multihash.digest.byteLength} > this.maxDigestLength`)
      }

      options?.signal?.throwIfAborted()
      yield key.multihash.digest
      return
    }

    if (this.child == null) {
      options?.signal?.throwIfAborted()
      throw new NotFoundError()
    }

    yield * this.child.get(key, options)
  }

  has (key: CID, options?: AbortOptions): Await<boolean> {
    if (key.multihash.code === IDENTITY_CODEC) {
      if (this.maxDigestLength != null && key.multihash.digest.byteLength > this.maxDigestLength) {
        throw new IdentityHashDigestTooLongError(`Identity digest too long - ${key.multihash.digest.byteLength} > this.maxDigestLength`)
      }

      options?.signal?.throwIfAborted()
      return true
    }

    if (this.child == null) {
      options?.signal?.throwIfAborted()
      return false
    }

    return this.child.has(key, options)
  }

  delete (key: CID, options?: AbortOptions): Await<void> {
    if (key.code === IDENTITY_CODEC) {
      if (this.maxDigestLength != null && key.multihash.digest.byteLength > this.maxDigestLength) {
        throw new IdentityHashDigestTooLongError(`Identity digest too long - ${key.multihash.digest.byteLength} > this.maxDigestLength`)
      }

      options?.signal?.throwIfAborted()
      return
    }

    if (this.child != null) {
      return this.child.delete(key, options)
    }
  }

  * getAll (options?: AbortOptions): AwaitGenerator<Pair> {
    if (this.child != null) {
      yield * this.child.getAll(options)
    }

    options?.signal?.throwIfAborted()
  }
}
