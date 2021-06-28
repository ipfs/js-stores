/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const Key = require('../src').Key

const pathSep = '/'

describe('Key', () => {
  /**
   * @param {string} s
   */
  const clean = (s) => {
    let fixed = s
    if (fixed.startsWith(pathSep + pathSep)) {
      fixed = fixed.slice(1)
    }
    if (fixed.length > 1 && fixed.endsWith(pathSep)) {
      fixed = fixed.slice(0, -1)
    }

    return fixed
  }

  describe('basic', () => {
    /**
     * @param {string} s
     */
    const validKey = (s) => it(s, () => {
      const fixed = clean(pathSep + s)
      const namespaces = fixed.split(pathSep).slice(1)
      const lastNamespace = namespaces[namespaces.length - 1]
      const lnparts = lastNamespace.split(':')
      let ktype = ''
      if (lnparts.length > 1) {
        ktype = lnparts.slice(0, -1).join(':')
      }
      const kname = lnparts[lnparts.length - 1]
      const kchild = clean(fixed + '/cchildd')
      const kparent = pathSep + namespaces.slice(0, -1).join(pathSep)
      const kpath = clean(kparent + pathSep + ktype)
      const kinstance = fixed + ':inst'

      const k = new Key(s)
      expect(k.toString()).to.eql(fixed)
      expect(k).to.eql(new Key(s))
      expect(k.toString()).to.eql(new Key(s).toString())
      expect(k.name()).to.eql(kname)
      expect(k.type()).to.eql(ktype)
      expect(k.path().toString()).to.eql(kpath)
      expect(k.instance('inst').toString()).to.eql(kinstance)

      const child = new Key('cchildd')
      expect(k.child(child).toString()).to.eql(kchild)
      expect(k.child(child).parent().toString()).to.eql(fixed)
      expect(k.parent().toString()).to.eql(kparent)
      expect(k.list()).to.have.length(namespaces.length)
      expect(k.namespaces()).to.have.length(namespaces.length)
      k.list().forEach((e, i) => {
        expect(namespaces[i]).to.eql(e)
      })
    })

    validKey('')
    validKey('abcde')
    validKey('disahfidsalfhduisaufidsail')
    validKey('/fdisahfodisa/fdsa/fdsafdsafdsafdsa/fdsafdsa/')
    validKey('4215432143214321432143214321')
    validKey('a/b/c/d/')
    validKey('abcde:fdsfd')
    validKey('disahfidsalfhduisaufidsail:fdsa')
    validKey('/fdisahfodisa/fdsa/fdsafdsafdsafdsa/fdsafdsa/:')
    validKey('4215432143214321432143214321:')
  })

  it('ancestry', () => {
    const k1 = new Key('/A/B/C')
    const k2 = new Key('/A/B/C/D')

    expect(k1.toString()).to.be.eql('/A/B/C')
    expect(k2.toString()).to.be.eql('/A/B/C/D')

    const checks = [
      k1.isAncestorOf(k2),
      k2.isDecendantOf(k1),
      new Key('/A').isAncestorOf(k2),
      new Key('/A').isAncestorOf(k1),
      !new Key('/A').isDecendantOf(k2),
      !new Key('/A').isDecendantOf(k1),
      k2.isDecendantOf(new Key('/A')),
      k1.isDecendantOf(new Key('/A')),
      !k2.isAncestorOf(new Key('/A')),
      !k1.isAncestorOf(new Key('/A')),
      !k2.isAncestorOf(k2),
      !k1.isAncestorOf(k1)
    ]

    checks.forEach((check) => expect(check).to.equal(true))

    expect(k1.child(new Key('D')).toString()).to.eql(k2.toString())
    expect(k1.toString()).to.eql(k2.parent().toString())
    expect(k1.path().toString()).to.eql(k2.parent().path().toString())
  })

  it('type', () => {
    const k1 = new Key('/A/B/C:c')
    const k2 = new Key('/A/B/C:c/D:d')

    expect(k1.isAncestorOf(k2)).to.eql(true)
    expect(k2.isDecendantOf(k1)).to.eql(true)

    expect(k1.type()).to.eql('C')
    expect(k2.type()).to.eql('D')
    expect(k1.type()).to.eql(k2.parent().type())
  })

  it('random', () => {
    /** @type {Record<string, boolean>} */
    const keys = {}
    const k = 100
    for (let i = 0; i < k; i++) {
      const r = Key.random()
      expect(keys).to.not.have.key(r.toString())
      keys[r.toString()] = true
    }

    expect(Object.keys(keys)).to.have.length(k)
  })

  it('less', () => {
    /**
     * @param {string | Uint8Array} a
     * @param {string | Uint8Array} b
     */
    const checkLess = (a, b) => {
      const ak = new Key(a)
      const bk = new Key(b)

      expect(ak.less(bk)).to.eql(true)
      expect(bk.less(ak)).to.eql(false)
    }

    checkLess('/a/b/c', '/a/b/c/d')
    checkLess('/a/b', '/a/b/c/d')
    checkLess('/a', '/a/b/c/d')
    checkLess('/a/a/c', '/a/b/c')
    checkLess('/a/a/d', '/a/b/c')
    checkLess('/a/b/c/d/e/f/g/h', '/b')
    checkLess(pathSep, '/a')
  })

  it('concat', () => {
    const originalKey = new Key('/a/b/c')

    const concattedKey = originalKey.concat(new Key('/d/e/f'))
    expect(concattedKey.toString()).to.equal('/a/b/c/d/e/f')

    // Original key is not changed
    expect(originalKey.toString()).to.equal('/a/b/c')

    const concattedMultipleKeys = originalKey.concat(new Key('/d/e'), new Key('/f/g'))
    expect(concattedMultipleKeys.toString()).to.equal('/a/b/c/d/e/f/g')

    // New instance of Key is always created
    expect(originalKey.concat()).to.not.equal(originalKey)
    // but has the same value
    expect(originalKey.concat().toString()).to.equal('/a/b/c')
  })

  it('uint8Array', () => {
    const arr = Uint8Array.from(['/'.charCodeAt(0), 0, 1, 2, 3])
    const key = new Key(arr)
    const buf = key.uint8Array()

    expect(buf).to.deep.equal(arr)
  })

  it('uint8Array with surplus bytes', () => {
    const arr = Uint8Array.from(['/'.charCodeAt(0), 0, 1, 2, 3, 4])
    const view = new Uint8Array(arr.buffer, 0, arr.length - 1)

    // should be same buffer
    expect(view.buffer).to.equal(arr.buffer)
    expect(view.buffer.byteLength).to.equal(arr.buffer.byteLength)

    // view should be shorter than wrapped buffer
    expect(view.length).to.be.lessThan(arr.buffer.byteLength)
    expect(view.byteLength).to.be.lessThan(arr.buffer.byteLength)

    const key = new Key(view)
    const buf = key.uint8Array()

    expect(buf).to.deep.equal(view)
  })

  it('uint8Array with trailing slashes', () => {
    const slash = '/'.charCodeAt(0)
    const arrWithSlashes = Uint8Array.from([slash, 0, 1, 2, 3, slash, slash, slash])
    const arrWithoutSlashes = Uint8Array.from([slash, 0, 1, 2, 3])
    const key = new Key(arrWithSlashes)
    const buf = key.uint8Array()

    // slashes should have been stripped
    expect(buf).to.deep.equal(arrWithoutSlashes)

    // should be a view on the original buffer
    expect(buf.buffer).to.equal(arrWithSlashes.buffer)
  })
})
