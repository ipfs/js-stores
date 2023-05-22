# interface-blockstore <!-- omit in toc -->

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/js-stores.svg?style=flat-square)](https://codecov.io/gh/ipfs/js-stores)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/js-stores/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/ipfs/js-stores/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> An interface for storing and retrieving blocks

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Implementations](#implementations)
- [API Docs](#api-docs)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i interface-blockstore
```

## Implementations

- File System: [`blockstore-fs`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-fs)
- IndexedDB: [`blockstore-idb`](https://github.com/ipfs/js-stores/blob/main/packages/blockstore-idb)
- level: [`blockstore-level`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-level) (supports any levelup compatible backend)
- Memory: [`blockstore-core/memory`](https://github.com/ipfs/js-stores/blob/main/packages/blockstore-core/src/memory.ts)
- S3: [`blockstore-s3`](https://github.com/ipfs/js-stores/tree/main/packages/blockstore-s3)

## API Docs

- <https://ipfs.github.io/js-stores/modules/interface_blockstore.html>

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
