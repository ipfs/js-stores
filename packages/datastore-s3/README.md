# datastore-s3

[![ipfs.tech](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](https://ipfs.tech)
[![Discuss](https://img.shields.io/discourse/https/discuss.ipfs.tech/posts.svg?style=flat-square)](https://discuss.ipfs.tech)
[![codecov](https://img.shields.io/codecov/c/github/ipfs/js-stores.svg?style=flat-square)](https://codecov.io/gh/ipfs/js-stores)
[![CI](https://img.shields.io/github/actions/workflow/status/ipfs/js-stores/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/ipfs/js-stores/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> IPFS datastore implementation backed by s3

# About

A Datastore implementation that stores data on Amazon S3.

## Example - Quickstart

If the flag `createIfMissing` is not set or is false, then the bucket must be created prior to using datastore-s3. Please see the AWS docs for information on how to configure the S3 instance. A bucket name is required to be set at the s3 instance level, see the below example.

```js
import { S3 } from '@aws-sdk/client-s3'
import { S3Datastore } from 'datastore-s3'

const s3 = new S3({
  region: 'region',
  credentials: {
    accessKeyId: 'myaccesskey',
    secretAccessKey: 'mysecretkey'
  }
})

const store = new S3Datastore(
  s3,
  'my-bucket',
  { path: '.ipfs/datastore', createIfMissing: false }
)
```

## Example

```ts
Using with Helia

See [examples/helia](./examples/helia) for a full example of how to use Helia with an S3 backed datastore.
```

# Install

```console
$ npm i datastore-s3
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `DatastoreS3` in the global namespace.

```html
<script src="https://unpkg.com/datastore-s3/dist/index.min.js"></script>
```

# API Docs

- <https://ipfs.github.io/js-stores/modules/datastore_s3.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/ipfs/js-stores/blob/main/packages/datastore-s3/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/ipfs/js-stores/blob/main/packages/datastore-s3/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribute

Contributions welcome! Please check out [the issues](https://github.com/ipfs/js-stores/issues).

Also see our [contributing document](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md) for more information on how we work, and about contributing in general.

Please be aware that all interactions related to this repo are subject to the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)
