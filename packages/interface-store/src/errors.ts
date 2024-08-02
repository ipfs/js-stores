export class OpenFailedError extends Error {
  constructor (message = 'Open failed') {
    super(message)
    this.name = 'OpenFailedError'
  }
}

export class CloseFailedError extends Error {
  constructor (message = 'Close failed') {
    super(message)
    this.name = 'CloseFailedError'
  }
}

export class PutFailedError extends Error {
  constructor (message = 'Put failed') {
    super(message)
    this.name = 'PutFailedError'
  }
}

export class GetFailedError extends Error {
  constructor (message = 'Get failed') {
    super(message)
    this.name = 'GetFailedError'
  }
}

export class DeleteFailedError extends Error {
  constructor (message = 'Delete failed') {
    super(message)
    this.name = 'DeleteFailedError'
  }
}

export class HasFailedError extends Error {
  constructor (message = 'Has failed') {
    super(message)
    this.name = 'HasFailedError'
  }
}

export class NotFoundError extends Error {
  constructor (message = 'Not Found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class AbortError extends Error {
  constructor (message = 'Aborted') {
    super(message)
    this.name = 'AbortError'
  }
}
