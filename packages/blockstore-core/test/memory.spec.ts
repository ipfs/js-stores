/* eslint-env mocha */

import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { MemoryBlockstore } from '../src/memory.js'

describe('memory', () => {
  describe('interface-blockstore', () => {
    interfaceBlockstoreTests({
      setup () {
        return new MemoryBlockstore()
      },
      teardown () { }
    })
  })
})
