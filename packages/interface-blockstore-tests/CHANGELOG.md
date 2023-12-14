## [interface-blockstore-tests-v6.1.7](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.1.6...interface-blockstore-tests-v6.1.7) (2023-12-08)


### Dependencies

* bump uint8arrays from 4.0.10 to 5.0.0 ([#282](https://github.com/ipfs/js-stores/issues/282)) ([2cbfd52](https://github.com/ipfs/js-stores/commit/2cbfd52257e9358786962d94e144df9583a45c30))

## [interface-blockstore-tests-v6.1.6](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.1.5...interface-blockstore-tests-v6.1.6) (2023-11-27)


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [interface-blockstore-tests-v6.1.5](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.1.4...interface-blockstore-tests-v6.1.5) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [interface-blockstore-tests-v6.1.4](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.1.3...interface-blockstore-tests-v6.1.4) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [interface-blockstore-tests-v6.1.3](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.1.2...interface-blockstore-tests-v6.1.3) (2023-08-03)


### Dependencies

* bump multiformats from 11.0.2 to 12.0.1 ([#231](https://github.com/ipfs/js-stores/issues/231)) ([93b7c13](https://github.com/ipfs/js-stores/commit/93b7c13d0dd0508b04bae2ac5a9fb9c265fc5589))

## [interface-blockstore-tests-v6.1.2](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.1.1...interface-blockstore-tests-v6.1.2) (2023-06-03)


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [interface-blockstore-tests-v6.1.1](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.1.0...interface-blockstore-tests-v6.1.1) (2023-03-31)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* update all it-* deps ([#213](https://github.com/ipfs/js-stores/issues/213)) ([e963497](https://github.com/ipfs/js-stores/commit/e963497fdb33e61e2fe702866abbd42fba648fee))

## [interface-blockstore-tests-v6.1.0](https://github.com/ipfs/js-stores/compare/interface-blockstore-tests-v6.0.0...interface-blockstore-tests-v6.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [interface-blockstore-tests-v6.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v5.0.1...interface-blockstore-tests-v6.0.0) (2023-03-23)


### ⚠ BREAKING CHANGES

* the output of store.getMany is now a stream of pairs

### Bug Fixes

* return key from put and put many ([#196](https://github.com/ipfs/js-ipfs-interfaces/issues/196)) ([dfc4697](https://github.com/ipfs/js-ipfs-interfaces/commit/dfc4697868d23b3a62154ddda3ae0747e124e3e1))
* return stream of pairs from getmany ([#195](https://github.com/ipfs/js-ipfs-interfaces/issues/195)) ([252bced](https://github.com/ipfs/js-ipfs-interfaces/commit/252bced0ad3111711bd502e8d2a5932d6289e0f9))

## [interface-blockstore-tests-v5.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v5.0.0...interface-blockstore-tests-v5.0.1) (2023-03-14)


### Bug Fixes

* rename test from blocks to getMany ([#190](https://github.com/ipfs/js-ipfs-interfaces/issues/190)) ([60e6c3f](https://github.com/ipfs/js-ipfs-interfaces/commit/60e6c3f44596ff8fc7906f7d5fe86f8ebdf227d1))

## [interface-blockstore-tests-v5.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v4.0.2...interface-blockstore-tests-v5.0.0) (2023-03-13)


### ⚠ BREAKING CHANGES

* open/close/batch/query methods have been removed from store interface, query/batch added to datastore, getAll added to blockstore

### Features

* simplify store interface, move query/batch to datastore, add getAll to blockstore ([#189](https://github.com/ipfs/js-ipfs-interfaces/issues/189)) ([0b8f1a0](https://github.com/ipfs/js-ipfs-interfaces/commit/0b8f1a0d7644b32395059db250b301d3d5f024cb))


### Dependencies

* update sibling dependencies ([9adf0bc](https://github.com/ipfs/js-ipfs-interfaces/commit/9adf0bc4c1b63ef0ae06ab5cb2f3dc19d83bc1a7))

## [interface-blockstore-tests-v4.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v4.0.1...interface-blockstore-tests-v4.0.2) (2023-03-13)


### Bug Fixes

* open and close blockstore during interface tests ([#188](https://github.com/ipfs/js-ipfs-interfaces/issues/188)) ([a61a54b](https://github.com/ipfs/js-ipfs-interfaces/commit/a61a54ba53fa06800e91ea933924615fe6df5b01))

## [interface-blockstore-tests-v4.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v4.0.0...interface-blockstore-tests-v4.0.1) (2023-01-30)


### Dependencies

* bump aegir from 37.12.1 to 38.1.0 ([#184](https://github.com/ipfs/js-ipfs-interfaces/issues/184)) ([c8ab418](https://github.com/ipfs/js-ipfs-interfaces/commit/c8ab418db835a6beefbb44c3ba9176779cebcd0d))

## [interface-blockstore-tests-v4.0.0](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v3.0.3...interface-blockstore-tests-v4.0.0) (2023-01-06)


### ⚠ BREAKING CHANGES

* bump multiformats from 10.0.3 to 11.0.0 (#182)

### Documentation

* remove duplicate readme section ([851a110](https://github.com/ipfs/js-ipfs-interfaces/commit/851a11033140e7ae0996adeaf880d6554d12837c))


### Dependencies

* bump multiformats from 10.0.3 to 11.0.0 ([#182](https://github.com/ipfs/js-ipfs-interfaces/issues/182)) ([2342b17](https://github.com/ipfs/js-ipfs-interfaces/commit/2342b170dd69b1e055c6eda07cdd4e07ed1f9a4c)), closes [#234](https://github.com/ipfs/js-ipfs-interfaces/issues/234) [#226](https://github.com/ipfs/js-ipfs-interfaces/issues/226) [#234](https://github.com/ipfs/js-ipfs-interfaces/issues/234) [#226](https://github.com/ipfs/js-ipfs-interfaces/issues/226) [#226](https://github.com/ipfs/js-ipfs-interfaces/issues/226)
* update sibling dependencies ([bbfb89c](https://github.com/ipfs/js-ipfs-interfaces/commit/bbfb89cbae37e0442df774e4dab63399c1e76d15))

## [interface-blockstore-tests-v3.0.3](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v3.0.2...interface-blockstore-tests-v3.0.3) (2023-01-06)


### Dependencies

* bump it-all from 1.0.6 to 2.0.0 ([#177](https://github.com/ipfs/js-ipfs-interfaces/issues/177)) ([b648877](https://github.com/ipfs/js-ipfs-interfaces/commit/b648877c5afb625c7d1e13efd3e0f72d125de734)), closes [#28](https://github.com/ipfs/js-ipfs-interfaces/issues/28) [#28](https://github.com/ipfs/js-ipfs-interfaces/issues/28) [#27](https://github.com/ipfs/js-ipfs-interfaces/issues/27) [#24](https://github.com/ipfs/js-ipfs-interfaces/issues/24)
* bump it-drain from 1.0.5 to 2.0.0 ([#178](https://github.com/ipfs/js-ipfs-interfaces/issues/178)) ([73e4cfc](https://github.com/ipfs/js-ipfs-interfaces/commit/73e4cfcf41178fe6e27f0c7b431fb9511e1dda47)), closes [#28](https://github.com/ipfs/js-ipfs-interfaces/issues/28) [#28](https://github.com/ipfs/js-ipfs-interfaces/issues/28) [#27](https://github.com/ipfs/js-ipfs-interfaces/issues/27) [#24](https://github.com/ipfs/js-ipfs-interfaces/issues/24)
* bump it-length from 1.0.4 to 2.0.0 ([#179](https://github.com/ipfs/js-ipfs-interfaces/issues/179)) ([d1919b4](https://github.com/ipfs/js-ipfs-interfaces/commit/d1919b40f4ec7ec0a20e0283d063e8b030ddc875)), closes [#28](https://github.com/ipfs/js-ipfs-interfaces/issues/28)


### Trivial Changes

* remove lerna ([#183](https://github.com/ipfs/js-ipfs-interfaces/issues/183)) ([04e77ec](https://github.com/ipfs/js-ipfs-interfaces/commit/04e77ec37ca5857b6156dd211f07a61eddcf19b0))

## [interface-blockstore-tests-v3.0.2](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v3.0.1...interface-blockstore-tests-v3.0.2) (2022-12-16)


### Documentation

* publish api docs ([#181](https://github.com/ipfs/js-ipfs-interfaces/issues/181)) ([64f8473](https://github.com/ipfs/js-ipfs-interfaces/commit/64f8473a1d646eda431972afb489ac81d23248fa))

## [interface-blockstore-tests-v3.0.1](https://github.com/ipfs/js-ipfs-interfaces/compare/interface-blockstore-tests-v3.0.0...interface-blockstore-tests-v3.0.1) (2022-10-12)


### Dependencies

* bump multiformats from 9.9.0 to 10.0.0 ([#174](https://github.com/ipfs/js-ipfs-interfaces/issues/174)) ([2a4f529](https://github.com/ipfs/js-ipfs-interfaces/commit/2a4f529e4a4087fb048b337fbaeedffb939f2ebd))
* bump uint8arrays from 3.0.0 to 4.0.1 ([#175](https://github.com/ipfs/js-ipfs-interfaces/issues/175)) ([e8d5ea6](https://github.com/ipfs/js-ipfs-interfaces/commit/e8d5ea63feaaaf379890171f4660bfd8f1cfef5e))
* update sibling dependencies ([713c9a4](https://github.com/ipfs/js-ipfs-interfaces/commit/713c9a4bda345f488c273b3d55959fb47e9420ed))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.5](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@2.0.4...interface-blockstore-tests@2.0.5) (2022-06-22)


### Bug Fixes

* lower amount ([b7f9aab](https://github.com/ipfs/interface-blockstore/commit/b7f9aab399b026d34521aad5a9c3757baa60cb4d))





## [2.0.4](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@2.0.3...interface-blockstore-tests@2.0.4) (2022-06-22)


### Bug Fixes

* increase timeouts ([#131](https://github.com/ipfs/interface-blockstore/issues/131)) ([733c2ed](https://github.com/ipfs/interface-blockstore/commit/733c2edb32a3aa3a54c6cf2d39f780bd6018010b))





## [2.0.3](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@2.0.2...interface-blockstore-tests@2.0.3) (2022-01-26)

**Note:** Version bump only for package interface-blockstore-tests





## [2.0.2](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@2.0.1...interface-blockstore-tests@2.0.2) (2021-09-08)

**Note:** Version bump only for package interface-blockstore-tests





## [2.0.1](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@2.0.0...interface-blockstore-tests@2.0.1) (2021-09-08)

**Note:** Version bump only for package interface-blockstore-tests





# [2.0.0](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@1.0.3...interface-blockstore-tests@2.0.0) (2021-09-08)


### chore

* switch to ESM ([#39](https://github.com/ipfs/interface-blockstore/issues/39)) ([c04aa80](https://github.com/ipfs/interface-blockstore/commit/c04aa80d48a84b681962cae227dd2628e7d35cb5))


### BREAKING CHANGES

* deep requires/imports are no longer possible, moves adapters/in-memory impls etc to core packages





## [1.0.3](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@1.0.2...interface-blockstore-tests@1.0.3) (2021-09-02)

**Note:** Version bump only for package interface-blockstore-tests





## [1.0.2](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@1.0.1...interface-blockstore-tests@1.0.2) (2021-09-02)


### Bug Fixes

* make tests more stable ([#38](https://github.com/ipfs/interface-blockstore/issues/38)) ([595de43](https://github.com/ipfs/interface-blockstore/commit/595de438cbb5bda7444bdd8c4ce561215855d190))





## [1.0.1](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@1.0.0...interface-blockstore-tests@1.0.1) (2021-08-20)

**Note:** Version bump only for package interface-blockstore-tests





# [1.0.0](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@0.0.6...interface-blockstore-tests@1.0.0) (2021-07-06)


### Features

* prep for v1 release ([b95a516](https://github.com/ipfs/interface-blockstore/commit/b95a51610738e8ce6b5e29e9769f19f98e525a94))





## [0.0.6](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@0.0.5...interface-blockstore-tests@0.0.6) (2021-07-02)

**Note:** Version bump only for package interface-blockstore-tests





## [0.0.5](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@0.0.4...interface-blockstore-tests@0.0.5) (2021-06-30)

**Note:** Version bump only for package interface-blockstore-tests





## [0.0.4](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@0.0.3...interface-blockstore-tests@0.0.4) (2021-06-30)

**Note:** Version bump only for package interface-blockstore-tests





## [0.0.3](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@0.0.2...interface-blockstore-tests@0.0.3) (2021-06-29)

**Note:** Version bump only for package interface-blockstore-tests





## [0.0.2](https://github.com/ipfs/interface-blockstore/compare/interface-blockstore-tests@0.0.1...interface-blockstore-tests@0.0.2) (2021-06-28)

**Note:** Version bump only for package interface-blockstore-tests





## 0.0.1 (2021-06-28)

**Note:** Version bump only for package interface-blockstore-tests
