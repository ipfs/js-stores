/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const utils = require('../src').utils
const filter = require('it-filter')
const take = require('it-take')
const map = require('it-map')

describe('utils', () => {
  it('filter - sync', async () => {
    const data = [1, 2, 3, 4]
    /**
     * @param {number} val
     */
    const filterer = val => val % 2 === 0
    const res = []
    for await (const val of filter(data, filterer)) {
      res.push(val)
    }
    expect(res).to.be.eql([2, 4])
  })

  it('filter - async', async () => {
    const data = [1, 2, 3, 4]
    /**
     * @param {number} val
     */
    const filterer = val => val % 2 === 0
    const res = []
    for await (const val of filter(data, filterer)) {
      res.push(val)
    }
    expect(res).to.be.eql([2, 4])
  })

  it('sortAll', async () => {
    const data = [1, 2, 3, 4]
    /**
     * @param {number} a
     * @param {number} b
     */
    const sorter = (a, b) => {
      if (a < b) {
        return 1
      }

      if (a > b) {
        return -1
      }

      return 0
    }
    const res = []
    for await (const val of utils.sortAll(data, sorter)) {
      res.push(val)
    }
    expect(res).to.be.eql([4, 3, 2, 1])
  })

  it('sortAll - fail', async () => {
    const data = [1, 2, 3, 4]
    const sorter = () => { throw new Error('fail') }
    const res = []

    try {
      for await (const val of utils.sortAll(data, sorter)) {
        res.push(val)
      }
    } catch (err) {
      expect(err.message).to.be.eql('fail')
      return
    }

    throw new Error('expected error to be thrown')
  })

  it('should take n values from iterator', async () => {
    const data = [1, 2, 3, 4]
    const n = 3
    const res = []
    for await (const val of take(data, n)) {
      res.push(val)
    }
    expect(res).to.be.eql([1, 2, 3])
  })

  it('should take nothing from iterator', async () => {
    const data = [1, 2, 3, 4]
    const n = 0
    for await (const _ of take(data, n)) { // eslint-disable-line
      throw new Error('took a value')
    }
  })

  it('should map iterator values', async () => {
    const data = [1, 2, 3, 4]
    /**
     * @param {number} n
     */
    const mapper = n => n * 2
    const res = []
    for await (const val of map(data, mapper)) {
      res.push(val)
    }
    expect(res).to.be.eql([2, 4, 6, 8])
  })

  it('replaceStartWith', () => {
    expect(
      utils.replaceStartWith('helloworld', 'hello')
    ).to.eql(
      'world'
    )

    expect(
      utils.replaceStartWith('helloworld', 'world')
    ).to.eql(
      'helloworld'
    )
  })

  it('provides a temp folder', () => {
    expect(utils.tmpdir()).to.not.equal('')
  })
})
