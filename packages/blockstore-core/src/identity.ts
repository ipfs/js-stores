import { NotFoundError } from 'interface-store'
import { BaseBlockstore } from './base.js'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { AbortOptions, Await, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

// https://github.com/multiformats/multicodec/blob/d06fc6194710e8909bac64273c43f16b56ca4c34/table.csv#L2
const IDENTITY_CODEC = 0x00

export class IdentityBlockstore extends BaseBlockstore {
  private readonly child?: Blockstore

  constructor (child?: Blockstore) {
    super()

    this.child = child
  }

  put (key: CID, block: Uint8Array): Await<CID> {
    if (key.multihash.code === IDENTITY_CODEC) {
      return key
    }

    if (this.child == null) {
      return key
    }

    return this.child.put(key, block)
  }

  get (key: CID): Await<Uint8Array> {
    if (key.multihash.code === IDENTITY_CODEC) {
      return key.multihash.digest
    }

    if (this.child == null) {
      throw new NotFoundError()
    }

    return this.child.get(key)
  }

  has (key: CID): Await<boolean> {
    if (key.multihash.code === IDENTITY_CODEC) {
      return true
    }

    if (this.child == null) {
      return false
    }

    return this.child.has(key)
  }

  delete (key: CID): Await<void> {
    if (key.code === IDENTITY_CODEC) {
      return
    }

    if (this.child != null) {
      return this.child.delete(key)
    }
  }

  getAll (options?: AbortOptions): AwaitIterable<Pair> {
    if (this.child != null) {
      return this.child.getAll(options)
    }

    return []
  }
}
