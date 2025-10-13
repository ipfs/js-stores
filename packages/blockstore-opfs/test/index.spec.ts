/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import { OpfsBlockstore } from '../src/index.js'
import { FlatDirectory, NextToLast } from '../src/sharding.js'

const opfs = await window.navigator.storage.getDirectory()
const utf8Encoder = new TextEncoder()

describe('OpfsBlockstore', () => {
  describe('construction', () => {
    it('defaults - folder missing', async () => {
      const dir = `test-${Math.random()}`
      await expect(
        (async () => {
          const fs = new OpfsBlockstore(dir)
          await fs.open()
          await fs.close()
        })()
      ).to.eventually.be.undefined()
    })

    it('defaults - folder exists', async () => {
      const dir = `test-${Math.random()}`
      await opfs.getDirectoryHandle(dir, { create: true })
      await expect(
        (async () => {
          const fs = new OpfsBlockstore(dir)
          await fs.open()
          await fs.close()
        })()
      ).to.eventually.be.undefined()
    })
  })

  describe('open', () => {
    it('createIfMissing: false - folder missing', async () => {
      const dir = `test-${Math.random()}`
      const store = new OpfsBlockstore(dir, { createIfMissing: false })
      await expect(store.open()).to.eventually.be.rejected
        .with.property('code', 'ERR_OPEN_FAILED')
    })

    it('errorIfExists: true - folder exists', async () => {
      const dir = `test-${Math.random()}`
      await opfs.getDirectoryHandle(dir, { create: true })
      const store = new OpfsBlockstore(dir, { errorIfExists: true })
      await expect(store.open()).to.eventually.be.rejected
        .with.property('code', 'ERR_OPEN_FAILED')
    })
  })

  it('deleting files', async () => {
    const dir = `test-${Math.random()}`
    const fs = new OpfsBlockstore(dir)
    await fs.open()

    const key = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')
    await fs.put(key, Uint8Array.from([0, 1, 2, 3]))
    await fs.delete(key)

    await expect(fs.get(key)).to.eventually.be.rejected
      .with.property('code', 'ERR_NOT_FOUND')
  })

  it('deleting non-existent files', async () => {
    const dir = `test-${Math.random()}`
    const fs = new OpfsBlockstore(dir)
    await fs.open()

    const key = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')

    await fs.delete(key)

    await expect(fs.get(key)).to.eventually.be.rejected
      .with.property('code', 'ERR_NOT_FOUND')
  })

  describe('interface-blockstore (flat directory)', () => {
    interfaceBlockstoreTests({
      setup: async () => {
        const store = new OpfsBlockstore(`test-${Math.random()}`, {
          shardingStrategy: new FlatDirectory()
        })
        await store.open()

        return store
      },
      teardown: async (store) => {
        await store.close()
        await opfs.removeEntry(store.name, { recursive: true })
      }
    })
  })

  describe('interface-blockstore (default sharding)', () => {
    interfaceBlockstoreTests({
      setup: async () => {
        const store = new OpfsBlockstore(`test-${Math.random()}`)
        await store.open()

        return store
      },
      teardown: async (store) => {
        await store.close()
        await opfs.removeEntry(store.name, { recursive: true })
      }
    })
  })

  describe('interface-blockstore (custom encoding)', () => {
    interfaceBlockstoreTests({
      setup: async () => {
        const store = new OpfsBlockstore(`test-${Math.random()}`, {
          shardingStrategy: new NextToLast({
            base: base32
          })
        })

        await store.open()

        return store
      },
      teardown: async (store) => {
        await store.close()
        await opfs.removeEntry(store.name, { recursive: true })
      }
    })
  })

  it('can survive concurrent writes', async () => {
    const dir = `test-${Math.random()}`
    const fs = new OpfsBlockstore(dir)
    await fs.open()

    const key = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')
    const value = utf8Encoder.encode('Hello world')

    await Promise.all(
      new Array(100).fill(0).map(async () => { await fs.put(key, value) })
    )

    const res = await fs.get(key)

    expect(res).to.deep.equal(value)
  })
})
