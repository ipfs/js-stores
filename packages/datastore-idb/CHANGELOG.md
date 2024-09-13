## [datastore-idb-v3.0.1](https://github.com/ipfs/js-stores/compare/datastore-idb-3.0.0...datastore-idb-3.0.1) (2024-09-13)

### Bug Fixes

* restore release config to package.json ([#321](https://github.com/ipfs/js-stores/issues/321)) ([4f14fb0](https://github.com/ipfs/js-stores/commit/4f14fb09d65a3460b548b59557af108412dc9156))

### Dependencies

* **dev:** bump aegir from 42.2.11 to 44.1.0 ([#316](https://github.com/ipfs/js-stores/issues/316)) ([581a467](https://github.com/ipfs/js-stores/commit/581a46720832916bea11efa2476eb85a00bae9d4))

## datastore-idb [3.0.0](https://github.com/ipfs/js-stores/compare/datastore-idb-2.1.9...datastore-idb-3.0.0) (2024-08-02)


### ⚠ BREAKING CHANGES

* To detect the type of error thrown, use `.name` instead of `.code`

### Features

* use `.name` property for errors instead of `.code` ([#315](https://github.com/ipfs/js-stores/issues/315)) ([dacd6ce](https://github.com/ipfs/js-stores/commit/dacd6ce6f325262f1bc1451f20789e9e7cd9b9fd))



### Dependencies

* **datastore-core:** upgraded to 10.0.0
* **interface-datastore:** upgraded to 8.3.0
* **interface-store:** upgraded to 6.0.0
* **interface-datastore-tests:** upgraded to 6.0.0

## datastore-idb [2.1.9](https://github.com/ipfs/js-stores/compare/datastore-idb-2.1.8...datastore-idb-2.1.9) (2024-04-09)


### Bug Fixes

* throw read error on read error ([#304](https://github.com/ipfs/js-stores/issues/304)) ([f14c824](https://github.com/ipfs/js-stores/commit/f14c8249dfd7bbd1385bbf3513b2b3d5e0e6860c)), closes [#299](https://github.com/ipfs/js-stores/issues/299)

## datastore-idb [2.1.8](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.7...datastore-idb-2.1.8) (2024-02-12)


### Bug Fixes

* bump aegir to 42.2.3, update project config and fix deps ([#297](https://github.com/ipfs/js-stores/issues/297)) ([d521ef2](https://github.com/ipfs/js-stores/commit/d521ef251815527baee0a70705f775c0e47481ad))



### Dependencies

* **datastore-core:** upgraded to 9.2.8
* **interface-datastore:** upgraded to 8.2.11
* **interface-datastore-tests:** upgraded to 5.1.8

## [datastore-idb-v2.1.7](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.6...datastore-idb-v2.1.7) (2023-12-30)


### Bug Fixes

* publish with limited concurrency ([85bcc4a](https://github.com/ipfs/js-stores/commit/85bcc4acc09d76d7938c55163c81d9b948c53803))
* readme update ([3bcfb6d](https://github.com/ipfs/js-stores/commit/3bcfb6d311d32a00f24c64cb55c3ba90ca495dba))


### Trivial Changes

* update sibling dependencies ([a4fb1c5](https://github.com/ipfs/js-stores/commit/a4fb1c5f97650d6ee80084e8c59c7a081f9a09e0))


### Dependencies

* bump idb from 7.1.1 to 8.0.0 ([#281](https://github.com/ipfs/js-stores/issues/281)) ([4d0bdbc](https://github.com/ipfs/js-stores/commit/4d0bdbc600b226c489259e5100af5c8c7031fb79))

## [datastore-idb-v2.1.7](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.6...datastore-idb-v2.1.7) (2023-12-28)


### Dependencies

* bump idb from 7.1.1 to 8.0.0 ([#281](https://github.com/ipfs/js-stores/issues/281)) ([4d0bdbc](https://github.com/ipfs/js-stores/commit/4d0bdbc600b226c489259e5100af5c8c7031fb79))

## [datastore-idb-v2.1.6](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.5...datastore-idb-v2.1.6) (2023-12-01)


### Bug Fixes

* cleanup references to datastore in blockstores ([#274](https://github.com/ipfs/js-stores/issues/274)) ([f550624](https://github.com/ipfs/js-stores/commit/f5506243b2cb1e6462457241a1614bd5f0755c12))

## [datastore-idb-v2.1.5](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.4...datastore-idb-v2.1.5) (2023-11-27)


### Documentation

* update datastore core readme and package config ([#245](https://github.com/ipfs/js-stores/issues/245)) ([c08d29a](https://github.com/ipfs/js-stores/commit/c08d29ab18ddea26a1d9dd73d673847469d28a13))


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [datastore-idb-v2.1.4](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.3...datastore-idb-v2.1.4) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [datastore-idb-v2.1.3](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.2...datastore-idb-v2.1.3) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [datastore-idb-v2.1.2](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.1...datastore-idb-v2.1.2) (2023-06-03)


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [datastore-idb-v2.1.1](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.1.0...datastore-idb-v2.1.1) (2023-03-31)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* update all it-* deps ([#213](https://github.com/ipfs/js-stores/issues/213)) ([e963497](https://github.com/ipfs/js-stores/commit/e963497fdb33e61e2fe702866abbd42fba648fee))

## [datastore-idb-v2.1.0](https://github.com/ipfs/js-stores/compare/datastore-idb-v2.0.1...datastore-idb-v2.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

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
