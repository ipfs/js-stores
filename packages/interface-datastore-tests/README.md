# interface-datastore-tests <!-- omit in toc -->

> A test suite for [interface-datastore](https://github.com/ipfs/interface-datastore) implementations

## Table of Contents <!-- omit in toc -->

- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Usage

```js
const MyDatastore from './path/to/my-datastore')
const suite from 'interface-datastore-tests')

describe('MyDatastore', () => {
  describe('interface-datastore compliance tests', () => {
    suite({
      setup () {
        return new MyDatastore()
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
