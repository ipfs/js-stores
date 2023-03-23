import errCode from 'err-code'

export function dbOpenFailedError (err?: Error): Error {
  err = err ?? new Error('Cannot open database')
  return errCode(err, 'ERR_DB_OPEN_FAILED')
}

export function dbDeleteFailedError (err?: Error): Error {
  err = err ?? new Error('Delete failed')
  return errCode(err, 'ERR_DB_DELETE_FAILED')
}

export function dbWriteFailedError (err?: Error): Error {
  err = err ?? new Error('Write failed')
  return errCode(err, 'ERR_DB_WRITE_FAILED')
}

export function dbReadFailedError (err?: Error): Error {
  err = err ?? new Error('Read failed')
  return errCode(err, 'ERR_DB_READ_FAILED')
}

export function notFoundError (err?: Error): Error {
  err = err ?? new Error('Not Found')
  return errCode(err, 'ERR_NOT_FOUND')
}

export function abortedError (err?: Error): Error {
  err = err ?? new Error('Aborted')
  return errCode(err, 'ERR_ABORTED')
}
