/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { MemoryLevel } from 'memory-level'
import { Level } from 'level'
import { LevelBlockstore } from '../src/index.js'
import tempdir from 'ipfs-utils/src/temp-dir.js'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'

describe('LevelBlockstore', () => {
  describe('initialization', () => {
    it('should default to a leveldown database', async () => {
      const levelStore = new LevelBlockstore(`${tempdir()}/init-default-${Date.now()}`)
      await levelStore.open()

      expect(levelStore.db).to.be.an.instanceOf(Level)
    })

    it('should be able to override the database', async () => {
      const levelStore = new LevelBlockstore(
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

  describe('interface-blockstore MemoryLevel', () => {
    interfaceBlockstoreTests({
      async setup () {
        const store = new LevelBlockstore(
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

  describe('interface-blockstore Level', () => {
    interfaceBlockstoreTests({
      async setup () {
        const store = new LevelBlockstore(tempdir())
        await store.open()

        return store
      },
      teardown () {}
    })
  })
})
