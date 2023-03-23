/* eslint-env mocha */

import { MemoryDatastore } from '../src/memory.js'
import { interfaceDatastoreTests } from 'interface-datastore-tests'

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
