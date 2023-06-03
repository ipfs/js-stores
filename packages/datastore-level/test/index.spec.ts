/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { interfaceDatastoreTests } from 'interface-datastore-tests'
import tempdir from 'ipfs-utils/src/temp-dir.js'
import { Level } from 'level'
import { MemoryLevel } from 'memory-level'
import { LevelDatastore } from '../src/index.js'

describe('LevelDatastore', () => {
  describe('initialization', () => {
    it('should default to a leveldown database', async () => {
      const levelStore = new LevelDatastore(`${tempdir()}/init-default-${Date.now()}`)
      await levelStore.open()

      expect(levelStore.db).to.be.an.instanceOf(Level)
    })

    it('should be able to override the database', async () => {
      const levelStore = new LevelDatastore(
        // @ts-expect-error MemoryLevel does not implement the same interface as Level
        new MemoryLevel({
          keyEncoding: 'utf8',
          valueEncoding: 'view'
        })
      )

      await levelStore.open()

      expect(levelStore.db).to.be.an.instanceOf(MemoryLevel)
    })
  })

  describe('interface-datastore MemoryLevel', () => {
    interfaceDatastoreTests({
      async setup () {
        const store = new LevelDatastore(
          // @ts-expect-error MemoryLevel does not implement the same interface as Level
          new MemoryLevel({
            keyEncoding: 'utf8',
            valueEncoding: 'view'
          })
        )
        await store.open()

        return store
      },
      teardown () {}
    })
  })

  describe('interface-datastore Level', () => {
    interfaceDatastoreTests({
      async setup () {
        const store = new LevelDatastore(tempdir())
        await store.open()

        return store
      },
      teardown () {}
    })
  })
})
