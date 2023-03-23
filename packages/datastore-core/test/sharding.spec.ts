/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { Key } from 'interface-datastore/key'
import { MemoryDatastore } from '../src/memory.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import {
  NextToLast,
  SHARDING_FN
} from '../src/shard.js'
import {
  ShardingDatastore
} from '../src/sharding.js'
import { interfaceDatastoreTests } from 'interface-datastore-tests'

describe('ShardingDatastore', () => {
  it('create', async () => {
    const ms = new MemoryDatastore()
    const shard = new NextToLast(2)
    const store = new ShardingDatastore(ms, shard)
    await store.open()
    const res = await Promise.all([
      store.get(new Key(SHARDING_FN))
    ])
    expect(uint8ArrayToString(res[0])).to.eql(shard.toString() + '\n')
  })

  it('open - empty', () => {
    const ms = new MemoryDatastore()
    // @ts-expect-error
    const store = new ShardingDatastore(ms)
    return expect(store.open())
      .to.eventually.be.rejected()
      .with.property('code', 'ERR_DB_OPEN_FAILED')
  })

  it('open - existing', () => {
    const ms = new MemoryDatastore()
    const shard = new NextToLast(2)
    const store = new ShardingDatastore(ms, shard)

    return expect(store.open()).to.eventually.be.fulfilled()
  })

  it('basics', async () => {
    const ms = new MemoryDatastore()
    const shard = new NextToLast(2)
    const store = new ShardingDatastore(ms, shard)
    await store.open()
    await store.put(new Key('hello'), uint8ArrayFromString('test'))
    const res = await ms.get(new Key('ll').child(new Key('hello')))
    expect(res).to.eql(uint8ArrayFromString('test'))
  })

  describe('interface-datastore', () => {
    interfaceDatastoreTests({
      setup () {
        const shard = new NextToLast(2)
        return new ShardingDatastore(new MemoryDatastore(), shard)
      },
      teardown () { }
    })
  })
})
