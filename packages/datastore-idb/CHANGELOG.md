## [2.0.1](https://github.com/ipfs/js-datastore-idb/compare/v2.0.0...v2.0.1) (2023-03-23)


### Bug Fixes

* update interface-store to 5.x.x ([#100](https://github.com/ipfs/js-datastore-idb/issues/100)) ([4c918fc](https://github.com/ipfs/js-datastore-idb/commit/4c918fcef352f381810d18225e679202a873f028))


### Trivial Changes

* update benchmark ([#99](https://github.com/ipfs/js-datastore-idb/issues/99)) ([49aa042](https://github.com/ipfs/js-datastore-idb/commit/49aa0429e0c07f1c53c8031567e3b77f154daa49))

## [2.0.0](https://github.com/ipfs/js-datastore-idb/compare/v1.1.0...v2.0.0) (2023-03-14)


### ⚠ BREAKING CHANGES

* this module has been converted to typescript, updated to the latest interface-datastore version and is ESM-only

### Features

* convert to typescript ([#98](https://github.com/ipfs/js-datastore-idb/issues/98)) ([a34262f](https://github.com/ipfs/js-datastore-idb/commit/a34262fa979145a8defcb0ff8a0de2e0cf0ef54b)), closes [#6](https://github.com/ipfs/js-datastore-idb/issues/6)


### Documentation

* fix link ([417af5b](https://github.com/ipfs/js-datastore-idb/commit/417af5b92518a8f81d3aa2b89e1755312453420f))


### Trivial Changes

* **deps-dev:** bump aegir from 22.1.0 to 24.0.0 ([f71f236](https://github.com/ipfs/js-datastore-idb/commit/f71f2360427b7d334b346cc97e8e6b461696de55))
* **deps-dev:** bump aegir from 24.0.0 to 25.0.0 ([2479fe6](https://github.com/ipfs/js-datastore-idb/commit/2479fe628c871ab1db3e48b8acc12a302575a16c))
* Update .github/workflows/stale.yml [skip ci] ([c113be2](https://github.com/ipfs/js-datastore-idb/commit/c113be22c50bdbbef14a2c7c2fb265ee008d9562))
* update aegir ([5f00f1b](https://github.com/ipfs/js-datastore-idb/commit/5f00f1b8791b7e578275ed60f202417153311497))

<a name="1.1.0"></a>
# [1.1.0](https://github.com/ipfs/js-datastore-idb/compare/v1.0.2...v1.1.0) (2020-05-07)


### Features

* add streaming/cancellable API ([6d32b7f](https://github.com/ipfs/js-datastore-idb/commit/6d32b7f))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/ipfs/js-datastore-idb/compare/v1.0.1...v1.0.2) (2020-04-24)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/ipfs/js-datastore-idb/compare/v1.0.0...v1.0.1) (2020-04-23)


### Bug Fixes

* add bundle size config ([1fef7be](https://github.com/ipfs/js-datastore-idb/commit/1fef7be))
* protect open and close ([0695ad6](https://github.com/ipfs/js-datastore-idb/commit/0695ad6))



<a name="1.0.0"></a>
# 1.0.0 (2020-04-08)


### Bug Fixes

* add guard for un open db ([d06332d](https://github.com/ipfs/js-datastore-idb/commit/d06332d))
* add options ([2074f00](https://github.com/ipfs/js-datastore-idb/commit/2074f00))
* benchmarks and perf tweaks ([71d6804](https://github.com/ipfs/js-datastore-idb/commit/71d6804))
* skip node tests ([d8fd6e8](https://github.com/ipfs/js-datastore-idb/commit/d8fd6e8))
* syntax tweaks ([7906f08](https://github.com/ipfs/js-datastore-idb/commit/7906f08))


### Features

* idb datastore ([336c7e7](https://github.com/ipfs/js-datastore-idb/commit/336c7e7))
* improve query by a lot ([2ba5203](https://github.com/ipfs/js-datastore-idb/commit/2ba5203))



<a name="0.14.1"></a>
## [0.14.1](https://github.com/ipfs/js-datastore-level/compare/v0.14.0...v0.14.1) (2020-01-14)


### Bug Fixes

* leveldb iterator memory leak ([#26](https://github.com/ipfs/js-datastore-level/issues/26)) ([e503c1a](https://github.com/ipfs/js-datastore-level/commit/e503c1a)), closes [/github.com/Level/leveldown/blob/d3453fbde4d2a8aa04d9091101c25c999649069b/binding.cc#L545](https://github.com//github.com/Level/leveldown/blob/d3453fbde4d2a8aa04d9091101c25c999649069b/binding.cc/issues/L545)


### Performance Improvements

* optimize prefix search ([#25](https://github.com/ipfs/js-datastore-level/issues/25)) ([8efa812](https://github.com/ipfs/js-datastore-level/commit/8efa812))



<a name="0.14.0"></a>
# [0.14.0](https://github.com/ipfs/js-datastore-level/compare/v0.13.0...v0.14.0) (2019-11-29)



<a name="0.13.0"></a>
# [0.13.0](https://github.com/ipfs/js-datastore-level/compare/v0.12.1...v0.13.0) (2019-11-29)


### Bug Fixes

* init db in overridable method for easier extending ([#21](https://github.com/ipfs/js-datastore-level/issues/21)) ([b21428c](https://github.com/ipfs/js-datastore-level/commit/b21428c))



<a name="0.12.1"></a>
## [0.12.1](https://github.com/ipfs/js-datastore-level/compare/v0.12.0...v0.12.1) (2019-06-26)


### Bug Fixes

* swap leveldown/level.js for level ([#20](https://github.com/ipfs/js-datastore-level/issues/20)) ([d16e212](https://github.com/ipfs/js-datastore-level/commit/d16e212))



<a name="0.12.0"></a>
# [0.12.0](https://github.com/ipfs/js-datastore-level/compare/v0.11.0...v0.12.0) (2019-05-29)


### Bug Fixes

* remove unused var ([74d4a36](https://github.com/ipfs/js-datastore-level/commit/74d4a36))
* tests ([601599d](https://github.com/ipfs/js-datastore-level/commit/601599d))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/ipfs/js-datastore-level/compare/v0.10.0...v0.11.0) (2019-04-29)



<a name="0.10.0"></a>
# [0.10.0](https://github.com/ipfs/js-datastore-level/compare/v0.9.0...v0.10.0) (2018-10-24)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/ipfs/js-datastore-level/compare/v0.8.0...v0.9.0) (2018-09-19)


### Features

* add basic error codes ([02a5146](https://github.com/ipfs/js-datastore-level/commit/02a5146))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/ipfs/js-datastore-level/compare/v0.7.0...v0.8.0) (2018-05-29)


### Bug Fixes

* add test and fix constructor ([396f657](https://github.com/ipfs/js-datastore-level/commit/396f657))
* update binary encoding for levelup 2 ([a5d7378](https://github.com/ipfs/js-datastore-level/commit/a5d7378))
* upgrade level libs to resolve node 10 failure ([a427eca](https://github.com/ipfs/js-datastore-level/commit/a427eca))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/ipfs/js-datastore-level/compare/v0.6.0...v0.7.0) (2017-11-06)


### Bug Fixes

* Windows interop ([#4](https://github.com/ipfs/js-datastore-level/issues/4)) ([5d67042](https://github.com/ipfs/js-datastore-level/commit/5d67042))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/ipfs/js-datastore-level/compare/v0.5.0...v0.6.0) (2017-07-23)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/ipfs/js-datastore-level/compare/v0.4.2...v0.5.0) (2017-07-22)



<a name="0.4.2"></a>
## [0.4.2](https://github.com/ipfs/js-datastore-level/compare/v0.4.0...v0.4.2) (2017-05-24)


### Bug Fixes

* Object.assign is now evil and no longer is behaving as spec says when Webpacked ([5e40f3b](https://github.com/ipfs/js-datastore-level/commit/5e40f3b))
* Object.assign is now evil and no longer is behaving as spec says when Webpacked ([c3f50ec](https://github.com/ipfs/js-datastore-level/commit/c3f50ec))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/ipfs/js-datastore-level/compare/v0.4.0...v0.4.1) (2017-05-24)


### Bug Fixes

* Object.assign is now evil and no longer is behaving as spec says when Webpacked ([077bbc1](https://github.com/ipfs/js-datastore-level/commit/077bbc1))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/ipfs/js-datastore-level/compare/v0.3.0...v0.4.0) (2017-05-23)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/ipfs/js-datastore-level/compare/v0.2.0...v0.3.0) (2017-03-23)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/ipfs/js-datastore-level/compare/v0.1.0...v0.2.0) (2017-03-23)


### Features

* add open method ([fd12c6b](https://github.com/ipfs/js-datastore-level/commit/fd12c6b))



<a name="0.1.0"></a>
# 0.1.0 (2017-03-15)


### Bug Fixes

* key handling ([682f8b3](https://github.com/ipfs/js-datastore-level/commit/682f8b3))
* working interop with go ([f5e03c6](https://github.com/ipfs/js-datastore-level/commit/f5e03c6))
