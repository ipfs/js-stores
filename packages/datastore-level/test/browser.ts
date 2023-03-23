/* eslint-env mocha */

import { MountDatastore } from 'datastore-core'
import { Key } from 'interface-datastore/key'
import { LevelDatastore } from '../src/index.js'
import { interfaceDatastoreTests } from 'interface-datastore-tests'

describe('LevelDatastore', () => {
  describe('interface-datastore (leveljs)', () => {
    interfaceDatastoreTests({
      setup: () => new LevelDatastore(`hello-${Math.random()}`),
      teardown: () => {}
    })
  })

  describe('interface-datastore (mount(leveljs, leveljs, leveljs))', () => {
    interfaceDatastoreTests({
      setup () {
        return new MountDatastore([{
          prefix: new Key('/a'),
          datastore: new LevelDatastore(`one-${Math.random()}`)
        }, {
          prefix: new Key('/q'),
          datastore: new LevelDatastore(`two-${Math.random()}`)
        }, {
          prefix: new Key('/z'),
          datastore: new LevelDatastore(`three-${Math.random()}`)
        }])
      },
      teardown () {}
    })
  })
})
