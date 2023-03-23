/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from 'it-all'
import { Key } from 'interface-datastore/key'
import { MemoryDatastore } from '../src/memory.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { NamespaceDatastore } from '../src/namespace.js'
import { interfaceDatastoreTests } from 'interface-datastore-tests'

describe('NamespaceDatastore', () => {
  const prefixes = [
    'abc',
    ''
  ]
  prefixes.forEach((prefix) => it(`basic '${prefix}'`, async () => {
    const mStore = new MemoryDatastore()
    const store = new NamespaceDatastore(mStore, new Key(prefix))

    const keys = [
      'foo',
      'foo/bar',
      'foo/bar/baz',
      'foo/barb',
      'foo/bar/bazb',
      'foo/bar/baz/barb'
    ].map((s) => new Key(s))

    await Promise.all(keys.map(async key => { await store.put(key, uint8ArrayFromString(key.toString())) }))
    const nResults = Promise.all(keys.map(async (key) => await store.get(key)))
    const mResults = Promise.all(keys.map(async (key) => await mStore.get(new Key(prefix).child(key))))
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
