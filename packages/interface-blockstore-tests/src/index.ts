/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from 'it-all'
import drain from 'it-drain'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import type { Blockstore, Pair } from 'interface-blockstore'

async function getKeyValuePair (data?: string): Promise<Pair> {
  const block = uint8ArrayFromString(data ?? `data-${Math.random()}`)
  const multihash = await sha256.digest(block)
  const cid = CID.createV1(raw.code, multihash)

  return { cid, block }
}

async function getKeyValuePairs (count: number): Promise<Pair[]> {
  return Promise.all(
    new Array(count).fill(0).map(async (_, i) => getKeyValuePair())
  )
}

export interface InterfaceBlockstoreTest<B extends Blockstore = Blockstore> {
  setup: () => B | Promise<B>
  teardown: (store: B) => void | Promise<void>
}

export function interfaceBlockstoreTests <B extends Blockstore = Blockstore> (test: InterfaceBlockstoreTest<B>): void {
  const cleanup = async (store: B): Promise<void> => {
    await test.teardown(store)
  }

  const createStore = async (): Promise<B> => {
    const store = await test.setup()

    if (store == null) {
      throw new Error('missing store')
    }

    return store
  }

  describe('put', () => {
    let store: B

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => {
      await cleanup(store)
    })

    it('simple', async () => {
      const { cid, block } = await getKeyValuePair()

      await store.put(cid, block)
    })

    it('parallel', async () => {
      const data = await getKeyValuePairs(100)

      await Promise.all(data.map(async d => { await store.put(d.cid, d.block) }))

      const res = await all(store.getMany(data.map(d => d.cid)))
      expect(res).to.deep.equal(data)
    })
  })

  describe('putMany', () => {
    let store: B

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => {
      await cleanup(store)
    })

    it('streaming', async () => {
      const data = await getKeyValuePairs(100)

      let index = 0

      for await (const cid of store.putMany(data)) {
        expect(data[index].cid).to.deep.equal(cid)
        index++
      }

      expect(index).to.equal(data.length)

      const res = await all(store.getMany(data.map(d => d.cid)))
      expect(res).to.deep.equal(data)
    })
  })

  describe('get', () => {
    let store: B

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => {
      await cleanup(store)
    })

    it('simple', async () => {
      const {
        cid, block
      } = await getKeyValuePair()

      await store.put(cid, block)

      const res = await store.get(cid)
      expect(res).to.equalBytes(block)
    })

    it('should throw error for missing key', async () => {
      const {
        cid
      } = await getKeyValuePair()

      try {
        await store.get(cid)
      } catch (err) {
        expect(err).to.have.property('code', 'ERR_NOT_FOUND')
        return
      }

      throw new Error('expected error to be thrown')
    })
  })

  describe('getMany', () => {
    let store: B

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => {
      await cleanup(store)
    })

    it('streaming', async () => {
      const {
        cid, block
      } = await getKeyValuePair()

      await store.put(cid, block)
      const source = [cid]

      const res = await all(store.getMany(source))
      expect(res).to.have.lengthOf(1)
      expect(res[0].cid).to.deep.equal(cid)
      expect(res[0].block).to.equalBytes(block)
    })

    it('should throw error for missing key', async () => {
      const {
        cid
      } = await getKeyValuePair()

      try {
        await drain(store.getMany([cid]))
      } catch (err) {
        expect(err).to.have.property('code', 'ERR_NOT_FOUND')
        return
      }

      throw new Error('expected error to be thrown')
    })
  })

  describe('getAll', () => {
    let store: B

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => {
      await cleanup(store)
    })

    it('returns all blocks', async () => {
      const data = await getKeyValuePairs(100)

      await drain(store.putMany(data))

      const allBlocks = await all(store.getAll())

      expect(allBlocks).of.have.lengthOf(data.length)

      // order is not preserved
      for (const { cid, block } of data) {
        const retrievedPair = allBlocks.find(pair => {
          return base32.encode(cid.multihash.bytes) === base32.encode(pair.cid.multihash.bytes)
        })

        expect(retrievedPair).to.be.ok()

        if (retrievedPair == null) {
          throw new Error('Could not find cid/block pair')
        }

        expect(retrievedPair.block).to.equalBytes(block)
      }
    })
  })

  describe('delete', () => {
    let store: B

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => {
      await cleanup(store)
    })

    it('simple', async () => {
      const {
        cid, block
      } = await getKeyValuePair()

      await store.put(cid, block)
      await store.get(cid)
      await store.delete(cid)
      const exists = await store.has(cid)
      expect(exists).to.be.eql(false)
    })

    it('parallel', async () => {
      const data = await getKeyValuePairs(100)

      await Promise.all(data.map(async d => { await store.put(d.cid, d.block) }))

      const res0 = await Promise.all(data.map(async d => store.has(d.cid)))
      res0.forEach(res => expect(res).to.be.eql(true))

      await Promise.all(data.map(async d => { await store.delete(d.cid) }))

      const res1 = await Promise.all(data.map(async d => store.has(d.cid)))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })

  describe('deleteMany', () => {
    let store: B

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => {
      await cleanup(store)
    })

    it('streaming', async () => {
      const data = await getKeyValuePairs(100)

      await drain(store.putMany(data))

      const res0 = await Promise.all(data.map(async d => store.has(d.cid)))
      res0.forEach(res => expect(res).to.be.eql(true))

      let index = 0

      for await (const key of store.deleteMany(data.map(d => d.cid))) {
        expect(data[index].cid).to.deep.equal(key)
        index++
      }

      expect(index).to.equal(data.length)

      const res1 = await Promise.all(data.map(async d => store.has(d.cid)))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })
}
