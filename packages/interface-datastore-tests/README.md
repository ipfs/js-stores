# interface-datastore-tests <!-- omit in toc -->

[![ipfs.io](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io)
[![IRC](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Discord](https://img.shields.io/discord/806902334369824788?style=flat-square)](https://discord.gg/ipfs)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/js-ipfs-interfaces.svg?style=flat-square)](https://codecov.io/gh/ipfs/js-ipfs-interfaces)
[![CI](https://img.shields.io/github/workflow/status/ipfs/js-ipfs-interfaces/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/ipfs/js-ipfs-interfaces/actions/workflows/js-test-and-release.yml)

> Compliance tests for the datastore interface

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)
- [Contribute](#contribute-1)

## Install

```console
$ npm i interface-datastore-tests
```

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

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Feel free to join in. All welcome. Open an [issue](https://github.com/ipfs/js-ipfs-unixfs-importer/issues)!

This repository falls under the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)