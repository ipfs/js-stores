import { expect } from 'aegir/chai'
import { Key } from 'interface-datastore/key'
import { interfaceDatastoreTests } from 'interface-datastore-tests'
import all from 'it-all'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { MemoryDatastore } from '../src/memory.ts'
import {
  NextToLast,
  SHARDING_FN
} from '../src/shard.ts'
import {
  ShardingDatastore
} from '../src/sharding.ts'

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
    // @ts-expect-error shard is missing
    const store = new ShardingDatastore(ms)
    return expect(store.open())
      .to.eventually.be.rejected()
      .with.property('name', 'OpenFailedError')
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

  it('filters queries using unsharded keys', async () => {
    const store = new ShardingDatastore(new MemoryDatastore(), new NextToLast(2))
    await store.open()

    await store.put(new Key('/keep/one'), uint8ArrayFromString('one'))
    await store.put(new Key('/drop/two'), uint8ArrayFromString('two'))

    const entries = await all(store.query({
      filters: [({ key }) => key.toString().startsWith('/keep/')]
    }))
    expect(entries.map(({ key }) => key.toString())).to.deep.equal(['/keep/one'])
    expect(uint8ArrayToString(entries[0].value)).to.equal('one')
  })

  it('filters key queries using unsharded keys', async () => {
    const store = new ShardingDatastore(new MemoryDatastore(), new NextToLast(2))
    await store.open()

    await store.put(new Key('/keep/one'), uint8ArrayFromString('one'))
    await store.put(new Key('/drop/two'), uint8ArrayFromString('two'))

    const keys = await all(store.queryKeys({
      filters: [key => key.toString().startsWith('/keep/')]
    }))
    expect(keys.map(key => key.toString())).to.deep.equal(['/keep/one'])
  })
})
