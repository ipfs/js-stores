import type { Pair } from 'interface-blockstore'
import { BaseBlockstore, Errors } from 'blockstore-core'
import { Level } from 'level'
import { CID } from 'multiformats/cid'
import type { DatabaseOptions, OpenOptions, IteratorOptions } from 'level'
import type { MultibaseCodec } from 'multiformats/bases/interface'
import { base32upper } from 'multiformats/bases/base32'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'
import type { AbortOptions, AwaitIterable } from 'interface-store'

export interface LevelBlockstoreInit extends DatabaseOptions<string, Uint8Array>, OpenOptions {
  /**
   * The multibase codec to use - nb. should be case insensitive.
   * default: base32upper
   */
  base?: MultibaseCodec<string>
}

/**
 * A datastore backed by leveldb
 */
export class LevelBlockstore extends BaseBlockstore {
  public db: Level<string, Uint8Array>
  private readonly opts: OpenOptions
  private readonly base: MultibaseCodec<string>

  constructor (path: string | Level<string, Uint8Array>, init: LevelBlockstoreInit = {}) {
    super()

    this.db = typeof path === 'string'
      ? new Level(path, {
        ...init,
        keyEncoding: 'utf8',
        valueEncoding: 'view'
      })
      : path

    this.opts = {
      createIfMissing: true,
      compression: false, // same default as go
      ...init
    }

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
      await this.db.open(this.opts)
    } catch (err: any) {
      throw Errors.openFailedError(err)
    }
  }

  async put (key: CID, value: Uint8Array): Promise<CID> {
    try {
      await this.db.put(this.#encode(key), value)

      return key
    } catch (err: any) {
      throw Errors.putFailedError(err)
    }
  }

  async get (key: CID): Promise<Uint8Array> {
    let data
    try {
      data = await this.db.get(this.#encode(key))
    } catch (err: any) {
      if (err.notFound != null) {
        throw Errors.notFoundError(err)
      }

      throw Errors.getFailedError(err)
    }
    return data
  }

  async has (key: CID): Promise<boolean> {
    try {
      await this.db.get(this.#encode(key))
    } catch (err: any) {
      if (err.notFound != null) {
        return false
      }

      throw err
    }
    return true
  }

  async delete (key: CID): Promise<void> {
    try {
      await this.db.del(this.#encode(key))
    } catch (err: any) {
      throw Errors.deleteFailedError(err)
    }
  }

  async close (): Promise<void> {
    await this.db.close()
  }

  async * getAll (options?: AbortOptions | undefined): AwaitIterable<Pair> {
    for await (const { key, value } of this.#query({ values: true })) {
      yield { cid: this.#decode(key), block: value }
    }
  }

  async * #query (opts: { values: boolean, prefix?: string }): AsyncIterable<{ key: string, value: Uint8Array }> {
    const iteratorOpts: IteratorOptions<string, Uint8Array> = {
      keys: true,
      keyEncoding: 'buffer',
      values: opts.values
    }

    // Let the db do the prefix matching
    if (opts.prefix != null) {
      const prefix = opts.prefix.toString()
      // Match keys greater than or equal to `prefix` and
      iteratorOpts.gte = prefix
      // less than `prefix` + \xFF (hex escape sequence)
      iteratorOpts.lt = prefix + '\xFF'
    }

    const li = this.db.iterator(iteratorOpts)

    try {
      for await (const [key, value] of li) {
        // @ts-expect-error key is a buffer because keyEncoding is "buffer"
        yield { key: new TextDecoder().decode(key), value }
      }
    } finally {
      await li.close()
    }
  }
}
