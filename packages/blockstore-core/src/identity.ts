import { BaseBlockstore } from './base.js'
import * as Errors from './errors.js'
import type { Pair } from 'interface-blockstore'
import type { Await, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

// https://github.com/multiformats/multicodec/blob/d06fc6194710e8909bac64273c43f16b56ca4c34/table.csv#L2
const IDENTITY_CODEC = 0x00

export class IdentityBlockstore extends BaseBlockstore {
  put (key: CID): CID {
    return key
  }

  get (key: CID): Await<Uint8Array> {
    if (key.code === IDENTITY_CODEC) {
      return key.multihash.digest
    }

    throw Errors.notFoundError()
  }

  has (key: CID): boolean {
    return key.code === IDENTITY_CODEC
  }

  delete (): void {

  }

  * getAll (): AwaitIterable<Pair> {

  }
}
