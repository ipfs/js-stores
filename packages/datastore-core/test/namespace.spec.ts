/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { Key } from 'interface-datastore/key'
import { interfaceDatastoreTests } from 'interface-datastore-tests'
import all from 'it-all'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { MemoryDatastore } from '../src/memory.js'
import { NamespaceDatastore } from '../src/namespace.js'

describe('NamespaceDatastore', () => {
  const prefixes = [
    'abc',
    ''
  ]

  const keys = [
    'foo',
    'foo/bar',
    'foo/bar/baz',
    'foo/barb',
    'foo/bar/bazb',
    'foo/bar/baz/barb'
  ].map((s) => new Key(s))

  prefixes.forEach((prefix) => it(`basic '${prefix}'`, async () => {
    const mStore = new MemoryDatastore()
    const store = new NamespaceDatastore(mStore, new Key(prefix))

    await Promise.all(keys.map(async key => { await store.put(key, uint8ArrayFromString(key.toString())) }))
    const nResults = Promise.all(keys.map(async (key) => store.get(key)))
    const mResults = Promise.all(keys.map(async (key) => mStore.get(new Key(prefix).child(key))))
    const results = await Promise.all([nResults, mResults])
    const mRes = await all(mStore.query({}))
    const nRes = await all(store.query({}))

    expect(nRes).to.have.length(mRes.length)

    mRes.forEach((a, i) => {
      const kA = a.key
      const kB = nRes[i].key
      expect(store.transform.invert(kA)).to.eql(kB)
      expect(kA).to.eql(store.transform.convert(kB))
    })

    expect(results[0]).to.eql(results[1])
  }))

  const setupStores = async (keys: Key[]): Promise<NamespaceDatastore[]> => {
    const prefixes = ['abc', '123', 'sub/prefix']
    const mStore = new MemoryDatastore()

    return Promise.all(prefixes.map(async prefix => {
      const store = new NamespaceDatastore(mStore, new Key(prefix))

      await Promise.all(keys.map(async key => { await store.put(key, uint8ArrayFromString(key.toString())) }))

      return store
    }))
  }

  it('queries keys under each prefix', async () => {
    const stores = await setupStores(keys)

    for (const store of stores) {
      const nRes = await all(store.queryKeys({}))

      expect(nRes).deep.equal(keys)
    }
  })

  it('queries values under each prefix', async () => {
    const stores = await setupStores(keys)

    for (const store of stores) {
      const nRes = await all(store.query({}))
      const values = keys.map(key => uint8ArrayFromString(key.toString()))

      expect(nRes.map(p => p.key)).deep.equal(keys)
      expect(nRes.map(p => p.value)).deep.equal(values)
    }
  })

  prefixes.forEach((prefix) => {
    describe(`interface-datastore: '${prefix}'`, () => {
      interfaceDatastoreTests({
        setup () {
          return new NamespaceDatastore(new MemoryDatastore(), new Key(prefix))
        },
        async teardown () { }
      })
    })
  })
})
