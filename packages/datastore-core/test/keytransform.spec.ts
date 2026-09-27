import { expect } from 'aegir/chai'
import { Key } from 'interface-datastore/key'
import all from 'it-all'
import { KeyTransformDatastore } from '../src/keytransform.ts'
import { MemoryDatastore } from '../src/memory.ts'

describe('KeyTransformDatastore', () => {
  it('basic', async () => {
    const mStore = new MemoryDatastore()
    const transform = {
      convert (key: Key): Key {
        return new Key('/abc').child(key)
      },
      invert (key: Key): Key {
        const l = key.list()
        if (l[0] !== 'abc') {
          throw new Error('missing prefix, convert failed?')
        }
        return Key.withNamespaces(l.slice(1))
      }
    }

    const kStore = new KeyTransformDatastore(mStore, transform)

    const keys = [
      'foo',
      'foo/bar',
      'foo/bar/baz',
      'foo/barb',
      'foo/bar/bazb',
      'foo/bar/baz/barb'
    ].map((s) => new Key(s))
    await Promise.all(keys.map(async (key) => { await kStore.put(key, key.uint8Array()) }))
    const kResults = Promise.all(keys.map(async (key) => kStore.get(key)))
    const mResults = Promise.all(keys.map(async (key) => mStore.get(new Key('abc').child(key))))
    const results = await Promise.all([kResults, mResults])
    expect(results[0]).to.eql(results[1])

    const mRes = await all(mStore.query({}))
    const kRes = await all(kStore.query({}))
    expect(kRes).to.have.length(mRes.length)

    mRes.forEach((a, i) => {
      const kA = a.key
      const kB = kRes[i].key
      expect(transform.invert(kA)).to.eql(kB)
      expect(kA).to.eql(transform.convert(kB))
    })
  })

  for (const method of ['query', 'queryKeys'] as const) {
    it(`${method} filters on the original keys before ordering and pagination`, async () => {
      const store = new KeyTransformDatastore(new MemoryDatastore(), {
        convert: key => new Key('/storage').child(key),
        invert: key => Key.withNamespaces(key.list().slice(1))
      })
      const keys = ['/keep/c', '/drop/a', '/keep/a', '/keep/b']

      for (const key of keys) {
        await store.put(new Key(key), new TextEncoder().encode(key))
      }

      if (method === 'query') {
        const results = await all(store.query({
          filters: [({ key, value }) => key.toString().startsWith('/keep/') && new TextDecoder().decode(value) === key.toString()],
          orders: [(a, b) => a.key.toString() < b.key.toString() ? -1 : a.key.toString() > b.key.toString() ? 1 : 0],
          offset: 1,
          limit: 1
        }))
        expect(results.map(({ key }) => key.toString())).to.deep.equal(['/keep/b'])
        expect(new TextDecoder().decode(results[0].value)).to.equal('/keep/b')
      } else {
        const results = await all(store.queryKeys({
          filters: [key => key.toString().startsWith('/keep/')],
          orders: [(a, b) => a.toString() < b.toString() ? -1 : a.toString() > b.toString() ? 1 : 0],
          offset: 1,
          limit: 1
        }))
        expect(results.map(key => key.toString())).to.deep.equal(['/keep/b'])
      }
    })
  }
})
