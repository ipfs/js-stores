## [9.0.4](https://github.com/ipfs/js-datastore-core/compare/v9.0.3...v9.0.4) (2023-03-23)


### Dependencies

* update interface-store to 5.x.x ([#149](https://github.com/ipfs/js-datastore-core/issues/149)) ([2820b0d](https://github.com/ipfs/js-datastore-core/commit/2820b0ddce94aefe85cb9ba09b387cc59494e130))

## [9.0.3](https://github.com/ipfs/js-datastore-core/compare/v9.0.2...v9.0.3) (2023-03-14)


### Bug Fixes

* add error for db read failures ([#146](https://github.com/ipfs/js-datastore-core/issues/146)) ([afab18a](https://github.com/ipfs/js-datastore-core/commit/afab18a9b6000ebe4670abee5bd401e024d0ae0f))

## [9.0.2](https://github.com/ipfs/js-datastore-core/compare/v9.0.1...v9.0.2) (2023-03-13)


### Bug Fixes

* update shard creation ([59081a7](https://github.com/ipfs/js-datastore-core/commit/59081a7a3b8e596705fd5834b35bfb9ac73c3f39))

## [9.0.1](https://github.com/ipfs/js-datastore-core/compare/v9.0.0...v9.0.1) (2023-03-13)


### Bug Fixes

* update project config ([#145](https://github.com/ipfs/js-datastore-core/issues/145)) ([5bb5601](https://github.com/ipfs/js-datastore-core/commit/5bb5601735c59f6aed7dd52112194d233e86267b))

## [9.0.0](https://github.com/ipfs/js-datastore-core/compare/v8.0.4...v9.0.0) (2023-03-13)


### ⚠ BREAKING CHANGES

* update to latest datastore interface

### Features

* update to latest datastore interface ([#144](https://github.com/ipfs/js-datastore-core/issues/144)) ([46059f1](https://github.com/ipfs/js-datastore-core/commit/46059f184bb49414fb494135ca544ca6a2d0ee66))

## [8.0.4](https://github.com/ipfs/js-datastore-core/compare/v8.0.3...v8.0.4) (2023-01-11)


### Bug Fixes

* throw error with message from error in tiered datastore ([#133](https://github.com/ipfs/js-datastore-core/issues/133)) ([2fd4be4](https://github.com/ipfs/js-datastore-core/commit/2fd4be4b72ff203b4bc3643ca469aab7a17abbc3))

## [8.0.3](https://github.com/ipfs/js-datastore-core/compare/v8.0.2...v8.0.3) (2022-12-23)


### Dependencies

* bump it-* deps ([#132](https://github.com/ipfs/js-datastore-core/issues/132)) ([4b7fd55](https://github.com/ipfs/js-datastore-core/commit/4b7fd559e21bfb5645037a177b32c973e7f05b4a))

## [8.0.2](https://github.com/ipfs/js-datastore-core/compare/v8.0.1...v8.0.2) (2022-10-12)


### Dependencies

* update uint8arrays from 3.x.x to 4.x.x ([#121](https://github.com/ipfs/js-datastore-core/issues/121)) ([16d99b7](https://github.com/ipfs/js-datastore-core/commit/16d99b72454df33453f68d644a1daa6656d9dcf2))

## [8.0.1](https://github.com/ipfs/js-datastore-core/compare/v8.0.0...v8.0.1) (2022-08-12)


### Dependencies

* update interface-datastore and interface-datastore-tests ([#118](https://github.com/ipfs/js-datastore-core/issues/118)) ([e5f47e2](https://github.com/ipfs/js-datastore-core/commit/e5f47e200059e056c34da1fcf4b795a3272f1459))

## [8.0.0](https://github.com/ipfs/js-datastore-core/compare/v7.0.3...v8.0.0) (2022-08-12)


### ⚠ BREAKING CHANGES

* this module is now ESM-only

### Features

* switch to ESM-only ([#109](https://github.com/ipfs/js-datastore-core/issues/109)) ([cbaef20](https://github.com/ipfs/js-datastore-core/commit/cbaef2000a78bcdaa750e932b3a681d8e41cd727))

### [7.0.3](https://github.com/ipfs/js-datastore-core/compare/v7.0.2...v7.0.3) (2022-07-25)


### Bug Fixes

* errors export ([#111](https://github.com/ipfs/js-datastore-core/issues/111)) ([be15e74](https://github.com/ipfs/js-datastore-core/commit/be15e74bb2a505aeee81d06da2dfdc07fc919096)), closes [#109](https://github.com/ipfs/js-datastore-core/issues/109)

### [7.0.2](https://github.com/ipfs/js-datastore-core/compare/v7.0.1...v7.0.2) (2022-07-21)


### Bug Fixes

* pass options to tiered put ([#108](https://github.com/ipfs/js-datastore-core/issues/108)) ([7a8f9ff](https://github.com/ipfs/js-datastore-core/commit/7a8f9ffb226c4940145637a6c881b835ce4886cb))


### Trivial Changes

* Update .github/workflows/stale.yml [skip ci] ([7e56180](https://github.com/ipfs/js-datastore-core/commit/7e56180b4d1da793a2ab3102135a4665b80bd462))
* update package.json version ([54b543d](https://github.com/ipfs/js-datastore-core/commit/54b543d08aef9c75e6bd3cb015d2a3d000ef26c6))

### [7.0.1](https://github.com/ipfs/js-datastore-core/compare/v7.0.0...v7.0.1) (2022-01-28)


### Bug Fixes

* fix generated types to missing import ([#86](https://github.com/ipfs/js-datastore-core/issues/86)) ([8805e71](https://github.com/ipfs/js-datastore-core/commit/8805e71f5840dac2dea4d3220b4f3975b39d5161)), closes [#85](https://github.com/ipfs/js-datastore-core/issues/85)

## [7.0.0](https://github.com/ipfs/js-datastore-core/compare/v6.0.7...v7.0.0) (2022-01-19)


### ⚠ BREAKING CHANGES

* key prefixes are no longer stripped by MountDatastore

### Bug Fixes

* do not strip prefixes for MountDatastores ([#82](https://github.com/ipfs/js-datastore-core/issues/82)) ([73bae74](https://github.com/ipfs/js-datastore-core/commit/73bae74ac794bf7585d432a3337e40fe85cb68f4))


### Trivial Changes

* switch to unified ci ([#83](https://github.com/ipfs/js-datastore-core/issues/83)) ([b3f79e6](https://github.com/ipfs/js-datastore-core/commit/b3f79e6d07440e37aabc83d1ebabe2b5c0e2bd30))

## [6.0.7](https://github.com/ipfs/js-datastore-core/compare/v6.0.6...v6.0.7) (2021-09-09)



## [6.0.6](https://github.com/ipfs/js-datastore-core/compare/v6.0.5...v6.0.6) (2021-09-09)



## [6.0.5](https://github.com/ipfs/js-datastore-core/compare/v6.0.4...v6.0.5) (2021-09-08)



## [6.0.4](https://github.com/ipfs/js-datastore-core/compare/v6.0.3...v6.0.4) (2021-09-08)



## [6.0.3](https://github.com/ipfs/js-datastore-core/compare/v6.0.2...v6.0.3) (2021-09-08)



## [6.0.2](https://github.com/ipfs/js-datastore-core/compare/v6.0.1...v6.0.2) (2021-09-08)



## [6.0.1](https://github.com/ipfs/js-datastore-core/compare/v6.0.0...v6.0.1) (2021-09-08)



# [6.0.0](https://github.com/ipfs/js-datastore-core/compare/v5.0.2...v6.0.0) (2021-09-08)


### chore

* update to esm ([#71](https://github.com/ipfs/js-datastore-core/issues/71)) ([ace9a06](https://github.com/ipfs/js-datastore-core/commit/ace9a06e879ff3fef9493754a7bbc7981595d9a4))


### BREAKING CHANGES

* deep requires/imports are no longer possible



## [5.0.2](https://github.com/ipfs/js-datastore-core/compare/v5.0.1...v5.0.2) (2021-08-23)



## [5.0.1](https://github.com/ipfs/js-datastore-core/compare/v5.0.0...v5.0.1) (2021-07-23)


### Bug Fixes

* use streaming methods where possible ([#65](https://github.com/ipfs/js-datastore-core/issues/65)) ([ec90398](https://github.com/ipfs/js-datastore-core/commit/ec9039827829dcd0e6e5c652ecb8707e80c48010))



# [5.0.0](https://github.com/ipfs/js-datastore-core/compare/v4.0.0...v5.0.0) (2021-07-06)


### chore

* update deps ([e154404](https://github.com/ipfs/js-datastore-core/commit/e154404317838f147fbb9ab11417a8d671aba9a4))


### BREAKING CHANGES

* implements new interface-datastore types, will cause duplicates in the dep tree



# [4.0.0](https://github.com/ipfs/js-datastore-core/compare/v3.0.0...v4.0.0) (2021-04-15)


### Bug Fixes

* fix async sharding tests ([#49](https://github.com/ipfs/js-datastore-core/issues/49)) ([a546afb](https://github.com/ipfs/js-datastore-core/commit/a546afb0cef751025aac73c5f3bcfa3bedd1dff4))


### Features

* split .query into .query and .queryKeys ([#59](https://github.com/ipfs/js-datastore-core/issues/59)) ([6f829db](https://github.com/ipfs/js-datastore-core/commit/6f829db2e8d1aed3b9c36a7bb95625a15c077e02))



# [3.0.0](https://github.com/ipfs/js-datastore-core/compare/v2.0.1...v3.0.0) (2021-01-22)


### Bug Fixes

* fix ShardingDatastore creation ([#48](https://github.com/ipfs/js-datastore-core/issues/48)) ([21b48e7](https://github.com/ipfs/js-datastore-core/commit/21b48e7ccc965a1422f8a0f7eadbd83715b5cac6))


### Features

* ts types, github ci and clean up ([#39](https://github.com/ipfs/js-datastore-core/issues/39)) ([bee45ae](https://github.com/ipfs/js-datastore-core/commit/bee45ae0b778171d0919e135ea8affcf2d6de635))



## [2.0.1](https://github.com/ipfs/js-datastore-core/compare/v2.0.0...v2.0.1) (2020-11-09)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ipfs/js-datastore-core/compare/v1.1.0...v2.0.0) (2020-07-29)


### Bug Fixes

* remove node buffers ([#27](https://github.com/ipfs/js-datastore-core/issues/27)) ([a9786b9](https://github.com/ipfs/js-datastore-core/commit/a9786b9))


### BREAKING CHANGES

* no longer uses node Buffers, only Uint8Arrays



<a name="1.1.0"></a>
# [1.1.0](https://github.com/ipfs/js-datastore-core/compare/v1.0.0...v1.1.0) (2020-05-07)


### Bug Fixes

* **ci:** add empty commit to fix lint checks on master ([a19da65](https://github.com/ipfs/js-datastore-core/commit/a19da65))


### Features

* add streaming/cancellable API ([#23](https://github.com/ipfs/js-datastore-core/issues/23)) ([5e7858e](https://github.com/ipfs/js-datastore-core/commit/5e7858e))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/ipfs/js-datastore-core/compare/v0.7.0...v1.0.0) (2020-04-06)


### Bug Fixes

* add buffer and cleanup ([#22](https://github.com/ipfs/js-datastore-core/issues/22)) ([f0f64a9](https://github.com/ipfs/js-datastore-core/commit/f0f64a9))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/ipfs/js-datastore-core/compare/v0.6.1...v0.7.0) (2019-05-29)



<a name="0.6.1"></a>
## [0.6.1](https://github.com/ipfs/js-datastore-core/compare/v0.6.0...v0.6.1) (2019-05-23)


### Bug Fixes

* remove leftpad and cleanup ([8558fcd](https://github.com/ipfs/js-datastore-core/commit/8558fcd))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/ipfs/js-datastore-core/compare/v0.5.0...v0.6.0) (2018-10-24)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/ipfs/js-datastore-core/compare/v0.4.0...v0.5.0) (2018-09-19)


### Bug Fixes

* **ci:** build on appveyor ([#9](https://github.com/ipfs/js-datastore-core/issues/9)) ([687314b](https://github.com/ipfs/js-datastore-core/commit/687314b))


### Features

* add basic error codes ([bf79768](https://github.com/ipfs/js-datastore-core/commit/bf79768))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/ipfs/js-datastore-core/compare/v0.3.0...v0.4.0) (2017-11-04)


### Bug Fixes

* sharding and query for windows interop ([#6](https://github.com/ipfs/js-datastore-core/issues/6)) ([845316d](https://github.com/ipfs/js-datastore-core/commit/845316d))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/ipfs/js-datastore-core/compare/v0.2.0...v0.3.0) (2017-07-23)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/ipfs/js-datastore-core/compare/v0.1.0...v0.2.0) (2017-03-23)


### Features

* add open method ([1462fcc](https://github.com/ipfs/js-datastore-core/commit/1462fcc))



<a name="0.1.0"></a>
# 0.1.0 (2017-03-15)
