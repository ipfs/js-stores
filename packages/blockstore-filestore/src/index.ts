import { DataObj } from './pb/dataobj.js'
import { readChunk, cidToKey, keyToCid } from './utils.js'
import type { Blockstore, Pair } from 'interface-blockstore'
import type { Datastore } from 'interface-datastore'
import type { AbortOptions, AwaitIterable, Await } from 'interface-store'
import type { CID } from 'multiformats/cid'

export class Filestore implements Blockstore {
  private readonly blockstore: Blockstore
  private readonly datastore: Datastore

  constructor (blockstore: Blockstore, datastore: Datastore) {
    this.blockstore = blockstore
    this.datastore = datastore
  }

  async get (key: CID, options?: AbortOptions): Promise<Uint8Array> {
    if (await this.blockstore.has(key, options)) {
      const block = await this.blockstore.get(key, options)

      return block
    }

    const dKey = cidToKey(key)
    const index = await this.datastore.get(dKey, options)
    const dataObj = DataObj.decode(index)
    const chunk = await readChunk(dataObj.FilePath, dataObj.Offset, dataObj.Size)

    return chunk
  }

  async * getMany (source: AwaitIterable<CID>, options?: AbortOptions): AsyncGenerator<Pair, void, undefined> {
    for await (const cid of source) {
      const block = await this.get(cid, options)

      yield { cid, block }
    }
  }

  async * getAll (options?: AbortOptions): AsyncGenerator<Pair, void, undefined> {
    yield * this.blockstore.getAll(options)

    const keys = this.datastore.queryKeys({ filters: [() => true] }, options)

    for await (const key of keys) {
      let cid: CID

      try {
        cid = keyToCid(key)
      } catch (error) {
        continue
      }

      const block = await this.get(cid, options)

      yield { block, cid }
    }
  }

  async has (key: CID): Promise<boolean> {
    if (await this.blockstore.has(key)) {
      return true
    }

    const dKey = cidToKey(key)
    const hasKey = await this.datastore.has(dKey)

    return hasKey
  }

  put (key: CID, val: Uint8Array, options?: AbortOptions): Await<CID> {
    return this.blockstore.put(key, val, options)
  }

  putMany (source: AwaitIterable<Pair>, options?: AbortOptions): AwaitIterable<CID> {
    return this.blockstore.putMany(source, options)
  }

  async delete (key: CID, options?: AbortOptions): Promise<void> {
    const dKey = cidToKey(key)

    await Promise.all([
      this.blockstore.delete(key, options),
      this.datastore.delete(dKey, options)
    ])
  }

  async * deleteMany (source: AwaitIterable<CID>, options?: AbortOptions): AwaitIterable<CID> {
    for await (const cid of source) {
      await this.delete(cid, options)
      yield cid
    }
  }

  async putLink (key: CID, path: string, offset: bigint, size: bigint, options?: AbortOptions): Promise<CID> {
    const data = DataObj.encode({
      FilePath: path,
      Offset: offset,
      Size: size
    })

    const dKey = cidToKey(key)

    await this.datastore.put(dKey, data, options)

    return key
  }
}
