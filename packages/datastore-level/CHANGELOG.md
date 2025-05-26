## [datastore-level-v11.0.2](https://github.com/ipfs/js-stores/compare/datastore-level-11.0.1...datastore-level-11.0.2) (2025-05-26)

### Dependencies

* bump aegir from 44.1.4 to 47.0.16 ([#349](https://github.com/ipfs/js-stores/issues/349)) ([d33d15f](https://github.com/ipfs/js-stores/commit/d33d15f0638856530d0e1868c723e5567abf27e6))

## [datastore-level-v11.0.1](https://github.com/ipfs/js-stores/compare/datastore-level-11.0.0...datastore-level-11.0.1) (2024-09-13)

### Bug Fixes

* restore release config to package.json ([#321](https://github.com/ipfs/js-stores/issues/321)) ([4f14fb0](https://github.com/ipfs/js-stores/commit/4f14fb09d65a3460b548b59557af108412dc9156))

### Dependencies

* **dev:** bump aegir from 42.2.11 to 44.1.0 ([#316](https://github.com/ipfs/js-stores/issues/316)) ([581a467](https://github.com/ipfs/js-stores/commit/581a46720832916bea11efa2476eb85a00bae9d4))

## datastore-level [11.0.0](https://github.com/ipfs/js-stores/compare/datastore-level-10.1.8...datastore-level-11.0.0) (2024-08-02)


### ⚠ BREAKING CHANGES

* To detect the type of error thrown, use `.name` instead of `.code`

### Features

* use `.name` property for errors instead of `.code` ([#315](https://github.com/ipfs/js-stores/issues/315)) ([dacd6ce](https://github.com/ipfs/js-stores/commit/dacd6ce6f325262f1bc1451f20789e9e7cd9b9fd))



### Dependencies

* **datastore-core:** upgraded to 10.0.0
* **interface-datastore:** upgraded to 8.3.0
* **interface-store:** upgraded to 6.0.0
* **interface-datastore-tests:** upgraded to 6.0.0

## datastore-level [10.1.8](https://github.com/ipfs/js-stores/compare/datastore-level-10.1.7...datastore-level-10.1.8) (2024-04-09)


### Bug Fixes

* throw read error on read error ([#304](https://github.com/ipfs/js-stores/issues/304)) ([f14c824](https://github.com/ipfs/js-stores/commit/f14c8249dfd7bbd1385bbf3513b2b3d5e0e6860c)), closes [#299](https://github.com/ipfs/js-stores/issues/299)

## datastore-level [10.1.7](https://github.com/ipfs/js-stores/compare/datastore-level-v10.1.6...datastore-level-10.1.7) (2024-02-12)


### Bug Fixes

* bump aegir to 42.2.3, update project config and fix deps ([#297](https://github.com/ipfs/js-stores/issues/297)) ([d521ef2](https://github.com/ipfs/js-stores/commit/d521ef251815527baee0a70705f775c0e47481ad))



### Dependencies

* **datastore-core:** upgraded to 9.2.8
* **interface-datastore:** upgraded to 8.2.11
* **interface-datastore-tests:** upgraded to 5.1.8

## [datastore-level-v10.1.6](https://github.com/ipfs/js-stores/compare/datastore-level-v10.1.5...datastore-level-v10.1.6) (2023-12-30)


### Bug Fixes

* publish with limited concurrency ([85bcc4a](https://github.com/ipfs/js-stores/commit/85bcc4acc09d76d7938c55163c81d9b948c53803))
* readme update ([3bcfb6d](https://github.com/ipfs/js-stores/commit/3bcfb6d311d32a00f24c64cb55c3ba90ca495dba))

## [datastore-level-v10.1.5](https://github.com/ipfs/js-stores/compare/datastore-level-v10.1.4...datastore-level-v10.1.5) (2023-11-27)


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [datastore-level-v10.1.4](https://github.com/ipfs/js-stores/compare/datastore-level-v10.1.3...datastore-level-v10.1.4) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [datastore-level-v10.1.3](https://github.com/ipfs/js-stores/compare/datastore-level-v10.1.2...datastore-level-v10.1.3) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [datastore-level-v10.1.2](https://github.com/ipfs/js-stores/compare/datastore-level-v10.1.1...datastore-level-v10.1.2) (2023-06-03)


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [datastore-level-v10.1.1](https://github.com/ipfs/js-stores/compare/datastore-level-v10.1.0...datastore-level-v10.1.1) (2023-03-31)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* update all it-* deps ([#213](https://github.com/ipfs/js-stores/issues/213)) ([e963497](https://github.com/ipfs/js-stores/commit/e963497fdb33e61e2fe702866abbd42fba648fee))

## [datastore-level-v10.1.0](https://github.com/ipfs/js-stores/compare/datastore-level-v10.0.2...datastore-level-v10.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [10.0.2](https://github.com/ipfs/js-datastore-level/compare/v10.0.1...v10.0.2) (2023-03-23)


### Dependencies

* update interface-store to 5.x.x ([#176](https://github.com/ipfs/js-datastore-level/issues/176)) ([2c89f37](https://github.com/ipfs/js-datastore-level/commit/2c89f371a03019d5e811bbd7893abb11fe0ea46f))

## [10.0.1](https://github.com/ipfs/js-datastore-level/compare/v10.0.0...v10.0.1) (2023-03-14)


### Bug Fixes

* update project config ([#173](https://github.com/ipfs/js-datastore-level/issues/173)) ([57a69c7](https://github.com/ipfs/js-datastore-level/commit/57a69c79324cecd5966000e65b4734997c183c17))

## [10.0.0](https://github.com/ipfs/js-datastore-level/compare/v9.0.4...v10.0.0) (2023-03-13)


### ⚠ BREAKING CHANGES

* this module now implements interface-datastore@8.x.x

### Dependencies

* update to interface-datastore 8.x.x ([#172](https://github.com/ipfs/js-datastore-level/issues/172)) ([178d235](https://github.com/ipfs/js-datastore-level/commit/178d235254805f2abdd919e0860bd86af5b48582))

## [9.0.4](https://github.com/ipfs/js-datastore-level/compare/v9.0.3...v9.0.4) (2022-11-03)


### Dependencies

* bump it-map from 1.0.6 to 2.0.0 ([#136](https://github.com/ipfs/js-datastore-level/issues/136)) ([049045a](https://github.com/ipfs/js-datastore-level/commit/049045a4aced05840ec7abce235f3e64c83d42bd))

## [9.0.3](https://github.com/ipfs/js-datastore-level/compare/v9.0.2...v9.0.3) (2022-11-03)


### Dependencies

* bump it-sort from 1.0.1 to 2.0.0 ([#137](https://github.com/ipfs/js-datastore-level/issues/137)) ([4ab7b70](https://github.com/ipfs/js-datastore-level/commit/4ab7b700642ad09548c3580129de9bb53270c33d))

## [9.0.2](https://github.com/ipfs/js-datastore-level/compare/v9.0.1...v9.0.2) (2022-11-03)


### Dependencies

* bump it-filter from 1.0.3 to 2.0.0 ([#138](https://github.com/ipfs/js-datastore-level/issues/138)) ([2b13ed0](https://github.com/ipfs/js-datastore-level/commit/2b13ed04723922093cd2a15fff0a04de15a59f69))
* bump it-take from 1.0.2 to 2.0.0 ([#139](https://github.com/ipfs/js-datastore-level/issues/139)) ([1052cdd](https://github.com/ipfs/js-datastore-level/commit/1052cdd68dbee91d2adfab578b04f741448b22ef))
* **dev:** bump @ipld/dag-cbor from 7.0.3 to 8.0.0 ([#142](https://github.com/ipfs/js-datastore-level/issues/142)) ([1180956](https://github.com/ipfs/js-datastore-level/commit/11809565db0b80ae307f8ce219402600f9ce5745))
* **dev:** bump multiformats from 9.9.0 to 10.0.2 ([#141](https://github.com/ipfs/js-datastore-level/issues/141)) ([8db833b](https://github.com/ipfs/js-datastore-level/commit/8db833bc97122334bb21bd3de6b52018b4c3e816))

## [9.0.1](https://github.com/ipfs/js-datastore-level/compare/v9.0.0...v9.0.1) (2022-08-14)


### Bug Fixes

* restore open options and support old level iterators ([#132](https://github.com/ipfs/js-datastore-level/issues/132)) ([78e4911](https://github.com/ipfs/js-datastore-level/commit/78e4911458371740f2c482c7b1907ec6c15d61d9))

## [9.0.0](https://github.com/ipfs/js-datastore-level/compare/v8.0.0...v9.0.0) (2022-08-12)


### ⚠ BREAKING CHANGES

* this module used to be published as ESM/CJS now it is just ESM

### Features

* publish as ESM only ([#131](https://github.com/ipfs/js-datastore-level/issues/131)) ([0d3b6ab](https://github.com/ipfs/js-datastore-level/commit/0d3b6ab61b23c20587059b01e5446d9638fb569b))


### Trivial Changes

* Update .github/workflows/stale.yml [skip ci] ([f5b456e](https://github.com/ipfs/js-datastore-level/commit/f5b456e022d2b00edad0d913bbcc517ce0b90218))

## [8.0.0](https://github.com/ipfs/js-datastore-level/compare/v7.0.1...v8.0.0) (2022-01-19)


### ⚠ BREAKING CHANGES

* updates project config to use unified ci

### Trivial Changes

* switch to unified ci ([#99](https://github.com/ipfs/js-datastore-level/issues/99)) ([8344486](https://github.com/ipfs/js-datastore-level/commit/8344486d6971e0b2f49ceaa6dbc63f6469e8ed12))

## [7.0.1](https://github.com/ipfs/js-datastore-level/compare/v7.0.0...v7.0.1) (2021-09-09)



# [7.0.0](https://github.com/ipfs/js-datastore-level/compare/v6.0.2...v7.0.0) (2021-09-08)


### chore

* switch to ESM ([#87](https://github.com/ipfs/js-datastore-level/issues/87)) ([798e995](https://github.com/ipfs/js-datastore-level/commit/798e9958967c2fc279110eebe75e78523560f903))


### BREAKING CHANGES

* deep imports/requires are no longer possible



## [6.0.2](https://github.com/ipfs/js-datastore-level/compare/v6.0.1...v6.0.2) (2021-07-30)


### Features

* add level options ([#82](https://github.com/ipfs/js-datastore-level/issues/82)) ([1a3e060](https://github.com/ipfs/js-datastore-level/commit/1a3e060d12bcebc8b5bdc8123d03b23bbc13de59))



## [6.0.1](https://github.com/ipfs/js-datastore-level/compare/v6.0.0...v6.0.1) (2021-07-10)



# [6.0.0](https://github.com/ipfs/js-datastore-level/compare/v5.0.1...v6.0.0) (2021-07-06)


### chore

* update deps ([7e20056](https://github.com/ipfs/js-datastore-level/commit/7e20056b13db55e74c5fde986ec9afe186bba414))


### BREAKING CHANGES

* uses new interface-datastore interfaces



## [5.0.1](https://github.com/ipfs/js-datastore-level/compare/v5.0.0...v5.0.1) (2021-04-19)



# [5.0.0](https://github.com/ipfs/js-datastore-level/compare/v4.0.0...v5.0.0) (2021-04-15)


### Features

* split .query into .query and .queryKeys ([#70](https://github.com/ipfs/js-datastore-level/issues/70)) ([39ba735](https://github.com/ipfs/js-datastore-level/commit/39ba735c591524270740b49bfaa09fa4bcbb11d0))



# [4.0.0](https://github.com/ipfs/js-datastore-level/compare/v3.0.0...v4.0.0) (2021-01-29)


### chore

* **deps:** bump level from 5.0.1 to 6.0.1 ([#31](https://github.com/ipfs/js-datastore-level/issues/31)) ([06853bd](https://github.com/ipfs/js-datastore-level/commit/06853bd389f1f0c8cd00d12219040a903ed48633))


### BREAKING CHANGES

* **deps:** requires an upgrade to existing datastores created in the browser with level-js@4 or below



# [3.0.0](https://github.com/ipfs/js-datastore-level/compare/v2.0.0...v3.0.0) (2021-01-22)


### Bug Fixes

* fix constructor ([#58](https://github.com/ipfs/js-datastore-level/issues/58)) ([621e425](https://github.com/ipfs/js-datastore-level/commit/621e42569d8c31c3d2b7311a8abd2594fa6621bd))


### Features

* types ([#53](https://github.com/ipfs/js-datastore-level/issues/53)) ([51cd55e](https://github.com/ipfs/js-datastore-level/commit/51cd55e34aa5139dd9dfdb8966df5283e3c5a324))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ipfs/js-datastore-level/compare/v1.1.0...v2.0.0) (2020-07-29)


### Bug Fixes

* remove node buffers ([#39](https://github.com/ipfs/js-datastore-level/issues/39)) ([19fe886](https://github.com/ipfs/js-datastore-level/commit/19fe886))


### BREAKING CHANGES

* remove node buffers in favour of Uint8Arrays



<a name="1.1.0"></a>
# [1.1.0](https://github.com/ipfs/js-datastore-level/compare/v1.0.0...v1.1.0) (2020-05-07)


### Bug Fixes

* **ci:** add empty commit to fix lint checks on master ([60d14c0](https://github.com/ipfs/js-datastore-level/commit/60d14c0))


### Features

* add streaming/cancellable API ([#34](https://github.com/ipfs/js-datastore-level/issues/34)) ([6bfb51a](https://github.com/ipfs/js-datastore-level/commit/6bfb51a))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/ipfs/js-datastore-level/compare/v0.14.1...v1.0.0) (2020-04-28)



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
