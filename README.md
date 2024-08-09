# stores

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/js-stores.svg?style=flat-square)](https://codecov.io/gh/ipfs/js-stores)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/js-stores/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/ipfs/js-stores/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Blockstores and datastores used by IP-JS internals

# Packages

- [`packages/blockstore-core`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-core) Contains various implementations of the API contract described in interface-blockstore
- [`packages/blockstore-fs`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-fs) Blockstore implementation with file system backend
- [`packages/blockstore-idb`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-idb) Blockstore implementation with IndexedDB backend
- [`packages/blockstore-level`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-level) Blockstore implementation with level(up|down) backend
- [`packages/blockstore-s3`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-s3) IPFS blockstore implementation backed by s3
- [`packages/datastore-core`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-core) Wrapper implementation for interface-datastore
- [`packages/datastore-fs`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-fs) Datastore implementation with file system backend
- [`packages/datastore-idb`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-idb) Datastore implementation with IndexedDB backend.
- [`packages/datastore-level`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-level) Datastore implementation with level(up|down) backend
- [`packages/datastore-s3`](https://github.com/ipfs/js-stores/tree/main/packages/datastore-s3) IPFS datastore implementation backed by s3
- [`packages/interface-blockstore`](https://github.com/ipfs/js-stores/tree/main/packages/interface-blockstore) An interface for storing and retrieving blocks
- [`packages/interface-blockstore-tests`](https://github.com/ipfs/js-stores/tree/main/packages/interface-blockstore-tests) Compliance tests for the blockstore interface
- [`packages/interface-datastore`](https://github.com/ipfs/js-stores/tree/main/packages/interface-datastore) datastore interface
- [`packages/interface-datastore-tests`](https://github.com/ipfs/js-stores/tree/main/packages/interface-datastore-tests) Compliance tests for the datastore interface
- [`packages/interface-store`](https://github.com/ipfs/js-stores/tree/main/packages/interface-store) A generic interface for storing and retrieving data

# API Docs

- <https://ipfs.github.io/js-stores>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/ipfs/js-stores/blob/main/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/ipfs/js-stores/blob/main/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribute

Contributions welcome! Please check out [the issues](https://github.com/ipfs/js-stores/issues).

Also see our [contributing document](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md) for more information on how we work, and about contributing in general.

Please be aware that all interactions related to this repo are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)
