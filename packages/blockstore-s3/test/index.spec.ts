/* eslint-env mocha */

import { type CreateBucketCommand, type HeadObjectCommand, S3 } from '@aws-sdk/client-s3'
import { expect } from 'aegir/chai'
import { interfaceBlockstoreTests } from 'interface-blockstore-tests'
import { CID } from 'multiformats/cid'
import defer from 'p-defer'
import sinon from 'sinon'
import { S3Blockstore } from '../src/index.js'
import { s3Resolve, s3Reject, S3Error, s3Mock } from './utils/s3-mock.js'

const cid = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')

describe('S3Blockstore', () => {
  describe('construction', () => {
    it('requires an s3', () => {
      expect(
        // @ts-expect-error missing params
        () => new S3Blockstore()
      ).to.throw()
    })

    it('requires a bucket', () => {
      const s3 = new S3({ region: 'REGION' })
      expect(
        // @ts-expect-error missing params
        () => new S3Blockstore(s3)
      ).to.throw()
    })

    it('createIfMissing defaults to false', () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test')
      expect(store.createIfMissing).to.equal(false)
    })

    it('createIfMissing can be set to true', () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test', { createIfMissing: true })
      expect(store.createIfMissing).to.equal(true)
    })
  })

  describe('put', () => {
    it('should return a standard error when the put fails', async () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test')

      sinon.replace(s3, 'send', (command: any) => {
        if (command.constructor.name.includes('PutObjectCommand') === true) {
          return s3Reject(new Error('bad things happened'))
        }

        return s3Reject(new S3Error('UnknownCommand'))
      })

      await expect(store.put(cid, new TextEncoder().encode('test data'))).to.eventually.rejected
        .with.property('name', 'PutFailedError')
    })
  })

  describe('get', () => {
    it('should return a standard not found error code if the key isn\'t found', async () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test')

      sinon.replace(s3, 'send', (command: any) => {
        if (command.constructor.name.includes('GetObjectCommand') === true) {
          return s3Reject(new S3Error('NotFound', 404))
        }

        return s3Reject(new S3Error('UnknownCommand'))
      })

      await expect(store.get(cid)).to.eventually.rejected
        .with.property('name', 'NotFoundError')
    })
  })

  describe('delete', () => {
    it('should return a standard delete error if deletion fails', async () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test')

      sinon.replace(s3, 'send', (command: any) => {
        if (command.constructor.name.includes('DeleteObjectCommand') === true) {
          return s3Reject(new Error('bad things'))
        }

        return s3Reject(new S3Error('UnknownCommand'))
      })

      await expect(store.delete(cid)).to.eventually.rejected
        .with.property('name', 'DeleteFailedError')
    })
  })

  describe('open', () => {
    it('should create the bucket when missing if createIfMissing is true', async () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test', { createIfMissing: true })

      // 1. On the first call upload will fail with a NoSuchBucket error
      // 2. This should result in the `createBucket` standin being called
      // 3. upload is then called a second time and it passes

      const bucketTested = defer<HeadObjectCommand>()
      const bucketCreated = defer<CreateBucketCommand>()

      sinon.replace(s3, 'send', (command: any) => {
        if (command.constructor.name.includes('HeadObjectCommand') === true) {
          bucketTested.resolve(command)
          return s3Reject(new S3Error('NoSuchBucket'))
        }

        if (command.constructor.name.includes('CreateBucketCommand') === true) {
          bucketCreated.resolve(command)
          return s3Resolve(null)
        }

        return s3Reject(new S3Error('UnknownCommand'))
      })

      await store.open()

      const headObjectCommand = await bucketTested.promise
      expect(headObjectCommand).to.have.nested.property('input.Bucket', 'test')

      const createBucketCommand = await bucketCreated.promise
      expect(createBucketCommand).to.have.nested.property('input.Bucket', 'test')
    })

    it('should not create the bucket when missing if createIfMissing is false', async () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test')

      const bucketTested = defer<HeadObjectCommand>()

      sinon.replace(s3, 'send', (command: any) => {
        if (command.constructor.name.includes('HeadObjectCommand') === true) {
          bucketTested.resolve(command)
          return s3Reject(new S3Error('NoSuchBucket'))
        }

        return s3Reject(new S3Error('UnknownCommand'))
      })

      await expect(store.open()).to.eventually.rejected
        .with.property('name', 'OpenFailedError')

      const headObjectCommand = await bucketTested.promise
      expect(headObjectCommand).to.have.nested.property('input.Bucket', 'test')
    })

    it('should return a standard open error if the head request fails with an unknown error', async () => {
      const s3 = new S3({ region: 'REGION' })
      const store = new S3Blockstore(s3, 'test')

      sinon.replace(s3, 'send', (command: any) => {
        if (command.constructor.name.includes('HeadObjectCommand') === true) {
          return s3Reject(new Error('bad things'))
        }

        return s3Reject(new S3Error('UnknownCommand'))
      })

      await expect(store.open()).to.eventually.rejected
        .with.property('name', 'OpenFailedError')
    })
  })

  describe('interface-blockstore', () => {
    interfaceBlockstoreTests({
      setup () {
        const s3 = s3Mock(new S3({ region: 'REGION' }))

        return new S3Blockstore(s3, 'test')
      },
      teardown () {
      }
    })
  })
})
