'use strict'

const errCode = require('err-code')

/**
 * @param {Error} [err]
 */
function notFoundError (err) {
  err = err || new Error('Not Found')
  return errCode(err, 'ERR_NOT_FOUND')
}

module.exports = {
  notFoundError
}
