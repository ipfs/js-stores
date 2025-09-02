/**
 * @packageDocumentation
 *
 * A Blockstore implementation that stores blocks on Amazon S3.
 *
 * @example Quickstart
 *
 * If the flag `createIfMissing` is not set or is false, then the bucket must be created prior to using blockstore-s3. Please see the AWS docs for information on how to configure the S3 instance. A bucket name is required to be set at the s3 instance level, see the below example.
 *
 * ```js
 * import { S3 } from '@aws-sdk/client-s3'
 * import { S3Blockstore } from 'blockstore-s3'
 *
 * const s3 = new S3({
 *   region: 'region',
 *   credentials: {
 *     accessKeyId: 'myaccesskey',
 *     secretAccessKey: 'mysecretkey'
 *   }
 * })
 *
 * const store = new S3Blockstore(
 *   s3,
 *   'my-bucket',
 *   { createIfMissing: false }
 * )
 * ```
 *
 * @example Using with Helia
 *
 * See [examples/helia](./examples/helia) for a full example of how to use Helia with an S3 backed blockstore.
 */

import {
  PutObjectCommand,
  CreateBucketCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3'
import { BaseBlockstore } from 'blockstore-core/base'
import { DeleteFailedError, GetFailedError, HasFailedError, NotFoundError, OpenFailedError, PutFailedError } from 'interface-store'
import toBuffer from 'it-to-buffer'
import { fromString as unint8arrayFromString } from 'uint8arrays'
import { NextToLast } from './sharding.js'
import type { ShardingStrategy } from './sharding.js'
import type { S3 } from '@aws-sdk/client-s3'
import type { Pair } from 'interface-blockstore'
import type { AbortOptions } from 'interface-store'
import type { CID } from 'multiformats/cid'

export type { ShardingStrategy }

export interface S3BlockstoreInit {
  /**
   * Whether to try to create the bucket if it is missing when `.open` is called
   */
  createIfMissing?: boolean

  /**
   * Control how CIDs map to paths and back
   */
  shardingStrategy?: ShardingStrategy
}

/**
 * A blockstore backed by AWS S3
 */
export class S3Blockstore extends BaseBlockstore {
  public createIfMissing: boolean
  private readonly s3: S3
  private readonly bucket: string
  private readonly shardingStrategy: ShardingStrategy

  constructor (s3: S3, bucket: string, init?: S3BlockstoreInit) {
    super()

    if (s3 == null) {
      throw new Error('An S3 instance must be supplied. See the blockstore-s3 README for examples.')
    }

    if (bucket == null) {
      throw new Error('An bucket must be supplied. See the blockstore-s3 README for examples.')
    }

    this.s3 = s3
    this.bucket = bucket
    this.createIfMissing = init?.createIfMissing ?? false
    this.shardingStrategy = init?.shardingStrategy ?? new NextToLast()
  }

  /**
   * Store the given value under the key.
   */
  async put (key: CID, val: Uint8Array, options?: AbortOptions): Promise<CID> {
    try {
      options?.signal?.throwIfAborted()
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: this.shardingStrategy.encode(key),
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
  async get (key: CID, options?: AbortOptions): Promise<Uint8Array> {
    try {
      options?.signal?.throwIfAborted()
      const data = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: this.shardingStrategy.encode(key)
        }), {
          abortSignal: options?.signal
        }
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
  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    try {
      options?.signal?.throwIfAborted()
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: this.shardingStrategy.encode(key)
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
  async delete (key: CID, options?: AbortOptions): Promise<void> {
    try {
      options?.signal?.throwIfAborted()
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: this.shardingStrategy.encode(key)
        }), {
          abortSignal: options?.signal
        }
      )
    } catch (err: any) {
      throw new DeleteFailedError(String(err))
    }
  }

  async * getAll (options?: AbortOptions): AsyncIterable<Pair> {
    const params: Record<string, any> = {}

    try {
      while (true) {
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
          const cid = this.shardingStrategy.decode(d.Key)

          yield {
            cid,
            block: await this.get(cid, options)
          }
        }

        // If we didn't get all records, recursively query
        if (data.IsTruncated === true) {
          // If NextMarker is absent, use the key from the last result
          params.StartAfter = data.Contents[data.Contents.length - 1].Key

          // recursively fetch keys
          continue
        }

        break
      }
    } catch (err: any) {
      throw new GetFailedError(String(err))
    }
  }

  /**
   * This will check the s3 bucket to ensure access and existence
   */
  async open (options?: AbortOptions): Promise<void> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: ''
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
