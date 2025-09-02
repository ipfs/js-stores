import { setMaxListeners } from 'node:events'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
// @ts-expect-error types are broken: https://github.com/andywer/threads.js/pull/470
import { spawn, Thread, Worker } from 'threads'
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
        .with.property('name', 'OpenFailedError')
    })

    it('errorIfExists: true - folder exists', async () => {
      const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
      await fs.mkdir(dir, {
        recursive: true
      })
      const store = new FsBlockstore(dir, { errorIfExists: true })
      await expect(store.open()).to.eventually.be.rejected
        .with.property('name', 'OpenFailedError')
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
      .with.property('name', 'NotFoundError')
  })

  it('deleting non-existent files', async () => {
    const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
    const fs = new FsBlockstore(dir)
    await fs.open()

    const key = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')

    await fs.delete(key)

    await expect(fs.get(key)).to.eventually.be.rejected
      .with.property('name', 'NotFoundError')
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
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 1_000
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
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 1_000
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
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 1_000
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

  /**
   * This test spawns 10 workers that concurrently write to the same blockstore.
   * it's different from the previous test because it uses workers to write to the blockstore
   * which means that the writes are happening in parallel in different threads.
   */
  it('can survive concurrent worker writes', async () => {
    const dir = path.join(os.tmpdir(), `test-${Math.random()}`)
    const key = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')
    const workers = await Promise.all(new Array(10).fill(0).map(async () => {
      const w = new Worker('./fixtures/writer-worker.js')
      setMaxListeners(Infinity, w)
      const worker = await spawn(w)
      await worker.isReady(dir)
      return worker
    }))

    try {
      const value = utf8Encoder.encode('Hello world')
      // 100 iterations of looping over all workers and putting the same key value pair
      await Promise.all(new Array(100).fill(0).map(async () => {
        return Promise.all(workers.map(async (worker: any) => worker.put(key.toString(), value)))
      }))

      const fs = new FsBlockstore(dir)
      await fs.open()
      const res = await fs.get(key)

      expect(res).to.deep.equal(value)
    } finally {
      await Promise.all(workers.map(async (worker: any) => Thread.terminate(worker)))
    }
  })
})
