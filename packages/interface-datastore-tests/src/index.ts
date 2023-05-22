/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { type Datastore, Key, type KeyQueryFilter, type KeyQueryOrder, type Pair, type QueryFilter, type QueryOrder } from 'interface-datastore'
import { randomBytes } from 'iso-random-stream'
import all from 'it-all'
import drain from 'it-drain'
import length from 'it-length'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'

export interface InterfacDatastoreTest<D extends Datastore = Datastore> {
  setup: () => D | Promise<D>
  teardown: (store: D) => void | Promise<void>
}

export function interfaceDatastoreTests <D extends Datastore = Datastore> (test: InterfacDatastoreTest<D>): void {
  const cleanup = async (store: D): Promise<void> => {
    await test.teardown(store)
  }

  const createStore = async (): Promise<D> => {
    return test.setup()
  }

  describe('put', () => {
    let store: D

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('simple', async () => {
      const k = new Key('/z/one')
      await store.put(k, uint8ArrayFromString('one'))
    })

    it('parallel', async () => {
      const data: Pair[] = []
      for (let i = 0; i < 100; i++) {
        data.push({ key: new Key(`/z/key${i}`), value: uint8ArrayFromString(`data${i}`) })
      }

      await Promise.all(data.map(async d => { await store.put(d.key, d.value) }))

      const res = await Promise.resolve(all(store.getMany(data.map(d => d.key))))
      expect(res).to.deep.equal(data)
    })
  })

  describe('putMany', () => {
    let store: D

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('streaming', async () => {
      const data: Pair[] = []
      for (let i = 0; i < 100; i++) {
        data.push({ key: new Key(`/z/key${i}`), value: uint8ArrayFromString(`data${i}`) })
      }

      let index = 0

      for await (const key of store.putMany(data)) {
        expect(data[index].key).to.deep.equal(key)
        index++
      }

      expect(index).to.equal(data.length)

      const res = await Promise.resolve(all(store.getMany(data.map(d => d.key))))
      expect(res).to.deep.equal(data)
    })
  })

  describe('get', () => {
    let store: D

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('simple', async () => {
      const k = new Key('/z/one')
      await store.put(k, uint8ArrayFromString('hello'))
      const res = await store.get(k)
      expect(res).to.be.eql(uint8ArrayFromString('hello'))
    })

    it('should throw error for missing key', async () => {
      const k = new Key('/does/not/exist')

      try {
        await store.get(k)
      } catch (err) {
        expect(err).to.have.property('code', 'ERR_NOT_FOUND')
        return
      }

      throw new Error('expected error to be thrown')
    })
  })

  describe('getMany', () => {
    let store: D

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('streaming', async () => {
      const k = new Key('/z/one')
      await store.put(k, uint8ArrayFromString('hello'))
      const source = [k]

      const res = await Promise.resolve(all(store.getMany(source)))
      expect(res).to.have.lengthOf(1)
      expect(res[0].key).to.be.eql(k)
      expect(res[0].value).to.be.eql(uint8ArrayFromString('hello'))
    })

    it('should throw error for missing key', async () => {
      const k = new Key('/does/not/exist')

      try {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        await Promise.resolve(drain(store.getMany([k])))
      } catch (err) {
        expect(err).to.have.property('code', 'ERR_NOT_FOUND')
        return
      }

      throw new Error('expected error to be thrown')
    })
  })

  describe('delete', () => {
    let store: D

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('simple', async () => {
      const k = new Key('/z/one')
      await store.put(k, uint8ArrayFromString('hello'))
      await store.get(k)
      await store.delete(k)
      const exists = await store.has(k)
      expect(exists).to.be.eql(false)
    })

    it('parallel', async () => {
      const data: Array<[Key, Uint8Array]> = []
      for (let i = 0; i < 100; i++) {
        data.push([new Key(`/a/key${i}`), uint8ArrayFromString(`data${i}`)])
      }

      await Promise.all(data.map(async d => { await store.put(d[0], d[1]) }))

      const res0 = await Promise.all(data.map(async d => store.has(d[0])))
      res0.forEach(res => expect(res).to.be.eql(true))

      await Promise.all(data.map(async d => { await store.delete(d[0]) }))

      const res1 = await Promise.all(data.map(async d => store.has(d[0])))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })

  describe('deleteMany', () => {
    let store: D

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('streaming', async () => {
      const data = []
      for (let i = 0; i < 100; i++) {
        data.push({ key: new Key(`/a/key${i}`), value: uint8ArrayFromString(`data${i}`) })
      }

      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      await Promise.resolve(drain(store.putMany(data)))

      const res0 = await Promise.all(data.map(async d => store.has(d.key)))
      res0.forEach(res => expect(res).to.be.eql(true))

      let index = 0

      for await (const key of store.deleteMany(data.map(d => d.key))) {
        expect(data[index].key).to.deep.equal(key)
        index++
      }

      expect(index).to.equal(data.length)

      const res1 = await Promise.all(data.map(async d => store.has(d.key)))
      res1.forEach(res => expect(res).to.be.eql(false))
    })
  })

  describe('batch', () => {
    let store: D

    beforeEach(async () => {
      store = await createStore()
    })

    afterEach(async () => { await cleanup(store) })

    it('simple', async () => {
      const b = store.batch()

      await store.put(new Key('/z/old'), uint8ArrayFromString('old'))

      b.put(new Key('/a/one'), uint8ArrayFromString('1'))
      b.put(new Key('/q/two'), uint8ArrayFromString('2'))
      b.put(new Key('/q/three'), uint8ArrayFromString('3'))
      b.delete(new Key('/z/old'))
      await b.commit()

      const keys = ['/a/one', '/q/two', '/q/three', '/z/old']
      const res = await Promise.all(keys.map(async k => store.has(new Key(k))))

      expect(res).to.be.eql([true, true, true, false])
    })

    it('many (3 * 400)', async function () {
      this.timeout(640 * 1000)
      const b = store.batch()
      const count = 400
      for (let i = 0; i < count; i++) {
        b.put(new Key(`/a/hello${i}`), randomBytes(32))
        b.put(new Key(`/q/hello${i}`), randomBytes(64))
        b.put(new Key(`/z/hello${i}`), randomBytes(128))
      }

      await b.commit()

      const length1 = await Promise.resolve(length(store.query({ prefix: '/a' })))
      const length2 = await Promise.resolve(length(store.query({ prefix: '/z' })))
      const length3 = await Promise.resolve(length(store.query({ prefix: '/q' })))

      expect(length1).to.equal(count)
      expect(length2).to.equal(count)
      expect(length3).to.equal(count)
    })
  })

  describe('query', () => {
    let store: D
    const hello = { key: new Key('/q/1hello'), value: uint8ArrayFromString('1') }
    const world = { key: new Key('/z/2world'), value: uint8ArrayFromString('2') }
    const hello2 = { key: new Key('/z/3hello2'), value: uint8ArrayFromString('3') }

    const filter1: QueryFilter = entry => !entry.key.toString().endsWith('hello')
    const filter2: QueryFilter = entry => entry.key.toString().endsWith('hello2')

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

    const tests: Array<[string, any, any[] | number]> = [
      ['empty', {}, [hello, world, hello2]],
      ['prefix', { prefix: '/z' }, [world, hello2]],
      ['1 filter', { filters: [filter1] }, [world, hello2]],
      ['2 filters', { filters: [filter1, filter2] }, [hello2]],
      ['limit', { limit: 1 }, 1],
      ['offset', { offset: 1 }, 2],
      ['1 order (1)', { orders: [order1] }, [hello, world, hello2]],
      ['1 order (reverse 1)', { orders: [order2] }, [hello2, world, hello]]
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

    tests.forEach(([name, query, expected]) => it(name, async () => {
      let res = await Promise.resolve(all(store.query(query)))

      if (Array.isArray(expected)) {
        if (query.orders == null) {
          expect(res).to.have.length(expected.length)

          const s: QueryOrder = (a, b) => {
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
      const hello3 = { key: new Key('/z/4hello3'), value: uint8ArrayFromString('4') }
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

      const results = await Promise.resolve(all(store.query({})))

      expect(firstIteration).to.be.false('Query did not return anything')
      expect(results.map(result => result.key)).to.have.deep.members([
        hello.key,
        world.key,
        hello3.key
      ])
    })

    it('queries while the datastore is being mutated', async () => {
      const writePromise = store.put(new Key(`/z/key-${Math.random()}`), uint8ArrayFromString('0'))
      const results = await Promise.resolve(all(store.query({})))
      expect(results.length).to.be.greaterThan(0)
      await writePromise
    })
  })

  describe('queryKeys', () => {
    let store: D
    const hello = { key: new Key('/q/1hello'), value: uint8ArrayFromString('1') }
    const world = { key: new Key('/z/2world'), value: uint8ArrayFromString('2') }
    const hello2 = { key: new Key('/z/3hello2'), value: uint8ArrayFromString('3') }

    const filter1: KeyQueryFilter = key => !key.toString().endsWith('hello')
    const filter2: KeyQueryFilter = key => key.toString().endsWith('hello2')

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

    const tests: Array<[string, any, any[] | number]> = [
      ['empty', {}, [hello.key, world.key, hello2.key]],
      ['prefix', { prefix: '/z' }, [world.key, hello2.key]],
      ['1 filter', { filters: [filter1] }, [world.key, hello2.key]],
      ['2 filters', { filters: [filter1, filter2] }, [hello2.key]],
      ['limit', { limit: 1 }, 1],
      ['offset', { offset: 1 }, 2],
      ['1 order (1)', { orders: [order1] }, [hello.key, world.key, hello2.key]],
      ['1 order (reverse 1)', { orders: [order2] }, [hello2.key, world.key, hello.key]]
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

    tests.forEach(([name, query, expected]) => it(name, async () => {
      let res = await Promise.resolve(all(store.queryKeys(query)))

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
      const hello3 = { key: new Key('/z/4hello3'), value: uint8ArrayFromString('4') }
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

      const results = await Promise.resolve(all(store.queryKeys({})))

      expect(firstIteration).to.be.false('Query did not return anything')
      expect(results).to.have.deep.members([
        hello.key,
        world.key,
        hello3.key
      ])
    })

    it('queries while the datastore is being mutated', async () => {
      const writePromise = store.put(new Key(`/z/key-${Math.random()}`), uint8ArrayFromString('0'))
      const results = await Promise.resolve(all(store.queryKeys({})))
      expect(results.length).to.be.greaterThan(0)
      await writePromise
    })
  })
}
