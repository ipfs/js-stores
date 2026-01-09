/**
 * @packageDocumentation
 *
 * ⚠️ This package is deprecated. Instead, use `blockstore-fs` in Node.js, and `blockstore-idb` in browsers.
 *
 * A Blockstore implementation that uses a flavour of [Level](https://leveljs.org/) as a backend.
 *
 * @example
 *
 * ```js
 * import { LevelBlockstore } from 'blockstore-level'
 *
 * const store = new LevelBlockstore('path/to/store')
 * ```
 */

import { BaseBlockstore } from 'blockstore-core'
import { DeleteFailedError, GetFailedError, NotFoundError, OpenFailedError, PutFailedError } from 'interface-store'
import all from 'it-all'
import toBuffer from 'it-to-buffer'
import { Level } from 'level'
import { base32upper } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'
import { raceSignal } from 'race-signal'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import type { Pair } from 'interface-blockstore'
import type { AbortOptions, AwaitGenerator, AwaitIterable } from 'interface-store'
import type { DatabaseOptions, OpenOptions, IteratorOptions } from 'level'
import type { MultibaseCodec } from 'multiformats/bases/interface'

export interface LevelBlockstoreInit extends DatabaseOptions<string, Uint8Array>, OpenOptions {
  /**
   * The multibase codec to use - nb. should be case insensitive.
   * default: base32upper
   */
  base?: MultibaseCodec<string>
}

/**
 * A blockstore backed by leveldb
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
      throw new OpenFailedError(String(err))
    }
  }

  async put (key: CID, value: Uint8Array | AwaitIterable<Uint8Array>, options?: AbortOptions): Promise<CID> {
    try {
      options?.signal?.throwIfAborted()

      let buf: Uint8Array

      if (value instanceof Uint8Array) {
        buf = value
      } else {
        buf = toBuffer(await raceSignal(all(value), options?.signal))
      }

      await raceSignal(this.db.put(this.#encode(key), buf), options?.signal)
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }

    return key
  }

  async * get (key: CID, options?: AbortOptions): AwaitGenerator<Uint8Array> {
    let buf

    try {
      options?.signal?.throwIfAborted()
      buf = await raceSignal(this.db.get(this.#encode(key)), options?.signal)
    } catch (err: any) {
      throw new GetFailedError(String(err))
    }

    if (buf == null) {
      throw new NotFoundError()
    }

    yield buf
  }

  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    options?.signal?.throwIfAborted()
    const buf = await raceSignal(this.db.get(this.#encode(key)), options?.signal)

    return buf != null
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    try {
      options?.signal?.throwIfAborted()
      await raceSignal(this.db.del(this.#encode(key)), options?.signal)
    } catch (err: any) {
      throw new DeleteFailedError(String(err))
    }
  }

  async close (): Promise<void> {
    await this.db.close()
  }

  async * getAll (options?: AbortOptions | undefined): AwaitGenerator<Pair> {
    options?.signal?.throwIfAborted()

    for await (const { key, value } of this.#query({ values: true }, options)) {
      yield { cid: this.#decode(key), bytes: value }
    }
  }

  async * #query (opts: { values: boolean, prefix?: string }, options?: AbortOptions): AwaitGenerator<{ key: string, value: AwaitGenerator<Uint8Array> }> {
    options?.signal?.throwIfAborted()

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
        options?.signal?.throwIfAborted()

        yield {
          // @ts-expect-error key is buffer even though types say string
          key: uint8ArrayToString(key),
          value: (async function * () {
            yield value
          })()
        }
        options?.signal?.throwIfAborted()
      }
    } finally {
      await li.close()
    }
  }
}
