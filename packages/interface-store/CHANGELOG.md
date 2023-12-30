## [interface-store-v5.1.7](https://github.com/ipfs/js-stores/compare/interface-store-v5.1.6...interface-store-v5.1.7) (2023-12-30)


### Bug Fixes

* publish with limited concurrency ([85bcc4a](https://github.com/ipfs/js-stores/commit/85bcc4acc09d76d7938c55163c81d9b948c53803))

## [interface-store-v5.1.6](https://github.com/ipfs/js-stores/compare/interface-store-v5.1.5...interface-store-v5.1.6) (2023-12-30)


### Bug Fixes

* readme update ([3bcfb6d](https://github.com/ipfs/js-stores/commit/3bcfb6d311d32a00f24c64cb55c3ba90ca495dba))

## [interface-store-v5.1.5](https://github.com/ipfs/js-stores/compare/interface-store-v5.1.4...interface-store-v5.1.5) (2023-11-27)


### Documentation

* update datastore core readme and package config ([#245](https://github.com/ipfs/js-stores/issues/245)) ([c08d29a](https://github.com/ipfs/js-stores/commit/c08d29ab18ddea26a1d9dd73d673847469d28a13))


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [interface-store-v5.1.4](https://github.com/ipfs/js-stores/compare/interface-store-v5.1.3...interface-store-v5.1.4) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [interface-store-v5.1.3](https://github.com/ipfs/js-stores/compare/interface-store-v5.1.2...interface-store-v5.1.3) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [interface-store-v5.1.2](https://github.com/ipfs/js-stores/compare/interface-store-v5.1.1...interface-store-v5.1.2) (2023-06-07)


### Bug Fixes

* restore empty object default ([#228](https://github.com/ipfs/js-stores/issues/228)) ([f82d02c](https://github.com/ipfs/js-stores/commit/f82d02cc8742b595939b58e2eae0a86bb1cec6b1))

## [interface-store-v5.1.1](https://github.com/ipfs/js-stores/compare/interface-store-v5.1.0...interface-store-v5.1.1) (2023-06-03)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [interface-store-v5.1.0](https://github.com/ipfs/js-stores/compare/interface-store-v5.0.1...interface-store-v5.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [interface-store-v5.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v5.0.0...interface-store-v5.0.1) (2023-03-23)


### Bug Fixes

* return key from put and put many ([#196](https://github.com/ipfs/js-ipfs-interfaces/issues/196)) ([dfc4697](https://github.com/ipfs/js-ipfs-interfaces/commit/dfc4697868d23b3a62154ddda3ae0747e124e3e1))

## [interface-store-v5.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v4.1.0...interface-store-v5.0.0) (2023-03-23)


### ⚠ BREAKING CHANGES

* the output of store.getMany is now a stream of pairs

### Bug Fixes

* return stream of pairs from getmany ([#195](https://github.com/ipfs/js-ipfs-interfaces/issues/195)) ([252bced](https://github.com/ipfs/js-ipfs-interfaces/commit/252bced0ad3111711bd502e8d2a5932d6289e0f9))

## [interface-store-v4.1.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v4.0.0...interface-store-v4.1.0) (2023-03-15)


### Features

* allow extending store method options ([#193](https://github.com/ipfs/js-ipfs-interfaces/issues/193)) ([007e8ac](https://github.com/ipfs/js-ipfs-interfaces/commit/007e8ac83a43ec185368cfad57193f57ef700c45))

## [interface-store-v4.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v3.0.4...interface-store-v4.0.0) (2023-03-13)


### ⚠ BREAKING CHANGES

* open/close/batch/query methods have been removed from store interface, query/batch added to datastore, getAll added to blockstore

### Features

* simplify store interface, move query/batch to datastore, add getAll to blockstore ([#189](https://github.com/ipfs/js-ipfs-interfaces/issues/189)) ([0b8f1a0](https://github.com/ipfs/js-ipfs-interfaces/commit/0b8f1a0d7644b32395059db250b301d3d5f024cb))

## [interface-store-v3.0.4](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v3.0.3...interface-store-v3.0.4) (2023-01-30)


### Dependencies

* bump aegir from 37.12.1 to 38.1.0 ([#184](https://github.com/ipfs/js-ipfs-interfaces/issues/184)) ([c8ab418](https://github.com/ipfs/js-ipfs-interfaces/commit/c8ab418db835a6beefbb44c3ba9176779cebcd0d))

## [interface-store-v3.0.3](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v3.0.2...interface-store-v3.0.3) (2023-01-06)


### Trivial Changes

* remove lerna ([#183](https://github.com/ipfs/js-ipfs-interfaces/issues/183)) ([04e77ec](https://github.com/ipfs/js-ipfs-interfaces/commit/04e77ec37ca5857b6156dd211f07a61eddcf19b0))


### Documentation

* remove duplicate readme section ([851a110](https://github.com/ipfs/js-ipfs-interfaces/commit/851a11033140e7ae0996adeaf880d6554d12837c))

## [interface-store-v3.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v3.0.1...interface-store-v3.0.2) (2022-12-16)


### Documentation

* publish api docs ([#181](https://github.com/ipfs/js-ipfs-interfaces/issues/181)) ([64f8473](https://github.com/ipfs/js-ipfs-interfaces/commit/64f8473a1d646eda431972afb489ac81d23248fa))

## [interface-store-v3.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store-v3.0.0...interface-store-v3.0.1) (2022-10-12)


### Dependencies

* bump uint8arrays from 3.0.0 to 4.0.1 ([#175](https://github.com/ipfs/js-ipfs-interfaces/issues/175)) ([e8d5ea6](https://github.com/ipfs/js-ipfs-interfaces/commit/e8d5ea63feaaaf379890171f4660bfd8f1cfef5e))
* update sibling dependencies ([79100b3](https://github.com/ipfs/js-ipfs-interfaces/commit/79100b3fd4a7f88e18a09976e194e8461869b92f))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@2.0.1...interface-store@2.0.2) (2022-01-26)

**Note:** Version bump only for package interface-store





## [2.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@2.0.0...interface-store@2.0.1) (2021-09-08)

**Note:** Version bump only for package interface-store





# [2.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@1.0.2...interface-store@2.0.0) (2021-09-08)


### chore

* switch to ESM ([#39](https://github.com/ipfs/js-ipfs-interfaces/issues/39)) ([c04aa80](https://github.com/ipfs/js-ipfs-interfaces/commit/c04aa80d48a84b681962cae227dd2628e7d35cb5))


### BREAKING CHANGES

* deep requires/imports are no longer possible, moves adapters/in-memory impls etc to core packages





## [1.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@1.0.1...interface-store@1.0.2) (2021-09-02)


### Bug Fixes

* make tests more stable ([#38](https://github.com/ipfs/js-ipfs-interfaces/issues/38)) ([595de43](https://github.com/ipfs/js-ipfs-interfaces/commit/595de438cbb5bda7444bdd8c4ce561215855d190))





## [1.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@1.0.0...interface-store@1.0.1) (2021-08-20)

**Note:** Version bump only for package interface-store





# [1.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@0.1.1...interface-store@1.0.0) (2021-07-06)


### Features

* prep for v1 release ([b95a516](https://github.com/ipfs/js-ipfs-interfaces/commit/b95a51610738e8ce6b5e29e9769f19f98e525a94))





## [0.1.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@0.1.0...interface-store@0.1.1) (2021-06-30)

**Note:** Version bump only for package interface-store





# [0.1.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@0.0.3...interface-store@0.1.0) (2021-06-30)


### Features

* add unwrap method ([0c22c9f](https://github.com/ipfs/js-ipfs-interfaces/commit/0c22c9ff4fe12ac92e38bcfb6ced626077fdb0ed))





## [0.0.3](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@0.0.2...interface-store@0.0.3) (2021-06-28)

**Note:** Version bump only for package interface-store





## [0.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-store@0.0.1...interface-store@0.0.2) (2021-05-14)

**Note:** Version bump only for package interface-store





## 0.0.1 (2021-05-14)

**Note:** Version bump only for package interface-store
