/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import all from 'it-all'
import { CID } from 'multiformats/cid'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { MemoryBlockstore } from '../src/memory.js'
import { TieredBlockstore } from '../src/tiered.js'
import type { Blockstore } from 'interface-blockstore'

describe('Tiered', () => {
  describe('all stores', () => {
    const ms: Blockstore[] = []
    let store: TieredBlockstore
    beforeEach(() => {
      ms.push(new MemoryBlockstore())
      ms.push(new MemoryBlockstore())
      store = new TieredBlockstore(ms)
    })

    it('put', async () => {
      const k = CID.parse('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL')
      const v = uint8ArrayFromString('world')
      await store.put(k, v)
      const res = await Promise.all([all(ms[0].get(k)), all(ms[1].get(k))])
      res.forEach((val) => {
        expect(val).to.deep.equal([v])
      })
    })

    it('get and has, where available', async () => {
      const k = CID.parse('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL')
      const v = uint8ArrayFromString('world')
      await ms[1].put(k, v)
      const val = await all(store.get(k))
      expect(val).to.deep.equal([v])
      const exists = await store.has(k)
      expect(exists).to.equal(true)
    })

    it('has - key not found', async () => {
      expect(await store.has(CID.parse('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnA'))).to.equal(false)
    })

    it('has and delete', async () => {
      const k = CID.parse('QmTp9VkYvnHyrqKQuFPiuZkiX9gPcqj6x5LJ1rmWuSySnL')
      const v = uint8ArrayFromString('world')
      await store.put(k, v)
      let res = await Promise.all([ms[0].has(k), ms[1].has(k)])
      expect(res).to.deep.equal([true, true])
      await store.delete(k)
      res = await Promise.all([ms[0].has(k), ms[1].has(k)])
      expect(res).to.deep.equal([false, false])
    })
  })

  describe('inteface-blockstore-single', () => {
    interfaceBlockstoreTests({
      setup () {
        return new TieredBlockstore([
          new MemoryBlockstore(),
          new MemoryBlockstore()
        ])
      },
      teardown () { }
    })
  })
})
