import { NotFoundError } from 'interface-store'
import { BaseBlockstore } from './base.ts'
import type { AbortOptions } from 'abort-error'
import type { Pair } from 'interface-blockstore'
import type { CID } from 'multiformats/cid'

export class BlackHoleBlockstore extends BaseBlockstore {
  put (key: CID, value: Uint8Array | Iterable<Uint8Array> | AsyncIterable<Uint8Array>, options?: AbortOptions): CID | Promise<CID> {
    options?.signal?.throwIfAborted()
    return key
  }

  get (key: CID, options?: AbortOptions): Generator<Uint8Array> | AsyncGenerator<Uint8Array> {
    options?.signal?.throwIfAborted()
    throw new NotFoundError()
  }

  has (key: CID, options?: AbortOptions): boolean | Promise<boolean> {
    options?.signal?.throwIfAborted()
    return false
  }

  async delete (cid: CID, options?: AbortOptions): Promise<void> {
    options?.signal?.throwIfAborted()
  }

  // eslint-disable-next-line require-yield
  async * getAll (options?: AbortOptions): Generator<Pair> | AsyncGenerator<Pair> {
    options?.signal?.throwIfAborted()
  }
}
