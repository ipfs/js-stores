import errCode from 'err-code'

export function openFailedError (err?: Error): Error {
  err = err ?? new Error('Open failed')
  return errCode(err, 'ERR_OPEN_FAILED')
}

export function closeFailedError (err?: Error): Error {
  err = err ?? new Error('Close failed')
  return errCode(err, 'ERR_CLOSE_FAILED')
}

export function putFailedError (err?: Error): Error {
  err = err ?? new Error('Put failed')
  return errCode(err, 'ERR_PUT_FAILED')
}

export function getFailedError (err?: Error): Error {
  err = err ?? new Error('Get failed')
  return errCode(err, 'ERR_GET_FAILED')
}

export function deleteFailedError (err?: Error): Error {
  err = err ?? new Error('Delete failed')
  return errCode(err, 'ERR_DELETE_FAILED')
}

export function hasFailedError (err?: Error): Error {
  err = err ?? new Error('Has failed')
  return errCode(err, 'ERR_HAS_FAILED')
}

export function notFoundError (err?: Error): Error {
  err = err ?? new Error('Not Found')
  return errCode(err, 'ERR_NOT_FOUND')
}

export function abortedError (err?: Error): Error {
  err = err ?? new Error('Aborted')
  return errCode(err, 'ERR_ABORTED')
}
