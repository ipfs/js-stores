/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { Key } from 'interface-datastore/key'
import { interfaceDatastoreTests } from 'interface-datastore-tests'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { MemoryDatastore } from '../src/memory.js'
import { TieredLimitDatastore } from '../src/tiered-limit.js'
import type { BaseDatastore } from '../src/base.js'

/**
 * @typedef {import('interface-datastore').Datastore} Datastore
 */

describe('TieredLimit', () => {
  describe('all stores', () => {
    const ms: BaseDatastore[] = []
    let store: TieredLimitDatastore<BaseDatastore, BaseDatastore>
    beforeEach(() => {
      ms.push(new MemoryDatastore())
      ms.push(new MemoryDatastore())
      store = new TieredLimitDatastore({
        maxBytes: 50, // 50 bytes limit for testing purposes.
        store: ms[0]
      }, ms[1])
    })

    it('put', async () => {
      const k = new Key('hello')
      const v = uint8ArrayFromString('world')
      await store.put(k, v)
      await expect(store.has(k)).to.eventually.be.true()
      expect(ms[0].get(k)).to.be.eql(v)
      expect(() => ms[1].get(k) as Uint8Array).to.throw('Not Found')
    })

    it('put - first item over limit', async () => {
      const k = new Key('hello-too-big')
      const v = uint8ArrayFromString('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz') // 52 bytes out of 50
      expect(v.byteLength).to.be.eql(52)
      await store.put(k, v)
      expect(ms[0].has(k)).to.be.false()
      expect(ms[1].has(k)).to.be.true()
      await expect(store.has(k)).to.eventually.be.true()
      expect(() => ms[0].get(k) as Uint8Array).to.throw('Not Found')
      expect(ms[1].get(k)).to.be.eql(v)
    })

    it('put - second item over limit', async () => {
      const k = new Key('hello')
      const v = uint8ArrayFromString('abcdefghijklmnopqrstuvwxyz') // 26 bytes out of 50
      const k2 = new Key('hello2')
      await store.put(k, v)
      await store.put(k2, v)
      expect(ms[0].has(k)).to.be.false() // evicted to backing store
      expect(ms[1].has(k)).to.be.true()
      expect(ms[0].has(k2)).to.be.true()
      expect(ms[1].has(k2)).to.be.false()
      await expect(store.has(k)).to.eventually.be.true()
      await expect(store.has(k2)).to.eventually.be.true()
      expect(ms[0].get(k2)).to.be.eql(v)
      expect(ms[1].get(k)).to.be.eql(v)
    })

    it('get - over limit', async () => {
      const k = new Key('hello-get-over-limit')
      const v = uint8ArrayFromString('abcdefghijklmnopqrstuvwxyz') // 26 bytes out of 50
      const k2 = new Key('hello-get-over-limit-2')
      await store.put(k, v)
      await store.put(k2, v)
      expect(ms[0].has(k)).to.be.false() // evicted to backing store
      expect(ms[0].has(k2)).to.be.true()
      expect(ms[1].has(k)).to.be.true()
      expect(ms[1].has(k2)).to.be.false()
      await expect(store.has(k)).to.eventually.be.true()
      await expect(store.has(k2)).to.eventually.be.true()
      expect(ms[0].get(k2)).to.be.eql(v)
      expect(ms[1].get(k)).to.be.eql(v)
      const gotVal = await store.get(k) // should move from backing store to primary store, and evict k2
      expect(gotVal).to.be.eql(v)
      expect(ms[0].has(k)).to.be.true()
      expect(ms[0].has(k2)).to.be.false() // no longer in primary store
      // backing store has both now
      expect(ms[1].has(k)).to.be.true()
      expect(ms[1].has(k2)).to.be.true()

      expect(ms[0].get(k)).to.be.eql(v)
      expect(ms[1].get(k)).to.be.eql(v)
      expect(ms[1].get(k2)).to.be.eql(v)
    })

    it('get and has, where available', async () => {
      const k = new Key('hello')
      const v = uint8ArrayFromString('world')
      await ms[1].put(k, v)
      const val = await store.get(k)
      expect(val).to.be.eql(v)
      const exists = await store.has(k)
      expect(exists).to.be.eql(true)
    })

    it('has - key not found', async () => {
      expect(await store.has(new Key('hello1'))).to.be.eql(false)
    })

    it('has and delete', async () => {
      const k = new Key('hello')
      const v = uint8ArrayFromString('world')
      await store.put(k, v)
      let res = await Promise.all([ms[0].has(k), ms[1].has(k)])
      expect(res).to.be.eql([true, true])
      await store.delete(k)
      res = await Promise.all([ms[0].has(k), ms[1].has(k)])
      expect(res).to.be.eql([false, false])
    })
  })

  describe('inteface-datastore-tiered-limit', () => {
    interfaceDatastoreTests({
      setup () {
        return new TieredLimitDatastore({
          maxBytes: 50, // 50 bytes limit
          store: new MemoryDatastore()
        }, new MemoryDatastore())
      },
      teardown () { }
    })
  })
})
