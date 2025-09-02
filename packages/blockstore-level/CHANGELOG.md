## [blockstore-level-v2.0.5](https://github.com/ipfs/js-stores/compare/blockstore-level-2.0.4...blockstore-level-2.0.5) (2025-09-02)

### Bug Fixes

* readme typos ([e6b5653](https://github.com/ipfs/js-stores/commit/e6b56533b68e6ed9b90ca3e3f35af8577041a9a2))

### Dependencies

* bump race-signal from 1.1.3 to 2.0.0 ([#355](https://github.com/ipfs/js-stores/issues/355)) ([518fee8](https://github.com/ipfs/js-stores/commit/518fee89d3430534c0ec39551e920447fd558581))

## [blockstore-level-v2.0.4](https://github.com/ipfs/js-stores/compare/blockstore-level-2.0.3...blockstore-level-2.0.4) (2025-09-02)

### Bug Fixes

* deprecate blockstore-level and datastore-fs ([#353](https://github.com/ipfs/js-stores/issues/353)) ([ebc7912](https://github.com/ipfs/js-stores/commit/ebc7912696d5bd9dc991ece5f0c0d4acfb1f9400))

## [blockstore-level-v2.0.3](https://github.com/ipfs/js-stores/compare/blockstore-level-2.0.2...blockstore-level-2.0.3) (2025-05-28)

### Bug Fixes

* improve abort signal support ([#350](https://github.com/ipfs/js-stores/issues/350)) ([e17d770](https://github.com/ipfs/js-stores/commit/e17d770cc2fcee77cb0152a855abf162e5a91a99))

## [blockstore-level-v2.0.2](https://github.com/ipfs/js-stores/compare/blockstore-level-2.0.1...blockstore-level-2.0.2) (2025-05-26)

### Dependencies

* bump aegir from 44.1.4 to 47.0.16 ([#349](https://github.com/ipfs/js-stores/issues/349)) ([d33d15f](https://github.com/ipfs/js-stores/commit/d33d15f0638856530d0e1868c723e5567abf27e6))

## [blockstore-level-v2.0.1](https://github.com/ipfs/js-stores/compare/blockstore-level-2.0.0...blockstore-level-2.0.1) (2024-09-13)

### Bug Fixes

* restore release config to package.json ([#321](https://github.com/ipfs/js-stores/issues/321)) ([4f14fb0](https://github.com/ipfs/js-stores/commit/4f14fb09d65a3460b548b59557af108412dc9156))

### Dependencies

* **dev:** bump aegir from 42.2.11 to 44.1.0 ([#316](https://github.com/ipfs/js-stores/issues/316)) ([581a467](https://github.com/ipfs/js-stores/commit/581a46720832916bea11efa2476eb85a00bae9d4))

## blockstore-level [2.0.0](https://github.com/ipfs/js-stores/compare/blockstore-level-1.1.8...blockstore-level-2.0.0) (2024-08-02)


### ⚠ BREAKING CHANGES

* To detect the type of error thrown, use `.name` instead of `.code`

### Features

* use `.name` property for errors instead of `.code` ([#315](https://github.com/ipfs/js-stores/issues/315)) ([dacd6ce](https://github.com/ipfs/js-stores/commit/dacd6ce6f325262f1bc1451f20789e9e7cd9b9fd))



### Dependencies

* **blockstore-core:** upgraded to 5.0.0
* **interface-blockstore:** upgraded to 5.3.0
* **interface-store:** upgraded to 6.0.0
* **interface-blockstore-tests:** upgraded to 7.0.0

## blockstore-level [1.1.8](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.7...blockstore-level-1.1.8) (2024-02-12)


### Bug Fixes

* bump aegir to 42.2.3, update project config and fix deps ([#297](https://github.com/ipfs/js-stores/issues/297)) ([d521ef2](https://github.com/ipfs/js-stores/commit/d521ef251815527baee0a70705f775c0e47481ad))



### Dependencies

* **blockstore-core:** upgraded to 4.3.11
* **interface-blockstore:** upgraded to 5.2.10
* **interface-store:** upgraded to 5.1.8
* **interface-blockstore-tests:** upgraded to 6.1.10

## [blockstore-level-v1.1.7](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.6...blockstore-level-v1.1.7) (2023-12-30)


### Bug Fixes

* publish with limited concurrency ([85bcc4a](https://github.com/ipfs/js-stores/commit/85bcc4acc09d76d7938c55163c81d9b948c53803))
* readme update ([3bcfb6d](https://github.com/ipfs/js-stores/commit/3bcfb6d311d32a00f24c64cb55c3ba90ca495dba))


### Trivial Changes

* update sibling dependencies ([a4fb1c5](https://github.com/ipfs/js-stores/commit/a4fb1c5f97650d6ee80084e8c59c7a081f9a09e0))


### Dependencies

* bump multiformats from 12.1.3 to 13.0.0 ([#286](https://github.com/ipfs/js-stores/issues/286)) ([c8ccd1d](https://github.com/ipfs/js-stores/commit/c8ccd1de91883d1a1cbd394c21a51b021d52baa3))

## [blockstore-level-v1.1.7](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.6...blockstore-level-v1.1.7) (2023-12-28)


### Dependencies

* bump multiformats from 12.1.3 to 13.0.0 ([#286](https://github.com/ipfs/js-stores/issues/286)) ([c8ccd1d](https://github.com/ipfs/js-stores/commit/c8ccd1de91883d1a1cbd394c21a51b021d52baa3))

## [blockstore-level-v1.1.6](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.5...blockstore-level-v1.1.6) (2023-12-01)


### Bug Fixes

* cleanup references to datastore in blockstores ([#274](https://github.com/ipfs/js-stores/issues/274)) ([f550624](https://github.com/ipfs/js-stores/commit/f5506243b2cb1e6462457241a1614bd5f0755c12))

## [blockstore-level-v1.1.5](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.4...blockstore-level-v1.1.5) (2023-11-27)


### Documentation

* update datastore core readme and package config ([#245](https://github.com/ipfs/js-stores/issues/245)) ([c08d29a](https://github.com/ipfs/js-stores/commit/c08d29ab18ddea26a1d9dd73d673847469d28a13))


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [blockstore-level-v1.1.4](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.3...blockstore-level-v1.1.4) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [blockstore-level-v1.1.3](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.2...blockstore-level-v1.1.3) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [blockstore-level-v1.1.2](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.1...blockstore-level-v1.1.2) (2023-08-03)


### Dependencies

* bump multiformats from 11.0.2 to 12.0.1 ([#231](https://github.com/ipfs/js-stores/issues/231)) ([93b7c13](https://github.com/ipfs/js-stores/commit/93b7c13d0dd0508b04bae2ac5a9fb9c265fc5589))

## [blockstore-level-v1.1.1](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.1.0...blockstore-level-v1.1.1) (2023-06-03)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [blockstore-level-v1.1.0](https://github.com/ipfs/js-stores/compare/blockstore-level-v1.0.1...blockstore-level-v1.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [1.0.1](https://github.com/ipfs/js-blockstore-level/compare/v1.0.0...v1.0.1) (2023-03-23)


### Dependencies

* update interface-store to 5.x.x ([#1](https://github.com/ipfs/js-blockstore-level/issues/1)) ([f4b7fb6](https://github.com/ipfs/js-blockstore-level/commit/f4b7fb697262f32c5997a4d2026ac383fde38db4))

## 1.0.0 (2023-03-14)


### Features

* initial import ([2f262c8](https://github.com/ipfs/js-blockstore-level/commit/2f262c8809d6b04184b6e8990bd77966fa458b87))


### Bug Fixes

* generate docs ([60002c4](https://github.com/ipfs/js-blockstore-level/commit/60002c48a0fd2de5898bebf97939aa841b67650b))
* update deps ([c6d8d39](https://github.com/ipfs/js-blockstore-level/commit/c6d8d39e587a7eaa404751ccef17b3cfdc1eb7e3))
