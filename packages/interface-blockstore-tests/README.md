# interface-blockstore-tests <!-- omit in toc -->

> A test suite for [interface-blockstore](https://github.com/ipfs/js-ipfs-interfaces/tree/master/packages/interface-blockstore) implementations

## Table of Contents <!-- omit in toc -->

- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Usage

```js
const MyBlockstore = require('./path/to/my-blockstore')
const suite = require('interface-blockstore-tests')

describe('MyBlockstore', () => {
  describe('interface-blockstore compliance tests', () => {
    suite({
      setup () {
        return new MyBlockstore()
      },
      teardown () {}
    })
  })
})
```

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[Apache-2.0](LICENSE-APACHE) OR [MIT](LICENSE-MIT)
