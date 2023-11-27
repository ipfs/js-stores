/* eslint-env mocha */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import { FsBlockstore } from '../src/index.js'
import { FlatDirectory, NextToLast } from '../src/sharding.js'

const utf8Encoder = new TextEncoder()

describe('FsBlockstore', () => {
  describe('construction', () => {
    it('defaults - folder missing', async () => {
      const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
      await expect(
        (async () => {
          const fs = new FsBlockstore(dir)
          await fs.open()
          await fs.close()
        })()
      ).to.eventually.be.undefined()
    })

    it('defaults - folder exists', async () => {
      const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
      await fs.mkdir(dir, {
        recursive: true
      })
      await expect(
        (async () => {
          const fs = new FsBlockstore(dir)
          await fs.open()
          await fs.close()
        })()
      ).to.eventually.be.undefined()
    })
  })

  describe('open', () => {
    it('createIfMissing: false - folder missing', async () => {
      const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
      const store = new FsBlockstore(dir, { createIfMissing: false })
      await expect(store.open()).to.eventually.be.rejected
        .with.property('code', 'ERR_OPEN_FAILED')
    })

    it('errorIfExists: true - folder exists', async () => {
      const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
      await fs.mkdir(dir, {
        recursive: true
      })
      const store = new FsBlockstore(dir, { errorIfExists: true })
      await expect(store.open()).to.eventually.be.rejected
        .with.property('code', 'ERR_OPEN_FAILED')
    })
  })

  it('deleting files', async () => {
    const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
    const fs = new FsBlockstore(dir)
    await fs.open()

    const key = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')
    await fs.put(key, Uint8Array.from([0, 1, 2, 3]))
    await fs.delete(key)

    await expect(fs.get(key)).to.eventually.be.rejected
      .with.property('code', 'ERR_NOT_FOUND')
  })

  it('deleting non-existent files', async () => {
    const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
    const fs = new FsBlockstore(dir)
    await fs.open()

    const key = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')

    await fs.delete(key)

    await expect(fs.get(key)).to.eventually.be.rejected
      .with.property('code', 'ERR_NOT_FOUND')
  })

  describe('interface-blockstore (flat directory)', () => {
    interfaceBlockstoreTests({
      setup: async () => {
        const store = new FsBlockstore(path.join(os.tmpdir(), `test-${Math.random()}`), {
          shardingStrategy: new FlatDirectory()
        })
        await store.open()

        return store
      },
      teardown: async (store) => {
        await store.close()
        await fs.rm(store.path, {
          recursive: true
        })
      }
    })
  })

  describe('interface-blockstore (default sharding)', () => {
    interfaceBlockstoreTests({
      setup: async () => {
        const store = new FsBlockstore(path.join(os.tmpdir(), `test-${Math.random()}`))
        await store.open()

        return store
      },
      teardown: async (store) => {
        await store.close()
        await fs.rm(store.path, {
          recursive: true
        })
      }
    })
  })

  describe('interface-blockstore (custom encoding)', () => {
    interfaceBlockstoreTests({
      setup: async () => {
        const store = new FsBlockstore(path.join(os.tmpdir(), `test-${Math.random()}`), {
          shardingStrategy: new NextToLast({
            base: base32
          })
        })

        await store.open()

        return store
      },
      teardown: async (store) => {
        await store.close()
        await fs.rm(store.path, {
          recursive: true
        })
      }
    })
  })

  it('can survive concurrent writes', async () => {
    const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
    const fs = new FsBlockstore(dir)
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
