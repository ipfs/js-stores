/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from 'it-all'
import drain from 'it-drain'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import { base32 } from 'multiformats/bases/base32'
import * as raw from 'multiformats/codecs/raw'
import length from 'it-length'
import type { Blockstore, KeyQueryFilter, KeyQueryOrder, Pair, QueryFilter, QueryOrder } from 'interface-blockstore'

async function getKeyValuePair (data?: string): Promise<Pair> {
  const value = uint8ArrayFromString(data ?? `data-${Math.random()}`)
  const hash = await sha256.digest(value)
  const key = CID.createV1(raw.code, hash)

  return { key, value }
}

async function getKeyValuePairs (count: number): Promise<Pair[]> {
  return await Promise.all(
    new Array(count).fill(0).map(async (_, i) => await getKeyValuePair())
  )
}

export function interfaceBlockstoreTests (test: { teardown: () => void, setup: () => Blockstore }): void {
  const cleanup = async (store: Blockstore): Promise<void> => {
    await store.close()
    test.teardown()
  }

  const createStore = async (): Promise<Blockstore> => {
    const store = test.setup()
    if (store == null) {
      throw new Error('missing store')
    }
    await store.open()
    return store
  }

  describe('put', () => {
    let store: Blockstore

    beforeEach(async () => {
      store = await createStore()
      await store.open()
    })

    afterEach(async () => {
      await store.close()
      await cleanup(store)
    })

    it('simple', async () => {
      const { key, value } = await getKeyValuePair()

      await store.put(key, value)
    })

    it('parallel', async () => {
      const data = await getKeyValuePairs(100)

      await Promise.all(data.map(async d => { await store.put(d.key, d.value) }))

      const res = await all(store.getMany(data.map(d => d.key)))
      expect(res).to.deep.equal(data.map(d => d.value))
    })
  })

  describe('putMany', () => {
    let store: Blockstore

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('streaming', async () => {
      const data = await getKeyValuePairs(100)

      let index = 0

      for await (const { key, value } of store.putMany(data)) {
        expect(data[index]).to.deep.equal({ key, value })
        index++
      }

      expect(index).to.equal(data.length)

      const res = await all(store.getMany(data.map(d => d.key)))
      expect(res).to.deep.equal(data.map(d => d.value))
    })
  })

  describe('get', () => {
    let store: Blockstore

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('simple', async () => {
      const {
        key, value
      } = await getKeyValuePair()

      await store.put(key, value)

      const res = await store.get(key)
      expect(res).to.equalBytes(value)
    })

    it('should throw error for missing key', async () => {
      const {
        key
      } = await getKeyValuePair()

      try {
        await store.get(key)
      } catch (err) {
        expect(err).to.have.property('code', 'ERR_NOT_FOUND')
        return
      }

      throw new Error('expected error to be thrown')
    })
  })

  describe('getMany', () => {
    let store: Blockstore

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('streaming', async () => {
      const {
        key, value
      } = await getKeyValuePair()

      await store.put(key, value)
      const source = [key]

      const res = await all(store.getMany(source))
      expect(res).to.have.lengthOf(1)
      expect(res[0]).to.equalBytes(value)
    })

    it('should throw error for missing key', async () => {
      const {
        key
      } = await getKeyValuePair()

      try {
        await drain(store.getMany([key]))
      } catch (err) {
        expect(err).to.have.property('code', 'ERR_NOT_FOUND')
        return
      }

      throw new Error('expected error to be thrown')
    })
  })

  describe('delete', () => {
    let store: Blockstore

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('simple', async () => {
      const {
        key, value
      } = await getKeyValuePair()

      await store.put(key, value)
      await store.get(key)
      await store.delete(key)
      const exists = await store.has(key)
      expect(exists).to.be.eql(false)
    })

    it('parallel', async () => {
      const data = await getKeyValuePairs(100)

      await Promise.all(data.map(async d => { await store.put(d.key, d.value) }))

      const res0 = await Promise.all(data.map(async d => await store.has(d.key)))
      res0.forEach(res => expect(res).to.be.eql(true))

      await Promise.all(data.map(async d => { await store.delete(d.key) }))

      const res1 = await Promise.all(data.map(async d => await store.has(d.key)))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })

  describe('deleteMany', () => {
    let store: Blockstore

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('streaming', async () => {
      const data = await getKeyValuePairs(100)

      await drain(store.putMany(data))

      const res0 = await Promise.all(data.map(async d => await store.has(d.key)))
      res0.forEach(res => expect(res).to.be.eql(true))

      let index = 0

      for await (const key of store.deleteMany(data.map(d => d.key))) {
        expect(data[index].key).to.deep.equal(key)
        index++
      }

      expect(index).to.equal(data.length)

      const res1 = await Promise.all(data.map(async d => await store.has(d.key)))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })

  describe('batch', () => {
    let store: Blockstore

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('simple', async () => {
      const data = await getKeyValuePairs(4)

      const b = store.batch()

      await store.put(data[0].key, data[0].value)

      b.put(data[1].key, data[1].value)
      b.put(data[2].key, data[2].value)
      b.put(data[3].key, data[3].value)
      b.delete(data[0].key)
      await b.commit()

      const keys = data.map(d => d.key)
      const res = await Promise.all(keys.map(async k => await store.has(k)))

      expect(res).to.be.eql([false, true, true, true])
    })

    it('many (100)', async function () {
      this.timeout(320 * 1000)
      const b = store.batch()
      const count = 100

      const prefixes: Record<string, number> = {}

      for (let i = 0; i < count; i++) {
        const {
          key, value
        } = await getKeyValuePair()

        b.put(key, value)

        // find the shortest stringified key that aligns with a byte boundary
        const keyStr = key.toString()
        let prefix = ''

        for (let j = keyStr.length - 1; j > 20; j--) {
          try {
            base32.decode(keyStr.substring(0, j))
            prefix = keyStr.substring(0, j)
          } catch (err: any) {
            if (err.message !== 'Unexpected end of data') {
              throw err
            }
          }
        }

        prefixes[prefix] = (prefixes[prefix] ?? 0) + 1
      }

      await b.commit()

      await Promise.all(
        Object.keys(prefixes)
          .map(async prefix => {
            await expect(length(store.query({ prefix }))).to.eventually.equal(prefixes[prefix])
          })
      )
    })
  })

  describe('query', () => {
    let store: Blockstore
    let hello: Pair
    let world: Pair
    let hello2: Pair
    let filter1: QueryFilter
    let filter2: QueryFilter

    before(async () => {
      hello = await getKeyValuePair('hello')
      hello2 = await getKeyValuePair('hello2')
      world = await getKeyValuePair('world')

      filter1 = entry => !entry.key.toString().endsWith(hello.key.toString().substring(-5))
      filter2 = entry => entry.key.toString().endsWith(hello2.key.toString().substring(-5))
    })

    const order1: QueryOrder = (a, b) => {
      if (a.value.toString() < b.value.toString()) {
        return -1
      }
      return 1
    }

    const order2: QueryOrder = (a, b) => {
      if (a.value.toString() < b.value.toString()) {
        return 1
      }
      if (a.value.toString() > b.value.toString()) {
        return -1
      }
      return 0
    }

    const tests: Array<{ name: string, test: () => { query: any, expected: any } }> = [
      { name: 'empty', test: () => ({ query: {}, expected: [hello, world, hello2] }) },
      { name: 'prefix', test: () => ({ query: { prefix: hello.key.toString().charAt(0) }, expected: [hello, world, hello2] }) },
      { name: '1 filter', test: () => ({ query: { filters: [filter1] }, expected: [world, hello2] }) },
      { name: '2 filters', test: () => ({ query: { filters: [filter1, filter2] }, expected: [hello2] }) },
      { name: 'limit', test: () => ({ query: { limit: 1 }, expected: 1 }) },
      { name: 'offset', test: () => ({ query: { offset: 1 }, expected: 2 }) },
      { name: '1 order (1)', test: () => ({ query: { orders: [order1] }, expected: [hello, hello2, world] }) },
      { name: '1 order (reverse 1)', test: () => ({ query: { orders: [order2] }, expected: [world, hello2, hello] }) }
    ]

    before(async () => {
      store = await createStore()

      const b = store.batch()

      b.put(hello.key, hello.value)
      b.put(world.key, world.value)
      b.put(hello2.key, hello2.value)

      await b.commit()
    })

    after(async () => { await cleanup(store) })

    tests.forEach(({ name, test }) => it(name, async () => {
      const {
        query, expected
      } = test()
      let res = await all(store.query(query))

      if (Array.isArray(expected)) {
        if (query.orders == null) {
          expect(res).to.have.length(expected.length)
          const s = (a: Pair, b: Pair): number => {
            if (a.key.toString() < b.key.toString()) {
              return 1
            } else {
              return -1
            }
          }
          res = res.sort(s)
          const exp = expected.sort(s)

          res.forEach((r, i) => {
            expect(r.key.toString()).to.be.eql(exp[i].key.toString())

            if (r.value == null) {
              expect(exp[i].value).to.not.exist()
            } else {
              expect(r.value).to.deep.equal(exp[i].value)
            }
          })
        } else {
          expect(res).to.be.eql(expected)
        }
      } else if (typeof expected === 'number') {
        expect(res).to.have.length(expected)
      }
    }))

    it('allows mutating the datastore during a query', async () => {
      const hello3 = await getKeyValuePair()
      let firstIteration = true

      for await (const {} of store.query({})) { // eslint-disable-line no-empty-pattern
        if (firstIteration) {
          expect(await store.has(hello2.key)).to.be.true()
          await store.delete(hello2.key)
          expect(await store.has(hello2.key)).to.be.false()

          await store.put(hello3.key, hello3.value)
          firstIteration = false
        }
      }

      const results = await all(store.query({}))

      expect(firstIteration).to.be.false('Query did not return anything')
      expect(results.map(result => result.key)).to.have.deep.members([
        hello.key,
        world.key,
        hello3.key
      ])
    })

    it('queries while the datastore is being mutated', async () => {
      const {
        key, value
      } = await getKeyValuePair()
      const writePromise = store.put(key, value)
      const results = await all(store.query({}))
      expect(results.length).to.be.greaterThan(0)
      await writePromise
    })
  })

  describe('queryKeys', () => {
    let store: Blockstore
    let hello: Pair
    let world: Pair
    let hello2: Pair
    let filter1: KeyQueryFilter
    let filter2: KeyQueryFilter

    before(async () => {
      hello = await getKeyValuePair('hello')
      hello2 = await getKeyValuePair('hello2')
      world = await getKeyValuePair('world')

      filter1 = key => !key.toString().endsWith(hello.key.toString().substring(-5))
      filter2 = key => key.toString().endsWith(hello2.key.toString().substring(-5))
    })

    const order1: KeyQueryOrder = (a, b) => {
      if (a.toString() < b.toString()) {
        return -1
      }
      return 1
    }

    const order2: KeyQueryOrder = (a, b) => {
      if (a.toString() < b.toString()) {
        return 1
      }
      if (a.toString() > b.toString()) {
        return -1
      }
      return 0
    }

    const tests: Array<{ name: string, test: () => { query: any, expected: any } }> = [
      { name: 'empty', test: () => ({ query: {}, expected: [hello.key, world.key, hello2.key] }) },
      { name: 'prefix', test: () => ({ query: { prefix: hello.key.toString().charAt(0) }, expected: [hello.key, world.key, hello2.key] }) },
      { name: '1 filter', test: () => ({ query: { filters: [filter1] }, expected: [world.key, hello2.key] }) },
      { name: '2 filters', test: () => ({ query: { filters: [filter1, filter2] }, expected: [hello2.key] }) },
      { name: 'limit', test: () => ({ query: { limit: 1 }, expected: 1 }) },
      { name: 'offset', test: () => ({ query: { offset: 1 }, expected: 2 }) },
      { name: '1 order (1)', test: () => ({ query: { orders: [order1] }, expected: [hello.key, world.key, hello2.key] }) },
      { name: '1 order (reverse 1)', test: () => ({ query: { orders: [order2] }, expected: [hello2.key, world.key, hello.key] }) }
    ]

    before(async () => {
      store = await createStore()

      const b = store.batch()

      b.put(hello.key, hello.value)
      b.put(world.key, world.value)
      b.put(hello2.key, hello2.value)

      await b.commit()
    })

    after(async () => { await cleanup(store) })

    tests.forEach(({ name, test }) => it(name, async () => {
      const {
        query, expected
      } = test()
      let res = await all(store.queryKeys(query))

      if (Array.isArray(expected)) {
        if (query.orders == null) {
          expect(res).to.have.length(expected.length)

          const s: KeyQueryOrder = (a, b) => {
            if (a.toString() < b.toString()) {
              return 1
            } else {
              return -1
            }
          }
          res = res.sort(s)
          const exp = expected.sort(s)

          res.forEach((r, i) => {
            expect(r.toString()).to.be.eql(exp[i].toString())
          })
        } else {
          expect(res).to.be.eql(expected)
        }
      } else if (typeof expected === 'number') {
        expect(res).to.have.length(expected)
      }
    }))

    it('allows mutating the datastore during a query', async () => {
      const hello3 = await getKeyValuePair()
      let firstIteration = true

      for await (const {} of store.queryKeys({})) { // eslint-disable-line no-empty-pattern
        if (firstIteration) {
          expect(await store.has(hello2.key)).to.be.true()
          await store.delete(hello2.key)
          expect(await store.has(hello2.key)).to.be.false()

          await store.put(hello3.key, hello3.value)
          firstIteration = false
        }
      }

      const results = await all(store.queryKeys({}))

      expect(firstIteration).to.be.false('Query did not return anything')
      expect(results).to.have.deep.members([
        hello.key,
        world.key,
        hello3.key
      ])
    })

    it('queries while the datastore is being mutated', async () => {
      const { key, value } = await getKeyValuePair()
      const writePromise = store.put(key, value)
      const results = await all(store.queryKeys({}))
      expect(results.length).to.be.greaterThan(0)
      await writePromise
    })
  })

  describe('lifecycle', () => {
    let store: Blockstore

    before(() => {
      store = test.setup()
      if (store == null) {
        throw new Error('missing store')
      }
    })

    after(async () => { await cleanup(store) })

    it('close and open', async () => {
      await store.close()
      await store.open()
      await store.close()
      await store.open()
    })
  })
}
