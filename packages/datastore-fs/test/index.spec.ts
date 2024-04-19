/* eslint-env mocha */
import fs from 'node:fs/promises'
import path from 'node:path'
import { expect } from 'aegir/chai'
import { ShardingDatastore, shard } from 'datastore-core'
import { Key } from 'interface-datastore'
import { interfaceDatastoreTests } from 'interface-datastore-tests'
import tempdir from 'ipfs-utils/src/temp-dir.js'
import { spawn, Thread, Worker } from 'threads'
import { FsDatastore } from '../src/index.js'

const utf8Encoder = new TextEncoder()

describe('FsDatastore', () => {
  describe('construction', () => {
    it('defaults - folder missing', async () => {
      const dir = tempdir()

      await expect(
        (async () => {
          const store = new FsDatastore(dir)
          await store.open()
        })()
      ).to.eventually.be.undefined()
    })

    it('defaults - folder exists', async () => {
      const dir = tempdir()
      await fs.mkdir(dir, {
        recursive: true
      })

      await expect(
        (async () => {
          const store = new FsDatastore(dir)
          await store.open()
        })()
      ).to.eventually.be.undefined()
    })
  })

  describe('open', () => {
    it('createIfMissing: false - folder missing', async () => {
      const dir = tempdir()
      const store = new FsDatastore(dir, { createIfMissing: false })
      await expect(store.open()).to.eventually.be.rejected
        .with.property('code', 'ERR_NOT_FOUND')
    })

    it('errorIfExists: true - folder exists', async () => {
      const dir = tempdir()
      await fs.mkdir(dir, {
        recursive: true
      })
      const store = new FsDatastore(dir, { errorIfExists: true })
      await expect(store.open()).to.eventually.be.rejected
        .with.property('code', 'ERR_DB_OPEN_FAILED')
    })
  })

  it('_encode and _decode', async () => {
    const dir = tempdir()
    const fs = new FsDatastore(dir)
    await fs.open()

    expect(
      fs._encode(new Key('hello/world'))
    ).to.eql({
      dir: path.join(dir, 'hello'),
      file: path.join(dir, 'hello', 'world.data')
    })

    expect(
      fs._decode(fs._encode(new Key('hello/world/test:other')).file)
    ).to.eql(
      new Key('hello/world/test:other')
    )
  })

  it('deleting files', async () => {
    const dir = tempdir()
    const fs = new FsDatastore(dir)
    await fs.open()
    const key = new Key('1234')

    await fs.put(key, Uint8Array.from([0, 1, 2, 3]))
    await fs.delete(key)

    try {
      await fs.get(key)
      throw new Error('Should have errored')
    } catch (err: any) {
      expect(err.code).to.equal('ERR_NOT_FOUND')
    }
  })

  it('deleting non-existent files', async () => {
    const dir = tempdir()
    const fs = new FsDatastore(dir)
    await fs.open()
    const key = new Key('5678')

    await fs.delete(key)

    try {
      await fs.get(key)
      throw new Error('Should have errored')
    } catch (err: any) {
      expect(err.code).to.equal('ERR_NOT_FOUND')
    }
  })

  it('sharding files', async () => {
    const dir = tempdir()
    const fstore = new FsDatastore(dir)
    await fstore.open()
    await ShardingDatastore.create(fstore, new shard.NextToLast(2))

    const file = await fs.readFile(path.join(dir, shard.SHARDING_FN + '.data'))
    expect(file.toString()).to.be.eql('/repo/flatfs/shard/v1/next-to-last/2\n')

    await fs.rm(dir, {
      recursive: true
    })
  })

  describe('interface-datastore', () => {
    interfaceDatastoreTests({
      async setup () {
        const store = new FsDatastore(tempdir())
        await store.open()

        return store
      },
      async teardown (store) {
        await fs.rm(store.path, {
          recursive: true
        })
      }
    })
  })

  describe('interface-datastore (sharding(fs))', () => {
    interfaceDatastoreTests({
      async setup () {
        const store = new FsDatastore(tempdir())
        await store.open()

        const shardedStore = new ShardingDatastore(store, new shard.NextToLast(2))
        await shardedStore.open()

        return shardedStore
      },
      teardown () {

      }
    })
  })

  it('can survive concurrent writes', async () => {
    const dir = tempdir()
    const fstore = new FsDatastore(dir)
    const key = new Key('CIQGFTQ7FSI2COUXWWLOQ45VUM2GUZCGAXLWCTOKKPGTUWPXHBNIVOY')
    const value = utf8Encoder.encode('Hello world')

    await Promise.all(
      new Array(100).fill(0).map(async () => { await fstore.put(key, value) })
    )

    const res = await fstore.get(key)

    expect(res).to.deep.equal(value)
  })

  /**
   * This test spawns 10 workers that concurrently write to the same blockstore.
   * it's different from the previous test because it uses workers to write to the blockstore
   * which means that the writes are happening in parallel in different threads.
   */
  it('can survive concurrent worker writes', async () => {
    const dir = tempdir()
    const key = new Key('CIQGFTQ7FSI2COUXWWLOQ45VUM2GUZCGAXLWCTOKKPGTUWPXHBNIVOY')
    const workers = await Promise.all(new Array(10).fill(0).map(async () => {
      const worker = await spawn(new Worker('./fixtures/writer-worker.js'))
      await worker.isReady(dir)
      return worker
    }))

    try {
      const value = utf8Encoder.encode('Hello world')
      // 100 iterations of looping over all workers and putting the same key value pair
      await Promise.all(new Array(100).fill(0).map(async () => {
        return Promise.all(workers.map(async (worker) => worker.put(key.toString(), value)))
      }))

      const fs = new FsDatastore(dir)
      await fs.open()
      const res = await fs.get(key)

      expect(res).to.deep.equal(value)
    } finally {
      await Promise.all(workers.map(async (worker) => Thread.terminate(worker)))
    }
  })
})
