## [interface-blockstore-v5.2.7](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.2.6...interface-blockstore-v5.2.7) (2023-11-27)


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [interface-blockstore-v5.2.6](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.2.5...interface-blockstore-v5.2.6) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [interface-blockstore-v5.2.5](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.2.4...interface-blockstore-v5.2.5) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [interface-blockstore-v5.2.4](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.2.3...interface-blockstore-v5.2.4) (2023-08-03)


### Dependencies

* bump multiformats from 11.0.2 to 12.0.1 ([#231](https://github.com/ipfs/js-stores/issues/231)) ([93b7c13](https://github.com/ipfs/js-stores/commit/93b7c13d0dd0508b04bae2ac5a9fb9c265fc5589))

## [interface-blockstore-v5.2.3](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.2.2...interface-blockstore-v5.2.3) (2023-06-07)


### Bug Fixes

* restore empty object default ([#228](https://github.com/ipfs/js-stores/issues/228)) ([f82d02c](https://github.com/ipfs/js-stores/commit/f82d02cc8742b595939b58e2eae0a86bb1cec6b1))

## [interface-blockstore-v5.2.2](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.2.1...interface-blockstore-v5.2.2) (2023-06-03)


### Documentation

* Update Blockstore and Datastore implementation lists ([#224](https://github.com/ipfs/js-stores/issues/224)) ([ab3b31b](https://github.com/ipfs/js-stores/commit/ab3b31b5ae2dba4b5ddb4b79740afb7c003aedae))

## [interface-blockstore-v5.2.1](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.2.0...interface-blockstore-v5.2.1) (2023-06-03)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [interface-blockstore-v5.2.0](https://github.com/ipfs/js-stores/compare/interface-blockstore-v5.1.1...interface-blockstore-v5.2.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [interface-blockstore-v5.1.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-v5.1.0...interface-blockstore-v5.1.1) (2023-03-23)


### Dependencies

* update sibling dependencies ([7c84601](https://github.com/ipfs/js-ipfs-interfaces/commit/7c84601df3a17b5e163de68b224c0efef5d5b746))

## [interface-blockstore-v5.1.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-v5.0.0...interface-blockstore-v5.1.0) (2023-03-15)


### Features

* allow extending store method options ([#193](https://github.com/ipfs/js-ipfs-interfaces/issues/193)) ([007e8ac](https://github.com/ipfs/js-ipfs-interfaces/commit/007e8ac83a43ec185368cfad57193f57ef700c45))

## [interface-blockstore-v5.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-v4.0.1...interface-blockstore-v5.0.0) (2023-03-13)


### ⚠ BREAKING CHANGES

* open/close/batch/query methods have been removed from store interface, query/batch added to datastore, getAll added to blockstore

### Features

* simplify store interface, move query/batch to datastore, add getAll to blockstore ([#189](https://github.com/ipfs/js-ipfs-interfaces/issues/189)) ([0b8f1a0](https://github.com/ipfs/js-ipfs-interfaces/commit/0b8f1a0d7644b32395059db250b301d3d5f024cb))


### Dependencies

* update sibling dependencies ([8f7928c](https://github.com/ipfs/js-ipfs-interfaces/commit/8f7928c28b5869001728cc997f0204a40f51978d))

## [interface-blockstore-v4.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-v4.0.0...interface-blockstore-v4.0.1) (2023-01-30)


### Dependencies

* bump aegir from 37.12.1 to 38.1.0 ([#184](https://github.com/ipfs/js-ipfs-interfaces/issues/184)) ([c8ab418](https://github.com/ipfs/js-ipfs-interfaces/commit/c8ab418db835a6beefbb44c3ba9176779cebcd0d))

## [interface-blockstore-v4.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-v3.0.2...interface-blockstore-v4.0.0) (2023-01-06)


### ⚠ BREAKING CHANGES

* bump multiformats from 10.0.3 to 11.0.0 (#182)

### Trivial Changes

* remove lerna ([#183](https://github.com/ipfs/js-ipfs-interfaces/issues/183)) ([04e77ec](https://github.com/ipfs/js-ipfs-interfaces/commit/04e77ec37ca5857b6156dd211f07a61eddcf19b0))


### Dependencies

* bump multiformats from 10.0.3 to 11.0.0 ([#182](https://github.com/ipfs/js-ipfs-interfaces/issues/182)) ([2342b17](https://github.com/ipfs/js-ipfs-interfaces/commit/2342b170dd69b1e055c6eda07cdd4e07ed1f9a4c)), closes [#234](https://github.com/ipfs/js-ipfs-interfaces/issues/234) [#226](https://github.com/ipfs/js-ipfs-interfaces/issues/226) [#234](https://github.com/ipfs/js-ipfs-interfaces/issues/234) [#226](https://github.com/ipfs/js-ipfs-interfaces/issues/226) [#226](https://github.com/ipfs/js-ipfs-interfaces/issues/226)


### Documentation

* remove duplicate readme section ([851a110](https://github.com/ipfs/js-ipfs-interfaces/commit/851a11033140e7ae0996adeaf880d6554d12837c))

## [interface-blockstore-v3.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-v3.0.1...interface-blockstore-v3.0.2) (2022-12-16)


### Documentation

* publish api docs ([#181](https://github.com/ipfs/js-ipfs-interfaces/issues/181)) ([64f8473](https://github.com/ipfs/js-ipfs-interfaces/commit/64f8473a1d646eda431972afb489ac81d23248fa))

## [interface-blockstore-v3.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-v3.0.0...interface-blockstore-v3.0.1) (2022-10-12)


### Dependencies

* bump multiformats from 9.9.0 to 10.0.0 ([#174](https://github.com/ipfs/js-ipfs-interfaces/issues/174)) ([2a4f529](https://github.com/ipfs/js-ipfs-interfaces/commit/2a4f529e4a4087fb048b337fbaeedffb939f2ebd))
* bump uint8arrays from 3.0.0 to 4.0.1 ([#175](https://github.com/ipfs/js-ipfs-interfaces/issues/175)) ([e8d5ea6](https://github.com/ipfs/js-ipfs-interfaces/commit/e8d5ea63feaaaf379890171f4660bfd8f1cfef5e))
* update sibling dependencies ([9aedadd](https://github.com/ipfs/js-ipfs-interfaces/commit/9aedadd99b72768124ef4b7f3640f0b6527e55ca))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.3](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@2.0.2...interface-blockstore@2.0.3) (2022-01-26)

**Note:** Version bump only for package interface-blockstore





## [2.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@2.0.1...interface-blockstore@2.0.2) (2021-09-08)

**Note:** Version bump only for package interface-blockstore





## [2.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@2.0.0...interface-blockstore@2.0.1) (2021-09-08)

**Note:** Version bump only for package interface-blockstore





# [2.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@1.0.2...interface-blockstore@2.0.0) (2021-09-08)


### chore

* switch to ESM ([#39](https://github.com/ipfs/js-ipfs-interfaces/issues/39)) ([c04aa80](https://github.com/ipfs/js-ipfs-interfaces/commit/c04aa80d48a84b681962cae227dd2628e7d35cb5))


### BREAKING CHANGES

* deep requires/imports are no longer possible, moves adapters/in-memory impls etc to core packages





## [1.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@1.0.1...interface-blockstore@1.0.2) (2021-09-02)


### Bug Fixes

* make tests more stable ([#38](https://github.com/ipfs/js-ipfs-interfaces/issues/38)) ([595de43](https://github.com/ipfs/js-ipfs-interfaces/commit/595de438cbb5bda7444bdd8c4ce561215855d190))





## [1.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@1.0.0...interface-blockstore@1.0.1) (2021-08-20)

**Note:** Version bump only for package interface-blockstore





# [1.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.2.1...interface-blockstore@1.0.0) (2021-07-06)


### Features

* prep for v1 release ([b95a516](https://github.com/ipfs/js-ipfs-interfaces/commit/b95a51610738e8ce6b5e29e9769f19f98e525a94))





## [0.2.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.2.0...interface-blockstore@0.2.1) (2021-06-30)

**Note:** Version bump only for package interface-blockstore





# [0.2.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.1.1...interface-blockstore@0.2.0) (2021-06-30)


### Features

* add unwrap method ([0c22c9f](https://github.com/ipfs/js-ipfs-interfaces/commit/0c22c9ff4fe12ac92e38bcfb6ced626077fdb0ed))





## [0.1.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.1.0...interface-blockstore@0.1.1) (2021-06-28)

**Note:** Version bump only for package interface-blockstore





# [0.1.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.0.5...interface-blockstore@0.1.0) (2021-06-25)


### Features

* add in-memory blockstore implementation ([#1](https://github.com/ipfs/js-ipfs-interfaces/issues/1)) ([ab37d40](https://github.com/ipfs/js-ipfs-interfaces/commit/ab37d40c62875a976eb55054e0d604e237d5a8aa))





## [0.0.5](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.0.4...interface-blockstore@0.0.5) (2021-06-22)

**Note:** Version bump only for package interface-blockstore





## [0.0.4](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.0.3...interface-blockstore@0.0.4) (2021-05-15)

**Note:** Version bump only for package interface-blockstore





## [0.0.3](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.0.2...interface-blockstore@0.0.3) (2021-05-14)

**Note:** Version bump only for package interface-blockstore





## [0.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore@0.0.1...interface-blockstore@0.0.2) (2021-05-14)

**Note:** Version bump only for package interface-blockstore





## 0.0.1 (2021-05-14)

**Note:** Version bump only for package interface-blockstore
