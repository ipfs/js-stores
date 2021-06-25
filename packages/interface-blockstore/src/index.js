'use strict'

const BlockstoreAdapter = require('./adapter')
const MemoryBlockstore = require('./memory')

/**
 * @typedef {import('./types').Options} Options
 * @typedef {import('./types').Pair} Pair
 * @typedef {import('./types').Batch} Batch
 * @typedef {import('./types').Blockstore} Blockstore
 * @typedef {import('./types').QueryFilter} QueryFilter
 * @typedef {import('./types').QueryOrder} QueryOrder
 * @typedef {import('./types').Query} Query
 * @typedef {import('./types').KeyQueryFilter} KeyQueryFilter
 * @typedef {import('./types').KeyQueryOrder} KeyQueryOrder
 * @typedef {import('./types').KeyQuery} KeyQuery
 */

module.exports = {
  BlockstoreAdapter,
  MemoryBlockstore
}
