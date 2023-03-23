/* eslint-env mocha */

import { expect } from 'aegir/chai'
import {
  Prefix,
  Suffix,
  NextToLast,
  parseShardFun
} from '../src/shard.js'

describe('shard', () => {
  it('prefix', () => {
    expect(
      new Prefix(2).fun('hello')
    ).to.eql(
      'he'
    )
    expect(
      new Prefix(2).fun('h')
    ).to.eql(
      'h_'
    )

    expect(
      new Prefix(2).toString()
    ).to.eql(
      '/repo/flatfs/shard/v1/prefix/2'
    )
  })

  it('suffix', () => {
    expect(
      new Suffix(2).fun('hello')
    ).to.eql(
      'lo'
    )
    expect(
      new Suffix(2).fun('h')
    ).to.eql(
      '_h'
    )

    expect(
      new Suffix(2).toString()
    ).to.eql(
      '/repo/flatfs/shard/v1/suffix/2'
    )
  })

  it('next-to-last', () => {
    expect(
      new NextToLast(2).fun('hello')
    ).to.eql(
      'll'
    )
    expect(
      new NextToLast(3).fun('he')
    ).to.eql(
      '__h'
    )

    expect(
      new NextToLast(2).toString()
    ).to.eql(
      '/repo/flatfs/shard/v1/next-to-last/2'
    )
  })
})

describe('parsesShardFun', () => {
  it('errors', () => {
    const errors = [
      '',
      'shard/v1/next-to-last/2',
      '/repo/flatfs/shard/v2/next-to-last/2',
      '/repo/flatfs/shard/v1/other/2',
      '/repo/flatfs/shard/v1/next-to-last/'
    ]

    errors.forEach((input) => {
      expect(
        () => parseShardFun(input)
      ).to.throw()
    })
  })

  it('success', () => {
    const success = [
      'prefix',
      'suffix',
      'next-to-last'
    ]

    success.forEach((name) => {
      const n = Math.floor(Math.random() * 100)
      expect(
        parseShardFun(
          `/repo/flatfs/shard/v1/${name}/${n}`
        ).name
      ).to.eql(name)
    })
  })
})
