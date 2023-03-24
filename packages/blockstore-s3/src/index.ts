import type { Pair } from 'interface-blockstore'
import { BaseBlockstore } from 'blockstore-core/base'
import * as Errors from 'blockstore-core/errors'
import { fromString as unint8arrayFromString } from 'uint8arrays'
import toBuffer from 'it-to-buffer'
import type { S3 } from '@aws-sdk/client-s3'
import type { AbortOptions } from 'interface-store'
import {
  PutObjectCommand,
  CreateBucketCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3'
import { CID } from 'multiformats/cid'
import { base32upper } from 'multiformats/bases/base32'
import type { MultibaseCodec } from 'multiformats/bases/interface'

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

  /**
   * The multibase codec to use - nb. should be case insensitive.
   * default: base32upper
   */
  base?: MultibaseCodec<string>
}

/**
 * A blockstore backed by AWS S3
 */
export class S3Blockstore extends BaseBlockstore {
  public path?: string
  public createIfMissing: boolean
  private readonly s3: S3
  private readonly bucket: string
  private readonly base: MultibaseCodec<string>

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
    this.base = init?.base ?? base32upper
  }

  /**
   * Returns the full key which includes the path to the ipfs store
   */
  _getFullKey (cid: CID): string {
    // Avoid absolute paths with s3
    const str = this.base.encoder.encode(cid.multihash.bytes)

    return [this.path, str].filter(Boolean).join('/').replace(/\/\/+/g, '/')
  }

  /**
   * Store the given value under the key.
   */
  async put (key: CID, val: Uint8Array, options?: AbortOptions): Promise<CID> {
    try {
      // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
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
      throw Errors.putFailedError(err)
    }
  }

  /**
   * Read from s3
   */
  async get (key: CID, options?: AbortOptions): Promise<Uint8Array> {
    try {
      // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
      const data = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: this._getFullKey(key)
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

      // @ts-expect-error s3 types define their own Blob as an empty interface
      return await toBuffer(data.Body)
    } catch (err: any) {
      if (err.statusCode === 404) {
        throw Errors.notFoundError(err)
      }
      throw err
    }
  }

  /**
   * Check for the existence of the given key
   */
  async has (key: CID, options?: AbortOptions): Promise<boolean> {
    try {
      // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
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

      throw err
    }
  }

  /**
   * Delete the record under the given key
   */
  async delete (key: CID, options?: AbortOptions): Promise<void> {
    try {
      // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: this._getFullKey(key)
        }), {
          abortSignal: options?.signal
        }
      )
    } catch (err: any) {
      throw Errors.deleteFailedError(err)
    }
  }

  async * getAll (options?: AbortOptions): AsyncIterable<Pair> {
    const params: Record<string, any> = {}

    try {
      while (true) {
        // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
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

        if (data == null || data.Contents == null) {
          throw new Error('Not found')
        }

        for (const d of data.Contents) {
          if (d.Key == null) {
            throw new Error('Not found')
          }

          // Remove the path from the key
          const cid = CID.decode(this.base.decoder.decode(d.Key.slice((this.path ?? '').length)))

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
      throw new Error(err.code)
    }
  }

  /**
   * This will check the s3 bucket to ensure access and existence
   */
  async open (options?: AbortOptions): Promise<void> {
    try {
      // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
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
          // @ts-expect-error the AWS AbortSignal types are different to the @types/node version
          await this.s3.send(
            new CreateBucketCommand({
              Bucket: this.bucket
            }), {
              abortSignal: options?.signal
            }
          )
          return
        }

        throw Errors.openFailedError(err)
      }
    }
  }
}
