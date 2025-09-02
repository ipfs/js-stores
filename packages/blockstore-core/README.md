# blockstore-core

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/js-stores.svg?style=flat-square)](https://codecov.io/gh/ipfs/js-stores)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/js-stores/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/ipfs/js-stores/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Contains various implementations of the API contract described in interface-blockstore

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

Various Blockstore implementations are available.

## Implementations

- Base: [`src/base`](./src/base.ts)
- Memory: [`src/memory`](./src/memory.ts)
- BlackHole: ['src/black-hole](./src/black-hole.ts)
- Tiered: ['src/tiered](./src/tiered.ts)

## Example - BaseBlockstore

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

## Example - MemoryBlockstore

A simple Blockstore that stores blocks in memory.

```js
import { MemoryBlockstore } from 'blockstore-core/memory'

const store = new MemoryBlockstore()
```

## Example - BlackHoleBlockstore

A Blockstore that does not store any blocks.

```js
import { BlackHoleBlockstore } from 'blockstore-core/black-hole'

const store = new BlackHoleBlockstore()
```

## Example - TieredBlockstore

A tiered blockstore wraps one or more blockstores and will query each in parallel to retrieve a block - the operation will succeed if any wrapped store has the block.

Writes are invoked on all wrapped blockstores.

```js
import { TieredBlockstore } from 'blockstore-core/tiered'

const store = new TieredBlockstore([
  store1,
  store2,
  // ...etc
])
```

## Example - IdentityBlockstore

An identity blockstore is one that deals exclusively in Identity CIDs - this is a special CID with the codec [0x00](https://github.com/multiformats/multicodec/blob/d06fc6194710e8909bac64273c43f16b56ca4c34/table.csv#L2) where the multihash digest is the data that makes up the block.

```TypeScript
import { IdentityBlockstore } from 'blockstore-core/identity'
import { CID } from 'multiformats/cid'

const blockstore = new IdentityBlockstore()

blockstore.has(CID.parse('QmFoo')) // false

blockstore.has(CID.parse('bafkqac3imvwgy3zao5xxe3de')) // true
```

# Install

```console
$ npm i blockstore-core
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `BlockstoreCore` in the global namespace.

```html
<script src="https://unpkg.com/blockstore-core/dist/index.min.js"></script>
```

# API Docs

- <https://ipfs.github.io/js-stores/modules/blockstore_core.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/ipfs/js-stores/blob/main/packages/blockstore-core/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/ipfs/js-stores/blob/main/packages/blockstore-core/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribute

Contributions welcome! Please check out [the issues](https://github.com/ipfs/js-stores/issues).

Also see our [contributing document](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md) for more information on how we work, and about contributing in general.

Please be aware that all interactions related to this repo are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)
