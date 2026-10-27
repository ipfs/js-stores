import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import all from 'it-all'
import drain from 'it-drain'
import { CID } from 'multiformats/cid'
import { IDBBlockstore } from '../src/index.ts'

describe('IndexedDB Blockstore', () => {
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
          await drain(store.get(key))
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
            await drain(store.get(cid))

            const otherKey = CID.parse('QmaQwYWpchozXhFv8nvxprECWBSCEppN9dfd2VQiJfRo3F')
            const otherValue = Uint8Array.from([0, 1, 2, 3])
            await store.put(otherKey, otherValue)
            const res = await all(store.get(otherKey))
            expect(res).to.deep.equal([otherValue])
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

  describe('views', () => {
    let store: IDBBlockstore

    before(async () => {
      store = new IDBBlockstore(`views-${Math.random()}`)
      await store.open()
    })

    after(async () => {
      await store.close()
      await store.destroy()
    })

    it('should store only the bytes of a view, not its whole backing buffer', async () => {
      const view = new Uint8Array(1024 * 1024).subarray(100, 104)
      view.set([0, 1, 2, 3])
      const key = CID.parse('QmaQwYWpchozXhFv8nvxprECWBSCEppN9dfd2VQiJfRo3F')

      await store.put(key, view)
      const [stored] = await all(store.get(key))

      expect(stored).to.deep.equal(Uint8Array.from([0, 1, 2, 3]))
      expect(stored.byteOffset).to.equal(0)
      expect(stored.buffer.byteLength).to.equal(4)
    })
  })
})
