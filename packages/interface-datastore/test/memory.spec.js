/* eslint-env mocha */
'use strict'

const MemoryDatastore = require('../src').MemoryDatastore

describe('Memory', () => {
  describe('interface-datastore', () => {
    require('interface-datastore-tests')({
      setup () {
        return new MemoryDatastore()
      },
      teardown () {}
    })
  })
})
