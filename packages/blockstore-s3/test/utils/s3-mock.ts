import sinon from 'sinon'
import type { S3 } from '@aws-sdk/client-s3'

export class S3Error extends Error {
  public code: string
  public statusCode?: number
  public $metadata?: { httpStatusCode: number }

  constructor (message: string, code?: number) {
    super(message)
    this.code = message
    this.statusCode = code

    this.$metadata = {
      httpStatusCode: code ?? 200
    }
  }
}

export const s3Resolve = (res?: any): any => {
  return Promise.resolve(res)
}

export const s3Reject = <T> (err: T): any => {
  return Promise.reject(err)
}

/**
 * Mocks out the s3 calls made by blockstore-s3
 */
export function s3Mock (s3: S3): S3 {
  const mocks: any = {}
  const storage = new Map<string, any>()

  mocks.send = sinon.replace(s3, 'send', (command: any) => {
    const commandName = command.constructor.name
    const input: any = command.input

    if (commandName.includes('PutObjectCommand') === true) {
      storage.set(input.Key, input.Body)
      return s3Resolve({})
    }

    if (commandName.includes('HeadObjectCommand') === true) {
      if (storage.has(input.Key)) {
        return s3Resolve({})
      }

      return s3Reject(new S3Error('NotFound', 404))
    }

    if (commandName.includes('GetObjectCommand') === true) {
      if (!storage.has(input.Key)) {
        return s3Reject(new S3Error('NotFound', 404))
      }

      return s3Resolve({
        Body: storage.get(input.Key)
      })
    }

    if (commandName.includes('DeleteObjectCommand') === true) {
      storage.delete(input.Key)
      return s3Resolve({})
    }

    if (commandName.includes('ListObjectsV2Command') === true) {
      const results: { Contents: Array<{ Key: string }> } = {
        Contents: []
      }

      for (const k of storage.keys()) {
        if (k.startsWith(`${input.Prefix ?? ''}`)) {
          results.Contents.push({
            Key: k
          })
        }
      }

      return s3Resolve(results)
    }

    return s3Reject(new S3Error('UnknownCommand', 400))
  })

  return s3
}
