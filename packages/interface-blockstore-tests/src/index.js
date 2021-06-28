/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const all = require('it-all')
const drain = require('it-drain')
const uint8ArrayFromString = require('uint8arrays/from-string')
const { CID } = require('multiformats/cid')
const { sha256 } = require('multiformats/hashes/sha2')
const raw = require('multiformats/codecs/raw')
const length = require('it-length')

/**
 * @typedef {import('interface-blockstore').Blockstore} Blockstore
 * @typedef {import('interface-blockstore').Pair} Pair
 * @typedef {import('interface-blockstore').QueryOrder} QueryOrder
 * @typedef {import('interface-blockstore').QueryFilter} QueryFilter
 * @typedef {import('interface-blockstore').KeyQueryOrder} KeyQueryOrder
 * @typedef {import('interface-blockstore').KeyQueryFilter} KeyQueryFilter
 */

async function getKeyValuePair () {
  const value = uint8ArrayFromString(`data-${Math.random()}`)
  const hash = await sha256.digest(value)
  const key = CID.createV1(raw.code, hash)

  return { key, value }
}

/**
 * @param {number} count
 */
async function getKeyValuePairs (count) {
  return Promise.all(
    new Array(count).fill(0).map((_, i) => getKeyValuePair())
  )
}

/**
 * @param {{ teardown: () => void; setup: () => Blockstore; }} test
 */
module.exports = (test) => {
  /**
   * @param {Blockstore} store
   */
  const cleanup = async store => {
    await store.close()
    await test.teardown()
  }

  const createStore = async () => {
    const store = await test.setup()
    if (!store) throw new Error('missing store')
    await store.open()
    return store
  }

  describe('put', () => {
    /** @type {Blockstore} */
    let store

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(() => cleanup(store))

    it('simple', async () => {
      const { key, value } = await getKeyValuePair()

      return store.put(key, value)
    })

    it('parallel', async () => {
      const data = await getKeyValuePairs(100)

      await Promise.all(data.map(d => store.put(d.key, d.value)))

      const res = await all(store.getMany(data.map(d => d.key)))
      expect(res).to.deep.equal(data.map(d => d.value))
    })
  })

  describe('putMany', () => {
    /** @type {Blockstore} */
    let store

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(() => cleanup(store))

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
    /** @type {Blockstore} */
    let store

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(() => cleanup(store))

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
    /** @type {Blockstore} */
    let store

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(() => cleanup(store))

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
    /** @type {Blockstore} */
    let store

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(() => cleanup(store))

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

      await Promise.all(data.map(d => store.put(d.key, d.value)))

      const res0 = await Promise.all(data.map(d => store.has(d.key)))
      res0.forEach(res => expect(res).to.be.eql(true))

      await Promise.all(data.map(d => store.delete(d.key)))

      const res1 = await Promise.all(data.map(d => store.has(d.key)))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })

  describe('deleteMany', () => {
    /** @type {Blockstore} */
    let store

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(() => cleanup(store))

    it('streaming', async () => {
      const data = await getKeyValuePairs(100)

      await drain(store.putMany(data))

      const res0 = await Promise.all(data.map(d => store.has(d.key)))
      res0.forEach(res => expect(res).to.be.eql(true))

      let index = 0

      for await (const key of store.deleteMany(data.map(d => d.key))) {
        expect(data[index].key).to.deep.equal(key)
        index++
      }

      expect(index).to.equal(data.length)

      const res1 = await Promise.all(data.map(d => store.has(d.key)))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })

  describe('batch', () => {
    /** @type {Blockstore} */
    let store

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(() => cleanup(store))

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
      const res = await Promise.all(keys.map(k => store.has(k)))

      expect(res).to.be.eql([false, true, true, true])
    })

    it('many (1200)', async function () {
      this.timeout(20 * 1000)
      const b = store.batch()
      const count = 1200

      /** @type {Record<string, number>} */
      const prefixes = {}

      for (let i = 0; i < count; i++) {
        const {
          key, value
        } = await getKeyValuePair()

        b.put(key, value)

        const prefix = key.toString().substr(0, 3)

        prefixes[prefix] = (prefixes[prefix] || 0) + 1
      }

      await b.commit()

      await Promise.all(
        Object.keys(prefixes)
          .map(prefix => {
            return expect(length(store.query({ prefix }))).to.eventually.equal(prefixes[prefix])
          })
      )
    })
  })

  describe('query', () => {
    /** @type {Blockstore} */
    let store
    /** @type {Pair} */
    let hello
    /** @type {Pair} */
    let world
    /** @type {Pair} */
    let hello2
    /** @type {QueryFilter} */
    let filter1
    /** @type {QueryFilter} */
    let filter2

    before(async () => {
      hello = await getKeyValuePair()
      hello2 = await getKeyValuePair()
      world = await getKeyValuePair()

      filter1 = entry => !entry.key.toString().endsWith(hello.key.toString().substring(-5))
      filter2 = entry => entry.key.toString().endsWith(hello2.key.toString().substring(-5))
    })

    /**
     * @type {QueryOrder}
     */
    const order1 = (a, b) => {
      if (a.value.toString() < b.value.toString()) {
        return -1
      }
      return 1
    }

    /**
     * @type {QueryOrder}
     */
    const order2 = (a, b) => {
      if (a.value.toString() < b.value.toString()) {
        return 1
      }
      if (a.value.toString() > b.value.toString()) {
        return -1
      }
      return 0
    }

    /** @type {Array<{ name: string, test: () => { query: any, expected: any}}>} */
    const tests = [
      { name: 'empty', test: () => ({ query: {}, expected: [hello, world, hello2] }) },
      { name: 'prefix', test: () => ({ query: { prefix: '/z' }, expected: [world, hello2] }) },
      { name: '1 filter', test: () => ({ query: { filters: [filter1] }, expected: [world, hello2] }) },
      { name: '2 filters', test: () => ({ query: { filters: [filter1, filter2] }, expected: [hello2] }) },
      { name: 'limit', test: () => ({ query: { limit: 1 }, expected: 1 }) },
      { name: 'offset', test: () => ({ query: { offset: 1 }, expected: 2 }) },
      { name: '1 order (1)', test: () => ({ query: { orders: [order1] }, expected: [hello, world, hello2] }) },
      { name: '1 order (reverse 1)', test: () => ({ query: { orders: [order2] }, expected: [hello2, world, hello] }) }
    ]

    before(async () => {
      store = await createStore()

      const b = store.batch()

      b.put(hello.key, hello.value)
      b.put(world.key, world.value)
      b.put(hello2.key, hello2.value)

      return b.commit()
    })

    after(() => cleanup(store))

    tests.forEach(({ name, test }) => it(name, async () => {
      const {
        query, expected
      } = test()
      let res = await all(store.query(query))

      if (Array.isArray(expected)) {
        if (query.orders == null) {
          expect(res).to.have.length(expected.length)
          /**
           * @param {Pair} a
           * @param {Pair} b
           */
          const s = (a, b) => {
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
    /** @type {Blockstore} */
    let store
    /** @type {Pair} */
    let hello
    /** @type {Pair} */
    let world
    /** @type {Pair} */
    let hello2
    /** @type {KeyQueryFilter} */
    let filter1
    /** @type {KeyQueryFilter} */
    let filter2

    before(async () => {
      hello = await getKeyValuePair()
      hello2 = await getKeyValuePair()
      world = await getKeyValuePair()

      filter1 = key => !key.toString().endsWith(hello.key.toString().substring(-5))
      filter2 = key => key.toString().endsWith(hello2.key.toString().substring(-5))
    })

    /**
     * @type {KeyQueryOrder}
     */
    const order1 = (a, b) => {
      if (a.toString() < b.toString()) {
        return -1
      }
      return 1
    }

    /**
     * @type {KeyQueryOrder}
     */
    const order2 = (a, b) => {
      if (a.toString() < b.toString()) {
        return 1
      }
      if (a.toString() > b.toString()) {
        return -1
      }
      return 0
    }

    /** @type {Array<{ name: string, test: () => { query: any, expected: any}}>} */
    const tests = [
      { name: 'empty', test: () => ({ query: {}, expected: [hello.key, world.key, hello2.key] }) },
      { name: 'prefix', test: () => ({ query: { prefix: '/z' }, expected: [world.key, hello2.key] }) },
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

      return b.commit()
    })

    after(() => cleanup(store))

    tests.forEach(({ name, test }) => it(name, async () => {
      const {
        query, expected
      } = test()
      let res = await all(store.queryKeys(query))

      if (Array.isArray(expected)) {
        if (query.orders == null) {
          expect(res).to.have.length(expected.length)
          /**
           * @type {KeyQueryOrder}
           */
          const s = (a, b) => {
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
    /** @type {Blockstore} */
    let store

    before(async () => {
      store = await test.setup()
      if (!store) throw new Error('missing store')
    })

    after(() => cleanup(store))

    it('close and open', async () => {
      await store.close()
      await store.open()
      await store.close()
      await store.open()
    })
  })
}
