/* eslint-env mocha */

import { expect } from 'aegir/chai'
import * as utils from '../src/utils.js'

describe('utils', () => {
  it('replaceStartWith', () => {
    expect(
      utils.replaceStartWith('helloworld', 'hello')
    ).to.eql(
      'world'
    )

    expect(
      utils.replaceStartWith('helloworld', 'world')
    ).to.eql(
      'helloworld'
    )
  })
})
