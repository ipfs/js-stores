'use strict'

const Adapter = require('./adapter')
const { base32 } = require('multiformats/bases/base32')
const raw = require('multiformats/codecs/raw')
const { CID } = require('multiformats/cid')
const Digest = require('multiformats/hashes/digest')
const Errors = require('./errors')

/**
 * @typedef {import('./types').Pair} Pair
 * @typedef {import('./types').Blockstore} Blockstore
 * @typedef {import('interface-store').Options} Options
 */

/**
 * @class MemoryBlockstore
 * @implements {Blockstore}
 */
class MemoryBlockstore extends Adapter {
  constructor () {
    super()

    /** @type {Record<string, Uint8Array>} */
    this.data = {}
  }

  open () {
    return Promise.resolve()
  }

  close () {
    return Promise.resolve()
  }

  /**
   * @param {CID} key
   * @param {Uint8Array} val
   */
  async put (key, val) { // eslint-disable-line require-await
    this.data[base32.encode(key.multihash.bytes)] = val
  }

  /**
   * @param {CID} key
   */
  async get (key) {
    const exists = await this.has(key)
    if (!exists) throw Errors.notFoundError()
    return this.data[base32.encode(key.multihash.bytes)]
  }

  /**
   * @param {CID} key
   */
  async has (key) { // eslint-disable-line require-await
    return this.data[base32.encode(key.multihash.bytes)] !== undefined
  }

  /**
   * @param {CID} key
   */
  async delete (key) { // eslint-disable-line require-await
    delete this.data[base32.encode(key.multihash.bytes)]
  }

  async * _all () {
    yield * Object.entries(this.data)
      .map(([key, value]) => ({ key: CID.createV1(raw.code, Digest.decode(base32.decode(key))), value }))
  }

  async * _allKeys () {
    yield * Object.entries(this.data)
      .map(([key]) => CID.createV1(raw.code, Digest.decode(base32.decode(key))))
  }
}

module.exports = MemoryBlockstore
