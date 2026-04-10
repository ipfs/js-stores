export class OpenFailedError extends Error {
  static name = 'OpenFailedError'
  name = OpenFailedError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_OPEN_FAILED'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = OpenFailedError.code

  constructor (message = 'Open failed') {
    super(message)
  }
}

export class CloseFailedError extends Error {
  static name = 'CloseFailedError'
  name = CloseFailedError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_CLOSE_FAILED'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = CloseFailedError.code

  constructor (message = 'Close failed') {
    super(message)
  }
}

export class PutFailedError extends Error {
  static name = 'PutFailedError'
  name = PutFailedError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_PUT_FAILED'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = PutFailedError.code

  constructor (message = 'Put failed') {
    super(message)
  }
}

export class GetFailedError extends Error {
  static name = 'GetFailedError'
  name = GetFailedError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_GET_FAILED'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = GetFailedError.code

  constructor (message = 'Get failed') {
    super(message)
  }
}

export class DeleteFailedError extends Error {
  static name = 'DeleteFailedError'
  name = DeleteFailedError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_DELETE_FAILED'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = DeleteFailedError.code

  constructor (message = 'Delete failed') {
    super(message)
  }
}

export class HasFailedError extends Error {
  static name = 'HasFailedError'
  name = HasFailedError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_HAS_FAILED'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = HasFailedError.code

  constructor (message = 'Has failed') {
    super(message)
  }
}

export class NotFoundError extends Error {
  static name = 'NotFoundError'
  name = NotFoundError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_NOT_FOUND'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = NotFoundError.code

  constructor (message = 'Not Found') {
    super(message)
  }
}

/**
 * @deprecated import from 'abort-error' module instead - this will be removed in a future release
 */
export class AbortError extends Error {
  static name = 'AbortError'
  name = AbortError.name

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  static code = 'ERR_ABORTED'

  /**
   * @deprecated use `.name` instead - this will be removed in a future release
   */
  code = AbortError.code

  constructor (message = 'Aborted') {
    super(message)
  }
}
