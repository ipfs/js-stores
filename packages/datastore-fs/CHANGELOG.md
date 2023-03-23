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
