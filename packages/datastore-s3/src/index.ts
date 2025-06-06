/**
 * @packageDocumentation
 *
 * A Datastore implementation that stores data on Amazon S3.
 *
 * @example Quickstart
 *
 * If the flag `createIfMissing` is not set or is false, then the bucket must be created prior to using datastore-s3. Please see the AWS docs for information on how to configure the S3 instance. A bucket name is required to be set at the s3 instance level, see the below example.
 *
 * ```js
 * import { S3 } from '@aws-sdk/client-s3'
 * import { S3Datastore } from 'datastore-s3'
 *
 * const s3 = new S3({
 *   region: 'region',
 *   credentials: {
 *     accessKeyId: 'myaccesskey',
 *     secretAccessKey: 'mysecretkey'
 *   }
 * })
 *
 * const store = new S3Datastore(
 *   s3,
 *   'my-bucket',
 *   { path: '.ipfs/datastore', createIfMissing: false }
 * )
 * ```
 *
 * @example Using with Helia
 *
 * See [examples/helia](./examples/helia) for a full example of how to use Helia with an S3 backed datastore.
 */

import {
  PutObjectCommand,
  CreateBucketCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3'
import { BaseDatastore } from 'datastore-core/base'
import { Key } from 'interface-datastore'
import { DeleteFailedError, GetFailedError, HasFailedError, NotFoundError, OpenFailedError, PutFailedError } from 'interface-store'
import filter from 'it-filter'
import toBuffer from 'it-to-buffer'
import { fromString as unint8arrayFromString } from 'uint8arrays'
import type { S3 } from '@aws-sdk/client-s3'
import type { KeyQuery, Pair, Query } from 'interface-datastore'
import type { AbortOptions } from 'interface-store'

export interface S3DatastoreInit {
  /**
   * An optional path to use within the bucket for all files - this setting can
   * affect S3 performance as it does internal sharding based on 'prefixes' -
   * these can be delimited by '/' so it's often better  to wrap this datastore in
   * a sharding datastore which will generate prefixed datastore keys for you.
   *
   * See - https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html
   * and https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html
   */
  path?: string

  /**
   * Whether to try to create the bucket if it is missing when `.open` is called
   */
  createIfMissing?: boolean
}

/**
 * A datastore backed by AWS S3
 */
export class S3Datastore extends BaseDatastore {
  public path?: string
  public createIfMissing: boolean
  private readonly s3: S3
  private readonly bucket: string

  constructor (s3: S3, bucket: string, init?: S3DatastoreInit) {
    super()

    if (s3 == null) {
      throw new Error('An S3 instance must be supplied. See the datastore-s3 README for examples.')
    }

    if (bucket == null) {
      throw new Error('An bucket must be supplied. See the datastore-s3 README for examples.')
    }

    this.path = init?.path
    this.s3 = s3
    this.bucket = bucket
    this.createIfMissing = init?.createIfMissing ?? false
  }

  /**
   * Returns the full key which includes the path to the ipfs store
   */
  _getFullKey (key: Key): string {
    // Avoid absolute paths with s3
    return [this.path, key.toString()].filter(Boolean).join('/').replace(/\/\/+/g, '/')
  }

  /**
   * Store the given value under the key.
   */
  async put (key: Key, val: Uint8Array, options?: AbortOptions): Promise<Key> {
    try {
      options?.signal?.throwIfAborted()
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: this._getFullKey(key),
          Body: val
        }), {
          abortSignal: options?.signal
        }
      )

      return key
    } catch (err: any) {
      throw new PutFailedError(String(err))
    }
  }

  /**
   * Read from s3
   */
  async get (key: Key, options?: AbortOptions): Promise<Uint8Array> {
    try {
      options?.signal?.throwIfAborted()
      const data = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: this._getFullKey(key)
          // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
        }, {
          abortSignal: options?.signal
        })
      )

      if (data.Body == null) {
        throw new Error('Response had no body')
      }

      // If a body was returned, ensure it's a Uint8Array
      if (data.Body instanceof Uint8Array) {
        return data.Body
      }

      if (typeof data.Body === 'string') {
        return unint8arrayFromString(data.Body)
      }

      if (data.Body instanceof Blob) {
        const buf = await data.Body.arrayBuffer()

        return new Uint8Array(buf, 0, buf.byteLength)
      }

      // @ts-expect-error s3 types define their own Blob as an empty interface
      return await toBuffer(data.Body)
    } catch (err: any) {
      if (err.statusCode === 404) {
        throw new NotFoundError(String(err))
      }

      throw new GetFailedError(String(err))
    }
  }

  /**
   * Check for the existence of the given key
   */
  async has (key: Key, options?: AbortOptions): Promise<boolean> {
    try {
      options?.signal?.throwIfAborted()
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: this._getFullKey(key)
        }), {
          abortSignal: options?.signal
        }
      )

      return true
    } catch (err: any) {
      // doesn't exist and permission policy includes s3:ListBucket
      if (err.$metadata?.httpStatusCode === 404) {
        return false
      }

      // doesn't exist, permission policy does not include s3:ListBucket
      if (err.$metadata?.httpStatusCode === 403) {
        return false
      }

      throw new HasFailedError(String(err))
    }
  }

  /**
   * Delete the record under the given key
   */
  async delete (key: Key, options?: AbortOptions): Promise<void> {
    try {
      options?.signal?.throwIfAborted()
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: this._getFullKey(key)
        }), {
          abortSignal: options?.signal
        }
      )
    } catch (err: any) {
      throw new DeleteFailedError(String(err))
    }
  }

  /**
   * Recursively fetches all keys from s3
   */
  async * _listKeys (params: { Prefix?: string, StartAfter?: string }, options?: AbortOptions): AsyncIterable<Key> {
    try {
      options?.signal?.throwIfAborted()
      const data = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          ...params
        }), {
          abortSignal: options?.signal
        }
      )

      if (options?.signal?.aborted === true) {
        return
      }

      if (data?.Contents == null) {
        throw new Error('Not found')
      }

      for (const d of data.Contents) {
        if (d.Key == null) {
          throw new Error('Not found')
        }

        // Remove the path from the key
        yield new Key(d.Key.slice((this.path ?? '').length), false)
      }

      // If we didn't get all records, recursively query
      if (data.IsTruncated === true) {
        // If NextMarker is absent, use the key from the last result
        params.StartAfter = data.Contents[data.Contents.length - 1].Key

        // recursively fetch keys
        yield * this._listKeys(params)
      }
    } catch (err: any) {
      throw new GetFailedError(String(err))
    }
  }

  async * _all (q: Query, options?: AbortOptions): AsyncIterable<Pair> {
    for await (const key of this._allKeys({ prefix: q.prefix }, options)) {
      try {
        const res: Pair = {
          key,
          value: await this.get(key, options)
        }

        yield res
      } catch (err: any) {
        // key was deleted while we are iterating over the results
        if (err.name !== 'NotFoundError') {
          throw err
        }
      }
    }
  }

  async * _allKeys (q: KeyQuery, options?: AbortOptions): AsyncIterable<Key> {
    const prefix = [this.path, q.prefix ?? ''].filter(Boolean).join('/').replace(/\/\/+/g, '/')

    // Get all the keys via list object, recursively as needed
    let it = this._listKeys({
      Prefix: prefix
    }, options)

    if (q.prefix != null) {
      it = filter(it, k => k.toString().startsWith(`${q.prefix ?? ''}`))
    }

    yield * it
  }

  /**
   * This will check the s3 bucket to ensure access and existence
   */
  async open (options?: AbortOptions): Promise<void> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: this.path ?? ''
        }), {
          abortSignal: options?.signal
        }
      )
    } catch (err: any) {
      if (err.statusCode !== 404) {
        if (this.createIfMissing) {
          await this.s3.send(
            new CreateBucketCommand({
              Bucket: this.bucket
            }), {
              abortSignal: options?.signal
            }
          )
          return
        }

        throw new OpenFailedError(String(err))
      }
    }
  }
}
