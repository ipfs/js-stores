/* eslint-env mocha */

/**
 * @packageDocumentation
 *
 * A test suite that ensures a given implementation implements the Blockstore interface properly.
 *
 * @example
 *
 * ```js
 * const MyBlockstore from './path/to/my-blockstore')
 * const suite from 'interface-blockstore-tests')
 *
 * describe('MyBlockstore', () => {
 *   describe('interface-blockstore compliance tests', () => {
 *     suite({
 *       setup () {
 *         return new MyBlockstore()
 *       },
 *       teardown () {}
 *     })
 *   })
 * })
 * ```
 */

import { expect } from 'aegir/chai'
import all from 'it-all'
import drain from 'it-drain'
import map from 'it-map'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import type { Blockstore } from 'interface-blockstore'

interface Data {
  cid: CID
  block: Uint8Array
}

async function * toGenerator <T> (buf: T): AsyncGenerator<T> {
  yield buf
}

async function getKeyValuePair (data?: string): Promise<Data> {
  const block = uint8ArrayFromString(data ?? `data-${Math.random()}`)
  const multihash = await sha256.digest(block)
  const cid = CID.createV1(raw.code, multihash)

  return { cid, block }
}

async function getKeyValuePairs (count: number): Promise<Data[]> {
  return Promise.all(
    new Array(count).fill(0).map(async (_, i) => getKeyValuePair())
  )
}

export interface InterfaceBlockstoreTest<B extends Blockstore = Blockstore> {
  setup(): B | Promise<B>
  teardown(store: B): void | Promise<void>
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

      await store.put(cid, toGenerator(block))
    })

    it('supports abort signals', async () => {
      const { cid, block } = await getKeyValuePair()

      const controller = new AbortController()
      controller.abort()

      await expect((async () => {
        return store.put(cid, toGenerator(block), {
          signal: controller.signal
        })
      })()).to.eventually.be.rejected
        .with.property('message')
        .that.include('abort')
    })

    it('parallel', async () => {
      const data = await getKeyValuePairs(1)

      await Promise.all(data.map(async d => {
        await store.put(d.cid, toGenerator(d.block))
      }))

      const res = await all(map(store.getMany(data.map(d => d.cid)), async ({ cid, bytes }) => ({
        cid,
        block: (await all(bytes))[0]
      })))

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

      for await (const cid of store.putMany(data.map(({ cid, block }) => ({
        cid,
        bytes: toGenerator(block)
      })))) {
        expect(data[index].cid).to.deep.equal(cid)
        index++
      }

      expect(index).to.equal(data.length)

      const res = await all(map(store.getMany(data.map(d => d.cid)), async ({ cid, bytes }) => ({
        cid,
        block: (await all(bytes))[0]
      })))
      expect(res).to.deep.equal(data)
    })

    it('supports abort signals', async () => {
      const { cid, block } = await getKeyValuePair()

      const controller = new AbortController()
      controller.abort()

      await expect(all(store.putMany([{ cid, bytes: toGenerator(block) }], {
        signal: controller.signal
      }))).to.eventually.be.rejected
        .with.property('message')
        .that.include('abort')
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

      await store.put(cid, toGenerator(block))

      const res = await all(store.get(cid))
      expect(res).to.deep.equal([block])
    })

    it('supports abort signals', async () => {
      const { cid } = await getKeyValuePair()

      const controller = new AbortController()
      controller.abort()

      await expect(drain((async function * () {
        yield * store.get(cid, {
          signal: controller.signal
        })
      })())).to.eventually.be.rejected
        .with.property('message')
        .that.include('abort')
    })

    it('should throw error for missing key', async () => {
      const {
        cid
      } = await getKeyValuePair()

      try {
        await all(store.get(cid))
      } catch (err) {
        expect(err).to.have.property('name', 'NotFoundError')
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

      await store.put(cid, toGenerator(block))
      const source = [cid]

      const res = await all(store.getMany(source))
      expect(res).to.have.lengthOf(1)
      expect(res[0].cid).to.deep.equal(cid)
      expect(await all(res[0].bytes)).to.deep.equal([block])
    })

    it('supports abort signals', async () => {
      const { cid, block } = await getKeyValuePair()

      await store.put(cid, toGenerator(block))

      const controller = new AbortController()
      controller.abort()

      await expect(drain(map(store.getMany([cid], {
        signal: controller.signal
      }), async ({ cid, bytes }) => ({
        cid,
        bytes: await all(bytes)
      })))).to.eventually.be.rejected
        .with.property('message')
        .that.include('abort')
    })

    it('should throw error for missing key', async () => {
      const {
        cid
      } = await getKeyValuePair()

      await expect(drain(map(store.getMany([cid]), async ({ cid, bytes }) => ({
        cid,
        bytes: await all(bytes)
      })))).to.eventually.be.rejected
        .with.property('name', 'NotFoundError')
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

      await drain(store.putMany(data.map(({ cid, block }) => ({
        cid,
        bytes: toGenerator(block)
      }))))

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

        await expect(all(retrievedPair.bytes)).to.eventually.deep.equal([block])
      }
    })

    it('supports abort signals', async () => {
      const { cid, block } = await getKeyValuePair()

      await store.put(cid, toGenerator(block))

      const controller = new AbortController()
      controller.abort()

      await expect((async () => {
        return all(store.getAll({
          signal: controller.signal
        }))
      })()).to.eventually.be.rejected
        .with.property('message')
        .that.include('abort')
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

      await store.put(cid, toGenerator(block))
      await drain(store.get(cid))
      await store.delete(cid)
      const exists = await store.has(cid)
      expect(exists).to.be.false()
    })

    it('supports abort signals', async () => {
      const { cid, block } = await getKeyValuePair()

      await store.put(cid, toGenerator(block))

      const controller = new AbortController()
      controller.abort()

      await expect((async () => {
        return store.delete(cid, {
          signal: controller.signal
        })
      })()).to.eventually.be.rejected
        .with.property('message')
        .that.include('abort')
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

      await drain(store.putMany(data.map(({ cid, block }) => ({
        cid,
        bytes: toGenerator(block)
      }))))

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

    it('supports abort signals', async () => {
      const { cid, block } = await getKeyValuePair()

      await store.put(cid, block)

      const controller = new AbortController()
      controller.abort()

      await expect((async () => {
        return all(store.deleteMany([cid], {
          signal: controller.signal
        }))
      })()).to.eventually.be.rejected
        .with.property('message')
        .that.include('abort')
    })
  })
}
