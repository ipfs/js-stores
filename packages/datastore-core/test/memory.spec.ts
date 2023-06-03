/* eslint-env mocha */

import { interfaceDatastoreTests } from 'interface-datastore-tests'
import { MemoryDatastore } from '../src/memory.js'

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
