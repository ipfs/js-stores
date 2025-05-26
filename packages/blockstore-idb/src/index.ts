/**
 * @packageDocumentation
 *
 * A Blockstore implementation for browsers that stores blocks in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
 *
 * @example
 *
 * ```js
 * import { IDBBlockstore } from 'blockstore-idb'
 *
 * const store = new IDBBlockstore('path/to/store')
 * ```
 */

import { BaseBlockstore } from 'blockstore-core'
import { openDB, deleteDB } from 'idb'
import { OpenFailedError, PutFailedError, NotFoundError } from 'interface-store'
import { base32upper } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'
import type { IDBPDatabase } from 'idb'
import type { Pair } from 'interface-blockstore'
import type { AbortOptions, AwaitIterable } from 'interface-store'
import type { MultibaseCodec } from 'multiformats/bases/interface'

export interface IDBBlockstoreInit {
  /**
   * A prefix to use for all database keys (default: '')
   */
  prefix?: string

  /**
   * The database version (default: 1)
   */
  version?: number

  /**
   * The multibase codec to use - nb. should be case insensitive.
   * (default: base32upper)
   */
  base?: MultibaseCodec<string>
}

export class IDBBlockstore extends BaseBlockstore {
  private readonly location: string
  private readonly version: number
  private db?: IDBPDatabase
  private readonly base: MultibaseCodec<string>

  constructor (location: string, init: IDBBlockstoreInit = {}) {
    super()

    this.location = `${init.prefix ?? ''}${location}`
    this.version = init.version ?? 1

    // this.transactionQueue = new PQueue({ concurrency: 1 })
    this.base = init.base ?? base32upper
  }

  #encode (cid: CID): string {
    return `/${this.base.encoder.encode(cid.multihash.bytes)}`
  }

  #decode (key: string): CID {
    return CID.createV1(raw.code, Digest.decode(this.base.decoder.decode(key.substring(1))))
  }

  async open (): Promise<void> {
    try {
      const location = this.location

      this.db = await openDB(location, this.version, {
        upgrade (db) {
          db.createObjectStore(location)
        }
      })
    } catch (err: any) {
      throw new OpenFailedError(String(err))
    }
  }

  async close (): Promise<void> {
    this.db?.close()
  }

  async put (key: CID, val: Uint8Array): Promise<CID> {
    if (this.db == null) {
      throw new Error('Blockstore needs to be opened.')
    }

    try {
      await this.db.put(this.location, val, this.#encode(key))

      return key
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async get (key: CID): Promise<Uint8Array> {
    if (this.db == null) {
      throw new Error('Blockstore needs to be opened.')
    }

    let val: Uint8Array | undefined

    try {
      val = await this.db.get(this.location, this.#encode(key))
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }

    if (val === undefined) {
      throw new NotFoundError()
    }

    return val
  }

  async delete (key: CID): Promise<void> {
    if (this.db == null) {
      throw new Error('Blockstore needs to be opened.')
    }

    try {
      await this.db.delete(this.location, this.#encode(key))
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async has (key: CID): Promise<boolean> {
    if (this.db == null) {
      throw new Error('Blockstore needs to be opened.')
    }

    try {
      return Boolean(await this.db.getKey(this.location, this.#encode(key)))
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  async * getAll (options?: AbortOptions): AwaitIterable<Pair> {
    if (this.db == null) {
      throw new Error('Blockstore needs to be opened.')
    }

    for (const key of await this.db.getAllKeys(this.location)) {
      const cid = this.#decode(key.toString())
      const block = await this.get(cid)

      yield { cid, block }
    }
  }

  async destroy (): Promise<void> {
    await deleteDB(this.location)
  }
}
