/* eslint-env mocha */

import { MountDatastore } from 'datastore-core'
import { Key } from 'interface-datastore'
import { IDBDatastore } from '../src/index.js'
import { expect } from 'aegir/chai'
import { interfaceDatastoreTests } from 'interface-datastore-tests'

describe('IndexedDB Datastore', function () {
  describe('interface-datastore (idb)', () => {
    interfaceDatastoreTests({
      async setup () {
        const store = new IDBDatastore(`hello-${Date.now()}`)
        await store.open()
        return store
      },
      async teardown (store) {
        await store.close()
        await store.destroy()
      }
    })
  })

  describe('interface-datastore (mount(idb, idb, idb))', () => {
    interfaceDatastoreTests({
      async setup () {
        const one = new IDBDatastore(`one-${Date.now()}`)
        const two = new IDBDatastore(`two-${Date.now()}`)
        const three = new IDBDatastore(`three-${Date.now()}`)

        await one.open()
        await two.open()
        await three.open()

        const d = new MountDatastore([
          {
            prefix: new Key('/a'),
            datastore: one
          },
          {
            prefix: new Key('/q'),
            datastore: two
          },
          {
            prefix: new Key('/z'),
            datastore: three
          }
        ])

        return d
      },
      teardown () {

      }
    })
  })

  describe('concurrency', () => {
    let store: IDBDatastore

    beforeEach(async () => {
      store = new IDBDatastore('hello')
      await store.open()
    })

    it('should not explode under unreasonable load', function (done) {
      this.timeout(10000)

      const updater = setInterval(async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
        try {
          const key = new Key(`/a-${Date.now()}`)

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

      const mutatorQuery = setInterval(async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
        try {
          for await (const { key } of store.query({})) {
            await store.get(key)

            const otherKey = new Key(`/b-${Date.now()}`)
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

      const readOnlyQuery = setInterval(async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
        try {
          for await (const { key } of store.query({})) {
            await store.has(key)
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
