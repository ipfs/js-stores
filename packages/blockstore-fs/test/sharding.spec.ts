/* eslint-env mocha */
import { expect } from 'aegir/chai'
import { base32upper } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import { FlatDirectory, NextToLast } from '../src/sharding.js'

describe('flat', () => {
  it('should encode', () => {
    const cid = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')
    const strategy = new FlatDirectory()
    const { dir, file } = strategy.encode(cid)

    expect(dir).to.equal('')
    expect(file).to.equal(`${base32upper.encode(cid.multihash.bytes)}.data`)
  })

  it('should encode with extension', () => {
    const cid = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')
    const strategy = new FlatDirectory({
      extension: '.file'
    })
    const { dir, file } = strategy.encode(cid)

    expect(dir).to.equal('')
    expect(file).to.equal(`${base32upper.encode(cid.multihash.bytes)}.file`)
  })

  it('should decode', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const strategy = new FlatDirectory()
    const cid = strategy.decode(`${mh}.data`)

    expect(cid).to.eql(CID.decode(base32upper.decode(mh)))
  })

  it('should decode with extension', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const strategy = new FlatDirectory({
      extension: '.file'
    })
    const cid = strategy.decode(`${mh}.file`)

    expect(cid).to.eql(CID.decode(base32upper.decode(mh)))
  })
})

describe('next to last', () => {
  it('should encode', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const cid = CID.decode(base32upper.decode(mh))
    const strategy = new NextToLast()
    const { dir, file } = strategy.encode(cid)

    expect(dir).to.equal('LY')
    expect(file).to.equal(`${mh}.data`)
  })

  it('should encode with prefix length', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const cid = CID.decode(base32upper.decode(mh))
    const strategy = new NextToLast({
      prefixLength: 4
    })
    const { dir, file } = strategy.encode(cid)

    expect(dir).to.equal('QYLY')
    expect(file).to.equal(`${mh}.data`)
  })

  it('should encode with extension', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const cid = CID.decode(base32upper.decode(mh))
    const strategy = new NextToLast({
      extension: '.file'
    })
    const { dir, file } = strategy.encode(cid)

    expect(dir).to.equal('LY')
    expect(file).to.equal(`${mh}.file`)
  })

  it('should decode', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const strategy = new NextToLast()
    const cid = strategy.decode(`LY/${mh}.data`)

    expect(cid).to.eql(CID.decode(base32upper.decode(mh)))
  })

  it('should decode with prefix length', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const strategy = new NextToLast({
      prefixLength: 4
    })
    const cid = strategy.decode(`QYLY/${mh}.data`)

    expect(cid).to.eql(CID.decode(base32upper.decode(mh)))
  })

  it('should decode with extension', () => {
    const mh = 'BCIQPGZJ6QLZOFG3OP45NLMSJUWGJCO72QQKHLDTB6FXIB6BDSLRQYLY'
    const strategy = new NextToLast({
      extension: '.file'
    })
    const cid = strategy.decode(`LY/${mh}.file`)

    expect(cid).to.eql(CID.decode(base32upper.decode(mh)))
  })
})
