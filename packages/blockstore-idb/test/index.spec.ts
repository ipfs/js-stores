/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { CID } from 'multiformats/cid'
import { IDBBlockstore } from '../src/index.js'

describe('IndexedDB Blockstore', function () {
  describe('interface-blockstore (idb)', () => {
    interfaceBlockstoreTests({
      async setup () {
        const store = new IDBBlockstore(`hello-${Math.random()}`)
        await store.open()
        return store
      },
      async teardown (store) {
        await store.close()
        await store.destroy()
      }
    })
  })

  describe('concurrency', () => {
    let store: IDBBlockstore

    before(async () => {
      store = new IDBBlockstore('hello')
      await store.open()
    })

    it('should not explode under unreasonable load', function (done) {
      this.timeout(10000)

      const updater = setInterval(async () => {
        try {
          const key = CID.parse('QmaQwYWpchozXhFv8nvxprECWBSCEppN9dfd2VQiJfRo3F')

          await store.put(key, Uint8Array.from([0, 1, 2, 3]))
          await store.has(key)
          await store.get(key)
        } catch (err) {
          clearInterval(updater)
          clearInterval(mutatorQuery)
          clearInterval(readOnlyQuery)
          done(err)
        }
      }, 0)

      const mutatorQuery = setInterval(async () => {
        try {
          for await (const { cid } of store.getAll()) {
            await store.get(cid)

            const otherKey = CID.parse('QmaQwYWpchozXhFv8nvxprECWBSCEppN9dfd2VQiJfRo3F')
            const otherValue = Uint8Array.from([0, 1, 2, 3])
            await store.put(otherKey, otherValue)
            const res = await store.get(otherKey)
            expect(res).to.deep.equal(otherValue)
          }
        } catch (err) {
          clearInterval(updater)
          clearInterval(mutatorQuery)
          clearInterval(readOnlyQuery)
          done(err)
        }
      }, 0)

      const readOnlyQuery = setInterval(async () => {
        try {
          for await (const { cid } of store.getAll()) {
            await store.has(cid)
          }
        } catch (err) {
          clearInterval(updater)
          clearInterval(mutatorQuery)
          clearInterval(readOnlyQuery)
          done(err)
        }
      }, 0)

      setTimeout(() => {
        clearInterval(updater)
        clearInterval(mutatorQuery)
        clearInterval(readOnlyQuery)
        done()
      }, 5000)
    })
  })
})
