/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from 'it-all'
import { Key } from 'interface-datastore/key'
import { MemoryDatastore } from '../src/memory.js'
import { KeyTransformDatastore } from '../src/keytransform.js'

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
    const kResults = Promise.all(keys.map(async (key) => await kStore.get(key)))
    const mResults = Promise.all(keys.map(async (key) => await mStore.get(new Key('abc').child(key))))
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
})
