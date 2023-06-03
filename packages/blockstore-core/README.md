# blockstore-core <!-- omit in toc -->

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/js-stores.svg?style=flat-square)](https://codecov.io/gh/ipfs/js-stores)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/js-stores/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/ipfs/js-stores/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Contains various implementations of the API contract described in interface-blockstore

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Implementations](#implementations)
- [Usage](#usage)
  - [BaseBlockstore](#baseblockstore)
  - [MemoryBlockstore](#memoryblockstore)
  - [BlackHoleBlockstore](#blackholeblockstore)
- [API Docs](#api-docs)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i blockstore-core
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `BlockstoreCore` in the global namespace.

```html
<script src="https://unpkg.com/blockstore-core/dist/index.min.js"></script>
```

## Implementations

- Base: [`src/base`](src/base.ts)
- Memory: [`src/memory`](src/memory.ts)
- BlackHole: ['src/blackhole](src/blackhole.ts)

## Usage

### BaseBlockstore

Provides a complete implementation of the Blockstore interface.  You must implement `.get`, `.put`, etc.

```js
import { BaseBlockstore } from 'blockstore-core/base'

class MyCustomBlockstore extends BaseBlockstore {
  put (key, val, options) {
    // store a block
  }

  get (key, options) {
    // retrieve a block
  }

  // ...etc
}
```

### MemoryBlockstore

A simple Blockstore that stores blocks in memory.

```js
import { MemoryBlockstore } from 'blockstore-core/memory'

const store = new MemoryBlockstore()
```

### BlackHoleBlockstore

A Blockstore that does not store any blocks.

```js
import { BlackHoleBlockstore } from 'blockstore-core/black-hole'

const store = new BlackHoleBlockstore()
```

## API Docs

- <https://ipfs.github.io/js-stores/modules/blockstore_core.html>

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Contributions welcome! Please check out [the issues](https://github.com/ipfs/js-stores/issues).

Also see our [contributing document](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md) for more information on how we work, and about contributing in general.

Please be aware that all interactions related to this repo are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)
