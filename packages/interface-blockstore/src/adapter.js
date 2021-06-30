'use strict'

const drain = require('it-drain')
const filter = require('it-filter')
const take = require('it-take')
const all = require('it-all')

/**
 * Collect all values from the iterable and sort them using
 * the passed sorter function
 *
 * @template T
 * @param {AsyncIterable<T> | Iterable<T>} iterable
 * @param {(a: T, b: T) => -1 | 0 | 1} sorter
 * @returns {AsyncIterable<T>}
 */
const sortAll = (iterable, sorter) => {
  return (async function * () {
    const values = await all(iterable)
    yield * values.sort(sorter)
  })()
}

/**
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').Pair} Pair
 * @typedef {import('./types').Blockstore} Blockstore
 * @typedef {import('./types').Query} Query
 * @typedef {import('./types').KeyQuery} KeyQuery
 * @typedef {import('./types').Batch} Batch
 *
 * @typedef {import('multiformats').CID} CID
 */

/**
 * @template O
 * @typedef {import('interface-store').AwaitIterable<O>} AwaitIterable
 */

/**
 * @implements {Blockstore}
 */
class BlockstoreAdapter {
  /**
   * @returns {Promise<void>}
   */
  open () {
    return Promise.reject(new Error('.open is not implemented'))
  }

  /**
   * @returns {Promise<void>}
   */
  close () {
    return Promise.reject(new Error('.close is not implemented'))
  }

  /**
   * @param {CID} key
   * @param {Uint8Array} val
   * @param {Options} [options]
   * @returns {Promise<void>}
   */
  put (key, val, options) {
    return Promise.reject(new Error('.put is not implemented'))
  }

  /**
   * @param {CID} key
   * @param {Options} [options]
   * @returns {Promise<Uint8Array>}
   */
  get (key, options) {
    return Promise.reject(new Error('.get is not implemented'))
  }

  /**
   * @param {CID} key
   * @param {Options} [options]
   * @returns {Promise<boolean>}
   */
  has (key, options) {
    return Promise.reject(new Error('.has is not implemented'))
  }

  /**
   * @param {CID} key
   * @param {Options} [options]
   * @returns {Promise<void>}
   */
  delete (key, options) {
    return Promise.reject(new Error('.delete is not implemented'))
  }

  /**
   * @param {AwaitIterable<Pair>} source
   * @param {Options} [options]
   * @returns {AsyncIterable<Pair>}
   */
  async * putMany (source, options = {}) {
    for await (const { key, value } of source) {
      await this.put(key, value, options)
      yield { key, value }
    }
  }

  /**
   * @param {AwaitIterable<CID>} source
   * @param {Options} [options]
   * @returns {AsyncIterable<Uint8Array>}
   */
  async * getMany (source, options = {}) {
    for await (const key of source) {
      yield this.get(key, options)
    }
  }

  /**
   * @param {AwaitIterable<CID>} source
   * @param {Options} [options]
   * @returns {AsyncIterable<CID>}
   */
  async * deleteMany (source, options = {}) {
    for await (const key of source) {
      await this.delete(key, options)
      yield key
    }
  }

  /**
   * @returns {Batch}
   */
  batch () {
    /** @type {Pair[]} */
    let puts = []
    /** @type {CID[]} */
    let dels = []

    return {
      put (key, value) {
        puts.push({ key, value })
      },

      delete (key) {
        dels.push(key)
      },
      commit: async (options) => {
        await drain(this.putMany(puts, options))
        puts = []
        await drain(this.deleteMany(dels, options))
        dels = []
      }
    }
  }

  /**
   * Extending classes should override `query` or implement this method
   *
   * @param {Query} q
   * @param {Options} [options]
   * @returns {AsyncIterable<Pair>}
   */
  // eslint-disable-next-line require-yield
  async * _all (q, options) {
    throw new Error('._all is not implemented')
  }

  /**
   * Extending classes should override `queryKeys` or implement this method
   *
   * @param {KeyQuery} q
   * @param {Options} [options]
   * @returns {AsyncIterable<CID>}
   */
  // eslint-disable-next-line require-yield
  async * _allKeys (q, options) {
    throw new Error('._allKeys is not implemented')
  }

  /**
   * @param {Query} q
   * @param {Options} [options]
   */
  query (q, options) {
    let it = this._all(q, options)

    if (q.prefix != null) {
      it = filter(it, (/** @type {Pair} */ e) =>
        e.key.toString().startsWith(q.prefix || '')
      )
    }

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sortAll(it, f), it)
    }

    if (q.offset != null) {
      let i = 0
      it = filter(it, () => i++ >= (q.offset || 0))
    }

    if (q.limit != null) {
      it = take(it, q.limit)
    }

    return it
  }

  /**
   * @param {KeyQuery} q
   * @param {Options} [options]
   */
  queryKeys (q, options) {
    let it = this._allKeys(q, options)

    if (q.prefix != null) {
      it = filter(it, (/** @type {CID} */ cid) => cid.toString().startsWith(q.prefix || ''))
    }

    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it, f) => filter(it, f), it)
    }

    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it, f) => sortAll(it, f), it)
    }

    if (q.offset != null) {
      let i = 0
      it = filter(it, () => i++ >= /** @type {number} */ (q.offset))
    }

    if (q.limit != null) {
      it = take(it, q.limit)
    }

    return it
  }
}

module.exports = BlockstoreAdapter
