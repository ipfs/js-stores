import { NotFoundError } from 'interface-store'
import { BaseBlockstore } from './base.js'
import type { Pair } from 'interface-blockstore'
import type { AbortOptions, Await, AwaitIterable } from 'interface-store'
import type { CID } from 'multiformats/cid'

export class BlackHoleBlockstore extends BaseBlockstore {
  put (key: CID, value: Uint8Array, options?: AbortOptions): Await<CID> {
    options?.signal?.throwIfAborted()
    return key
  }

  get (key: CID, options?: AbortOptions): Await<Uint8Array> {
    options?.signal?.throwIfAborted()
    throw new NotFoundError()
  }

  has (key: CID, options?: AbortOptions): Await<boolean> {
    options?.signal?.throwIfAborted()
    return false
  }

  async delete (cid: CID, options?: AbortOptions): Promise<void> {
    options?.signal?.throwIfAborted()
  }

  // eslint-disable-next-line require-yield
  async * getAll (options?: AbortOptions): AwaitIterable<Pair> {
    options?.signal?.throwIfAborted()
  }
}
