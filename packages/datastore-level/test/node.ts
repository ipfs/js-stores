/* eslint-env mocha */

import { expect } from 'aegir/chai'
import path from 'path'
import { Key } from 'interface-datastore/key'
import { MountDatastore } from 'datastore-core'
import childProcess from 'child_process'
import { interfaceDatastoreTests } from 'interface-datastore-tests'
import { LevelDatastore } from '../src/index.js'
import tempdir from 'ipfs-utils/src/temp-dir.js'

describe('LevelDatastore', () => {
  describe('interface-datastore (leveldown)', () => {
    interfaceDatastoreTests({
      async setup () {
        const store = new LevelDatastore(tempdir())
        await store.open()

        return store
      },
      teardown () {}
    })
  })

  describe('interface-datastore (mount(leveldown, leveldown, leveldown))', () => {
    interfaceDatastoreTests({
      async setup () {
        return new MountDatastore(
          await Promise.all(
            ['/a', '/q', '/z'].map(async prefix => {
              const datastore = new LevelDatastore(tempdir())
              await datastore.open()

              return {
                prefix: new Key(prefix),
                datastore
              }
            })
          )
        )
      },
      async teardown () {

      }
    })
  })

  // The `.end()` method MUST be called on LevelDB iterators or they remain open,
  // leaking memory.
  //
  // This test exposes this problem by causing an error to be thrown on process
  // exit when an iterator is open AND leveldb is not closed.
  //
  // Normally when leveldb is closed it'll automatically clean up open iterators
  // but if you don't close the store this error will occur:
  //
  // > Assertion failed: (ended_), function ~Iterator, file ../binding.cc, line 546.
  //
  // This is thrown by a destructor function for iterator objects that asserts
  // the iterator has ended before cleanup.
  //
  // https://github.com/Level/leveldown/blob/d3453fbde4d2a8aa04d9091101c25c999649069b/binding.cc#L545
  it('should not leave iterators open and leak memory', (done) => {
    const cp = childProcess.fork(path.join(process.cwd(), '/dist/test/fixtures/test-level-iterator-destroy'), { stdio: 'pipe' })

    let out = ''
    const { stdout, stderr } = cp
    stdout?.on('data', d => { out = `${out}${d}` })
    stderr?.on('data', d => { out = `${out}${d}` })

    cp.on('exit', code => {
      expect(code).to.equal(0)
      expect(out).to.not.include('Assertion failed: (ended_)')
      done()
    })
  })
})
