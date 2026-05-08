import { interfaceDatastoreTests } from 'interface-datastore-tests'
import { MemoryDatastore } from '../src/memory.ts'

describe('Memory', () => {
  describe('interface-datastore', () => {
    interfaceDatastoreTests({
      setup () {
        return new MemoryDatastore()
      },
      teardown () {}
    })
  })
})
