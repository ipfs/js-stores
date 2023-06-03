# datastore-core <!-- omit in toc -->

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/js-stores.svg?style=flat-square)](https://codecov.io/gh/ipfs/js-stores)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/js-stores/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/ipfs/js-stores/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Wrapper implementation for interface-datastore

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Implementations](#implementations)
- [Usage](#usage)
  - [BaseDatastore](#basedatastore)
  - [Wrapping Stores](#wrapping-stores)
- [Contribute](#contribute)
- [API Docs](#api-docs)
- [License](#license)
- [Contribute](#contribute-1)

## Install

```console
$ npm i datastore-core
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `DatastoreCore` in the global namespace.

```html
<script src="https://unpkg.com/datastore-core/dist/index.min.js"></script>
```

## Implementations

- Wrapper Implementations
  - Mount: [`src/mount`](src/mount.ts)
  - Keytransform: [`src/keytransform`](src/keytransform.ts)
  - Sharding: [`src/sharding`](src/sharding.ts)
  - Tiered: [`src/tiered`](src/tirered.ts)
  - Namespace: [`src/namespace`](src/namespace.ts)
  - BlackHole: [`src/black-hole`](src/black-hole.ts)

## Usage

### BaseDatastore

An base store is made available to make implementing your own datastore easier:

```javascript
import { BaseDatastore } from 'datastore-core'

class MyDatastore extends BaseDatastore {
  constructor () {
    super()
  }

  async put (key, val) {
    // your implementation here
  }

  async get (key) {
    // your implementation here
  }

  // etc...
}
```

See the [MemoryDatastore](./src/memory.js) for an example of how it is used.

### Wrapping Stores

```js
import { Key } from 'interface-datastore'
import {
  MemoryStore,
  MountStore
} from 'datastore-core'

const store = new MountStore({prefix: new Key('/a'), datastore: new MemoryStore()})
```

### BlackHoleDatastore

A datastore that does not store any data.

```js
import { BlackHoleDatastore } from 'datastore-core/black-hole'

const store = new BlackHoleDatastore()
```

## Contribute

Feel free to join in. All welcome. Open an [issue](https://github.com/ipfs/js-ipfs-unixfs-importer/issues)!

This repository falls under the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)

## API Docs

- <https://ipfs.github.io/js-stores/modules/datastore_core.html>

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
