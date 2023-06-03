import { BaseBlockstore } from './base.js'
import * as Errors from './errors.js'
import type { Pair } from 'interface-blockstore'
import type { Await, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

export class BlackHoleBlockstore extends BaseBlockstore {
  put (key: CID): Await<CID> {
    return key
  }

  get (): Await<Uint8Array> {
    throw Errors.notFoundError()
  }

  has (): Await<boolean> {
    return false
  }

  async delete (): Promise<void> {

  }

  async * getAll (): AwaitIterable<Pair> {

  }
}
