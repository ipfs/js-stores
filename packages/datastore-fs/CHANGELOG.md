## [datastore-fs-v10.0.6](https://github.com/ipfs/js-stores/compare/datastore-fs-10.0.5...datastore-fs-10.0.6) (2025-09-02)

### Bug Fixes

* readme typos ([e6b5653](https://github.com/ipfs/js-stores/commit/e6b56533b68e6ed9b90ca3e3f35af8577041a9a2))

### Dependencies

* bump race-signal from 1.1.3 to 2.0.0 ([#355](https://github.com/ipfs/js-stores/issues/355)) ([518fee8](https://github.com/ipfs/js-stores/commit/518fee89d3430534c0ec39551e920447fd558581))

## [datastore-fs-v10.0.5](https://github.com/ipfs/js-stores/compare/datastore-fs-10.0.4...datastore-fs-10.0.5) (2025-09-02)

### Bug Fixes

* deprecate blockstore-level and datastore-fs ([#353](https://github.com/ipfs/js-stores/issues/353)) ([ebc7912](https://github.com/ipfs/js-stores/commit/ebc7912696d5bd9dc991ece5f0c0d4acfb1f9400))

## [datastore-fs-v10.0.4](https://github.com/ipfs/js-stores/compare/datastore-fs-10.0.3...datastore-fs-10.0.4) (2025-05-28)

### Bug Fixes

* improve abort signal support ([#350](https://github.com/ipfs/js-stores/issues/350)) ([e17d770](https://github.com/ipfs/js-stores/commit/e17d770cc2fcee77cb0152a855abf162e5a91a99))

## [datastore-fs-v10.0.3](https://github.com/ipfs/js-stores/compare/datastore-fs-10.0.2...datastore-fs-10.0.3) (2025-05-26)

### Dependencies

* bump aegir from 44.1.4 to 47.0.16 ([#349](https://github.com/ipfs/js-stores/issues/349)) ([d33d15f](https://github.com/ipfs/js-stores/commit/d33d15f0638856530d0e1868c723e5567abf27e6))

## [datastore-fs-v10.0.2](https://github.com/ipfs/js-stores/compare/datastore-fs-10.0.1...datastore-fs-10.0.2) (2024-09-17)

### Tests

* add separate-thread concurrency test ([#305](https://github.com/ipfs/js-stores/issues/305)) ([5e3114e](https://github.com/ipfs/js-stores/commit/5e3114e0160ba8366067359f724c6e49807dfb21)), closes [#285](https://github.com/ipfs/js-stores/issues/285) [#284](https://github.com/ipfs/js-stores/issues/284)

## [datastore-fs-v10.0.1](https://github.com/ipfs/js-stores/compare/datastore-fs-10.0.0...datastore-fs-10.0.1) (2024-09-13)

### Bug Fixes

* restore release config to package.json ([#321](https://github.com/ipfs/js-stores/issues/321)) ([4f14fb0](https://github.com/ipfs/js-stores/commit/4f14fb09d65a3460b548b59557af108412dc9156))

### Dependencies

* **dev:** bump aegir from 42.2.11 to 44.1.0 ([#316](https://github.com/ipfs/js-stores/issues/316)) ([581a467](https://github.com/ipfs/js-stores/commit/581a46720832916bea11efa2476eb85a00bae9d4))

## datastore-fs [10.0.0](https://github.com/ipfs/js-stores/compare/datastore-fs-9.1.9...datastore-fs-10.0.0) (2024-08-02)


### ⚠ BREAKING CHANGES

* To detect the type of error thrown, use `.name` instead of `.code`

### Features

* use `.name` property for errors instead of `.code` ([#315](https://github.com/ipfs/js-stores/issues/315)) ([dacd6ce](https://github.com/ipfs/js-stores/commit/dacd6ce6f325262f1bc1451f20789e9e7cd9b9fd))



### Dependencies

* **datastore-core:** upgraded to 10.0.0
* **interface-datastore:** upgraded to 8.3.0
* **interface-store:** upgraded to 6.0.0
* **interface-datastore-tests:** upgraded to 6.0.0

## datastore-fs [9.1.9](https://github.com/ipfs/js-stores/compare/datastore-fs-9.1.8...datastore-fs-9.1.9) (2024-08-01)


### Dependencies

* bump it-glob from 2.0.7 to 3.0.1 ([#306](https://github.com/ipfs/js-stores/issues/306)) ([8f6313f](https://github.com/ipfs/js-stores/commit/8f6313f8a22cb537aeeac2a048aad644d3c9a7d2))

## datastore-fs [9.1.8](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.7...datastore-fs-9.1.8) (2024-02-12)


### Bug Fixes

* bump aegir to 42.2.3, update project config and fix deps ([#297](https://github.com/ipfs/js-stores/issues/297)) ([d521ef2](https://github.com/ipfs/js-stores/commit/d521ef251815527baee0a70705f775c0e47481ad))



### Dependencies

* **datastore-core:** upgraded to 9.2.8
* **interface-datastore:** upgraded to 8.2.11
* **interface-store:** upgraded to 5.1.8
* **interface-datastore-tests:** upgraded to 5.1.8

## [datastore-fs-v9.1.7](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.6...datastore-fs-v9.1.7) (2023-12-30)


### Bug Fixes

* publish with limited concurrency ([85bcc4a](https://github.com/ipfs/js-stores/commit/85bcc4acc09d76d7938c55163c81d9b948c53803))
* readme update ([3bcfb6d](https://github.com/ipfs/js-stores/commit/3bcfb6d311d32a00f24c64cb55c3ba90ca495dba))

## [datastore-fs-v9.1.6](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.5...datastore-fs-v9.1.6) (2023-11-27)


### Documentation

* update datastore core readme and package config ([#245](https://github.com/ipfs/js-stores/issues/245)) ([c08d29a](https://github.com/ipfs/js-stores/commit/c08d29ab18ddea26a1d9dd73d673847469d28a13))


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [datastore-fs-v9.1.5](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.4...datastore-fs-v9.1.5) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [datastore-fs-v9.1.4](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.3...datastore-fs-v9.1.4) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [datastore-fs-v9.1.3](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.2...datastore-fs-v9.1.3) (2023-07-27)


### Documentation

* fix capitalization in readme of datastore-fs. ([#232](https://github.com/ipfs/js-stores/issues/232)) ([01492bf](https://github.com/ipfs/js-stores/commit/01492bfc90ab3025ff81f098a9bb7e60475be196))

## [datastore-fs-v9.1.2](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.1...datastore-fs-v9.1.2) (2023-06-03)


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [datastore-fs-v9.1.1](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.1.0...datastore-fs-v9.1.1) (2023-03-31)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* update all it-* deps ([#213](https://github.com/ipfs/js-stores/issues/213)) ([e963497](https://github.com/ipfs/js-stores/commit/e963497fdb33e61e2fe702866abbd42fba648fee))

## [datastore-fs-v9.1.0](https://github.com/ipfs/js-stores/compare/datastore-fs-v9.0.1...datastore-fs-v9.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [9.0.1](https://github.com/ipfs/js-datastore-fs/compare/v9.0.0...v9.0.1) (2023-03-23)


### Dependencies

* update interface-store to 5.x.x ([#183](https://github.com/ipfs/js-datastore-fs/issues/183)) ([803df0b](https://github.com/ipfs/js-datastore-fs/commit/803df0bc96860352957fb06fee109a705124a273))

## [9.0.0](https://github.com/ipfs/js-datastore-fs/compare/v8.0.0...v9.0.0) (2023-03-14)


### ⚠ BREAKING CHANGES

* interface-datastore 8.x.x has removed the open and close methods as these are implementation specific

### Bug Fixes

* fix exports map ([4332006](https://github.com/ipfs/js-datastore-fs/commit/4332006aba3e8e67c80144b110cc81042ce07e03))


### Dependencies

* update interface-datastore to 8.x.x ([#180](https://github.com/ipfs/js-datastore-fs/issues/180)) ([2ef5f5c](https://github.com/ipfs/js-datastore-fs/commit/2ef5f5cf021b1876cb83c53bafebb5f153c77462))


### Trivial Changes

* update project config ([62adc6b](https://github.com/ipfs/js-datastore-fs/commit/62adc6b238e64c6040afb4887bf6999de42cde08))

## [8.0.0](https://github.com/ipfs/js-datastore-fs/compare/v7.0.0...v8.0.0) (2022-08-12)


### ⚠ BREAKING CHANGES

* this module used to be dual published as CJS/ESM, now it is just ESM

### Features

* publish module as ESM only ([#139](https://github.com/ipfs/js-datastore-fs/issues/139)) ([5896e57](https://github.com/ipfs/js-datastore-fs/commit/5896e57fbba4ed47e0ede2ae140f8e757c928148))


### Trivial Changes

* Update .github/workflows/stale.yml [skip ci] ([94f7d36](https://github.com/ipfs/js-datastore-fs/commit/94f7d369a9b3285d7be79e794f90fdcc1e80f704))

## [7.0.0](https://github.com/ipfs/js-datastore-fs/compare/v6.0.1...v7.0.0) (2022-01-19)


### ⚠ BREAKING CHANGES

* updates project config to use unified ci

### Trivial Changes

* switch to unified ci ([#113](https://github.com/ipfs/js-datastore-fs/issues/113)) ([5e306e2](https://github.com/ipfs/js-datastore-fs/commit/5e306e260727d6fdfdfbd75aae84ca48bb11592f))

## [6.0.1](https://github.com/ipfs/js-datastore-fs/compare/v6.0.0...v6.0.1) (2021-09-09)



# [6.0.0](https://github.com/ipfs/js-datastore-fs/compare/v5.0.2...v6.0.0) (2021-09-08)


### chore

* convert to esm ([#103](https://github.com/ipfs/js-datastore-fs/issues/103)) ([314d130](https://github.com/ipfs/js-datastore-fs/commit/314d13051665c42be8a4bcc51c19ce2d5dd45346))


### BREAKING CHANGES

* deep imports are no longer possible



## [5.0.2](https://github.com/ipfs/js-datastore-fs/compare/v5.0.1...v5.0.2) (2021-07-23)


### Features

* parallel block writes ([#97](https://github.com/ipfs/js-datastore-fs/issues/97)) ([ceb5cfd](https://github.com/ipfs/js-datastore-fs/commit/ceb5cfd98487147888623b587f1480660eb5722e))



## [5.0.1](https://github.com/ipfs/js-datastore-fs/compare/v5.0.0...v5.0.1) (2021-07-10)



# [5.0.0](https://github.com/ipfs/js-datastore-fs/compare/v4.0.1...v5.0.0) (2021-07-06)


### chore

* update deps ([79b185f](https://github.com/ipfs/js-datastore-fs/commit/79b185f05b1f2bd2e4e0f75c44dad375e6c5f2dc))


### BREAKING CHANGES

* uses new interface-datastore interfaces



## [4.0.1](https://github.com/ipfs/js-datastore-fs/compare/v4.0.0...v4.0.1) (2021-05-04)



# [4.0.0](https://github.com/ipfs/js-datastore-fs/compare/v3.0.2...v4.0.0) (2021-04-15)


### Features

* split .query into .query and .queryKeys ([#82](https://github.com/ipfs/js-datastore-fs/issues/82)) ([9f2a64b](https://github.com/ipfs/js-datastore-fs/commit/9f2a64be2714fc3ee3780f6f6a24a5c8424e157b))



## [3.0.2](https://github.com/ipfs/js-datastore-fs/compare/v3.0.1...v3.0.2) (2021-04-14)



## [3.0.1](https://github.com/ipfs/js-datastore-fs/compare/v3.0.0...v3.0.1) (2021-04-06)



# [3.0.0](https://github.com/ipfs/js-datastore-fs/compare/v2.0.2...v3.0.0) (2021-01-22)


### Features

* types ([#62](https://github.com/ipfs/js-datastore-fs/issues/62)) ([de519dd](https://github.com/ipfs/js-datastore-fs/commit/de519dd6b8c0b892e827fb2d26cde3239358eaf6))



## [2.0.2](https://github.com/ipfs/js-datastore-fs/compare/v2.0.1...v2.0.2) (2020-11-09)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/ipfs/js-datastore-fs/compare/v2.0.0...v2.0.1) (2020-08-15)


### Bug Fixes

* only remove extension from path when it is non-empty ([#47](https://github.com/ipfs/js-datastore-fs/issues/47)) ([9e3e042](https://github.com/ipfs/js-datastore-fs/commit/9e3e042))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ipfs/js-datastore-fs/compare/v1.1.0...v2.0.0) (2020-07-29)


### Bug Fixes

* remove node buffers ([#44](https://github.com/ipfs/js-datastore-fs/issues/44)) ([887b762](https://github.com/ipfs/js-datastore-fs/commit/887b762))


### BREAKING CHANGES

* only uses Uint8Arrays internally



<a name="1.1.0"></a>
# [1.1.0](https://github.com/ipfs/js-datastore-fs/compare/v1.0.0...v1.1.0) (2020-05-07)


### Bug Fixes

* **ci:** add empty commit to fix lint checks on master ([d3e2732](https://github.com/ipfs/js-datastore-fs/commit/d3e2732))


### Features

* add streaming/cancellable API ([#39](https://github.com/ipfs/js-datastore-fs/issues/39)) ([5232c1c](https://github.com/ipfs/js-datastore-fs/commit/5232c1c))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/ipfs/js-datastore-fs/compare/v0.9.1...v1.0.0) (2020-04-28)


### Bug Fixes

* linter ([ac7235d](https://github.com/ipfs/js-datastore-fs/commit/ac7235d))



<a name="0.9.1"></a>
## [0.9.1](https://github.com/ipfs/js-datastore-fs/compare/v0.9.0...v0.9.1) (2019-09-09)


### Bug Fixes

* handle concurrent writes on windows ([d5c8e4f](https://github.com/ipfs/js-datastore-fs/commit/d5c8e4f))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/ipfs/js-datastore-fs/compare/v0.8.0...v0.9.0) (2019-05-29)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/ipfs/js-datastore-fs/compare/v0.7.0...v0.8.0) (2019-01-24)


### Performance Improvements

* use fast-write-atomic instead of write-file-atomic ([bf677b4](https://github.com/ipfs/js-datastore-fs/commit/bf677b4))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/ipfs/js-datastore-fs/compare/v0.6.0...v0.7.0) (2018-10-25)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/ipfs/js-datastore-fs/compare/v0.5.0...v0.6.0) (2018-09-19)


### Features

* add basic error codes ([c0fb50b](https://github.com/ipfs/js-datastore-fs/commit/c0fb50b))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/ipfs/js-datastore-fs/compare/v0.4.2...v0.5.0) (2018-05-28)


### Bug Fixes

* add basic flowtype for glob to fix flow runner ([ef6c1f0](https://github.com/ipfs/js-datastore-fs/commit/ef6c1f0))
* prevent delete from sending multiple args in callback ([0940452](https://github.com/ipfs/js-datastore-fs/commit/0940452))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/ipfs/js-datastore-fs/compare/v0.4.1...v0.4.2) (2017-12-05)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/ipfs/js-datastore-fs/compare/v0.4.0...v0.4.1) (2017-11-06)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/ipfs/js-datastore-fs/compare/v0.3.0...v0.4.0) (2017-11-04)


### Bug Fixes

* exclude node_modules and include flow-typed ([#5](https://github.com/ipfs/js-datastore-fs/issues/5)) ([1507a6b](https://github.com/ipfs/js-datastore-fs/commit/1507a6b))
* Windows support ([#7](https://github.com/ipfs/js-datastore-fs/issues/7)) ([e7c8f25](https://github.com/ipfs/js-datastore-fs/commit/e7c8f25)), closes [#6](https://github.com/ipfs/js-datastore-fs/issues/6)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/ipfs/js-datastore-fs/compare/v0.2.0...v0.3.0) (2017-07-23)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/ipfs/js-datastore-fs/compare/v0.1.1...v0.2.0) (2017-03-23)


### Features

* add open method ([#2](https://github.com/ipfs/js-datastore-fs/issues/2)) ([99c7409](https://github.com/ipfs/js-datastore-fs/commit/99c7409))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/ipfs/js-datastore-fs/compare/v0.1.0...v0.1.1) (2017-03-17)


### Bug Fixes

* do not return values when not expected ([f9f1979](https://github.com/ipfs/js-datastore-fs/commit/f9f1979))



<a name="0.1.0"></a>
# 0.1.0 (2017-03-15)
