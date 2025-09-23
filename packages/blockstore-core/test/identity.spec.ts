/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from 'it-all'
import drain from 'it-drain'
import toBuffer from 'it-to-buffer'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { identity } from 'multiformats/hashes/identity'
import { sha256 } from 'multiformats/hashes/sha2'
import { IdentityBlockstore } from '../src/identity.js'
import { MemoryBlockstore } from '../src/memory.js'
import type { Blockstore } from 'interface-blockstore'

describe('identity', () => {
  let blockstore: Blockstore
  let child: Blockstore

  beforeEach(() => {
    blockstore = new IdentityBlockstore()
    child = new MemoryBlockstore()
  })

  it('has an identity CID', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = identity.digest(block)
    const cid = CID.createV1(identity.code, multihash)

    expect(blockstore.has(cid)).to.be.true()
    expect(toBuffer(await all(blockstore.get(cid)))).to.equalBytes(block)
  })

  it('does not have a non-identity CID', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = await sha256.digest(block)
    const cid = CID.createV1(raw.code, multihash)

    expect(blockstore.has(cid)).to.be.false()

    await blockstore.put(cid, block)

    expect(blockstore.has(cid)).to.be.false()
  })

  it('cannot delete an identity CID', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = identity.digest(block)
    const cid = CID.createV1(identity.code, multihash)

    await blockstore.delete(cid)

    expect(blockstore.has(cid)).to.be.true()
  })

  it('cannot delete many identity CIDs', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = identity.digest(block)
    const cid = CID.createV1(identity.code, multihash)

    await drain(blockstore.deleteMany([cid]))

    expect(blockstore.has(cid)).to.be.true()
  })

  it('puts CIDs to child', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = await sha256.digest(block)
    const cid = CID.createV1(raw.code, multihash)

    blockstore = new IdentityBlockstore(child)

    await blockstore.put(cid, block)
    expect(child.has(cid)).to.be.true()
    expect(toBuffer(await all(child.get(cid)))).to.equalBytes(block)
  })

  it('gets CIDs from child', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = await sha256.digest(block)
    const cid = CID.createV1(raw.code, multihash)

    await child.put(cid, block)

    blockstore = new IdentityBlockstore(child)
    expect(blockstore.has(cid)).to.be.true()
    expect(toBuffer(await all(blockstore.get(cid)))).to.equalBytes(block)
  })

  it('has CIDs from child', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = await sha256.digest(block)
    const cid = CID.createV1(raw.code, multihash)

    await child.put(cid, block)

    blockstore = new IdentityBlockstore(child)
    expect(blockstore.has(cid)).to.be.true()
  })

  it('deletes CIDs from child', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = await sha256.digest(block)
    const cid = CID.createV1(raw.code, multihash)

    await child.put(cid, block)

    blockstore = new IdentityBlockstore(child)
    expect(blockstore.has(cid)).to.be.true()

    await blockstore.delete(cid)

    expect(blockstore.has(cid)).to.be.false()
  })

  it('gets all pairs from child', async () => {
    const block = Uint8Array.from([0, 1, 2, 3, 4])
    const multihash = await sha256.digest(block)
    const cid = CID.createV1(raw.code, multihash)

    await child.put(cid, block)

    blockstore = new IdentityBlockstore(child)
    expect(blockstore.has(cid)).to.be.true()

    const result = await all(blockstore.getAll())

    expect(result).to.have.lengthOf(1)
    expect(result[0].cid.toString()).to.equal(cid.toString())
  })
})
