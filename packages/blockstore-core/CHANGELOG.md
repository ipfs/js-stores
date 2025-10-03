## [blockstore-core-v6.0.2](https://github.com/ipfs/js-stores/compare/blockstore-core-6.0.1...blockstore-core-6.0.2) (2025-10-03)

### Dependencies

* bump level from 8.0.1 to 10.0.0 ([#356](https://github.com/ipfs/js-stores/issues/356)) ([c0ec61f](https://github.com/ipfs/js-stores/commit/c0ec61fe965e3bad9d607a0bd3a3c750f00f41d0))

## [blockstore-core-v6.0.1](https://github.com/ipfs/js-stores/compare/blockstore-core-6.0.0...blockstore-core-6.0.1) (2025-10-03)

### Bug Fixes

* update sibling deps ([3f73b3d](https://github.com/ipfs/js-stores/commit/3f73b3d53ea2d86d0f5c3f06785c0bfc30e8b5e9))

## [blockstore-core-v6.0.0](https://github.com/ipfs/js-stores/compare/blockstore-core-5.0.4...blockstore-core-6.0.0) (2025-10-03)

### ⚠ BREAKING CHANGES

* blockstore.get and similar now return streams of bytes

### Features

* streaming blockstores ([#358](https://github.com/ipfs/js-stores/issues/358)) ([4dbb136](https://github.com/ipfs/js-stores/commit/4dbb1362d20fc87fcdd261568dca297972f9bc08))

### Dependencies

* bump @libp2p/logger ([#359](https://github.com/ipfs/js-stores/issues/359)) ([edb5a1f](https://github.com/ipfs/js-stores/commit/edb5a1f8b575a27ad28bc2e1c4e4d52e1f114ebc))

## [blockstore-core-v5.0.4](https://github.com/ipfs/js-stores/compare/blockstore-core-5.0.3...blockstore-core-5.0.4) (2025-05-28)

### Bug Fixes

* improve abort signal support ([#350](https://github.com/ipfs/js-stores/issues/350)) ([e17d770](https://github.com/ipfs/js-stores/commit/e17d770cc2fcee77cb0152a855abf162e5a91a99))

## [blockstore-core-v5.0.3](https://github.com/ipfs/js-stores/compare/blockstore-core-5.0.2...blockstore-core-5.0.3) (2025-05-26)

### Dependencies

* bump aegir from 44.1.4 to 47.0.16 ([#349](https://github.com/ipfs/js-stores/issues/349)) ([d33d15f](https://github.com/ipfs/js-stores/commit/d33d15f0638856530d0e1868c723e5567abf27e6))

## [blockstore-core-v5.0.2](https://github.com/ipfs/js-stores/compare/blockstore-core-5.0.1...blockstore-core-5.0.2) (2024-09-13)

### Bug Fixes

* restore release config to package.json ([#321](https://github.com/ipfs/js-stores/issues/321)) ([4f14fb0](https://github.com/ipfs/js-stores/commit/4f14fb09d65a3460b548b59557af108412dc9156))

## blockstore-core [5.0.0](https://github.com/ipfs/js-stores/compare/blockstore-core-4.4.1...blockstore-core-5.0.0) (2024-08-02)


### ⚠ BREAKING CHANGES

* To detect the type of error thrown, use `.name` instead of `.code`

### Features

* use `.name` property for errors instead of `.code` ([#315](https://github.com/ipfs/js-stores/issues/315)) ([dacd6ce](https://github.com/ipfs/js-stores/commit/dacd6ce6f325262f1bc1451f20789e9e7cd9b9fd))



### Dependencies

* **interface-blockstore:** upgraded to 5.3.0
* **interface-store:** upgraded to 6.0.0
* **interface-blockstore-tests:** upgraded to 7.0.0

## blockstore-core [4.4.1](https://github.com/ipfs/js-stores/compare/blockstore-core-4.4.0...blockstore-core-4.4.1) (2024-04-09)


### Bug Fixes

* identity blockstore should wrap child ([#303](https://github.com/ipfs/js-stores/issues/303)) ([3d84dd0](https://github.com/ipfs/js-stores/commit/3d84dd0ab164fb5749c34487a217c763d1d09ccb))

## blockstore-core [4.4.0](https://github.com/ipfs/js-stores/compare/blockstore-core-4.3.11...blockstore-core-4.4.0) (2024-02-12)


### Features

* add identity blockstore ([#298](https://github.com/ipfs/js-stores/issues/298)) ([b8dce49](https://github.com/ipfs/js-stores/commit/b8dce49fc005a76b86bca751b7d703d321cd12d6))

## blockstore-core [4.3.11](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.10...blockstore-core-4.3.11) (2024-02-12)


### Bug Fixes

* bump aegir to 42.2.3, update project config and fix deps ([#297](https://github.com/ipfs/js-stores/issues/297)) ([d521ef2](https://github.com/ipfs/js-stores/commit/d521ef251815527baee0a70705f775c0e47481ad))



### Dependencies

* **interface-blockstore:** upgraded to 5.2.10
* **interface-store:** upgraded to 5.1.8
* **interface-blockstore-tests:** upgraded to 6.1.10

## [blockstore-core-v4.3.10](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.9...blockstore-core-v4.3.10) (2023-12-30)


### Bug Fixes

* publish with limited concurrency ([85bcc4a](https://github.com/ipfs/js-stores/commit/85bcc4acc09d76d7938c55163c81d9b948c53803))
* readme update ([3bcfb6d](https://github.com/ipfs/js-stores/commit/3bcfb6d311d32a00f24c64cb55c3ba90ca495dba))

## [blockstore-core-v4.3.9](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.8...blockstore-core-v4.3.9) (2023-12-28)


### Dependencies

* bump multiformats from 12.1.3 to 13.0.0 ([#286](https://github.com/ipfs/js-stores/issues/286)) ([c8ccd1d](https://github.com/ipfs/js-stores/commit/c8ccd1de91883d1a1cbd394c21a51b021d52baa3))

## [blockstore-core-v4.3.8](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.7...blockstore-core-v4.3.8) (2023-12-08)


### Dependencies

* bump uint8arrays from 4.0.10 to 5.0.0 ([#282](https://github.com/ipfs/js-stores/issues/282)) ([2cbfd52](https://github.com/ipfs/js-stores/commit/2cbfd52257e9358786962d94e144df9583a45c30))

## [blockstore-core-v4.3.7](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.6...blockstore-core-v4.3.7) (2023-12-01)


### Bug Fixes

* cleanup references to datastore in blockstores ([#274](https://github.com/ipfs/js-stores/issues/274)) ([f550624](https://github.com/ipfs/js-stores/commit/f5506243b2cb1e6462457241a1614bd5f0755c12))

## [blockstore-core-v4.3.6](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.5...blockstore-core-v4.3.6) (2023-12-01)


### Dependencies

* bump @libp2p/logger from 3.1.0 to 4.0.1 ([#280](https://github.com/ipfs/js-stores/issues/280)) ([ab4731f](https://github.com/ipfs/js-stores/commit/ab4731f49a1a6f9163fb9c246121b3392503ba8b))

## [blockstore-core-v4.3.5](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.4...blockstore-core-v4.3.5) (2023-11-27)


### Documentation

* update datastore core readme and package config ([#245](https://github.com/ipfs/js-stores/issues/245)) ([c08d29a](https://github.com/ipfs/js-stores/commit/c08d29ab18ddea26a1d9dd73d673847469d28a13))


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [blockstore-core-v4.3.4](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.3...blockstore-core-v4.3.4) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [blockstore-core-v4.3.3](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.2...blockstore-core-v4.3.3) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [blockstore-core-v4.3.2](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.1...blockstore-core-v4.3.2) (2023-08-03)


### Dependencies

* bump multiformats from 11.0.2 to 12.0.1 ([#231](https://github.com/ipfs/js-stores/issues/231)) ([93b7c13](https://github.com/ipfs/js-stores/commit/93b7c13d0dd0508b04bae2ac5a9fb9c265fc5589))

## [blockstore-core-v4.3.1](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.3.0...blockstore-core-v4.3.1) (2023-08-03)


### Dependencies

* bump @libp2p/logger from 2.1.1 to 3.0.0 ([#240](https://github.com/ipfs/js-stores/issues/240)) ([cc958ef](https://github.com/ipfs/js-stores/commit/cc958ef7ebca61a5355cfa2bc18769e374d76ae6))

## [blockstore-core-v4.3.0](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.2.0...blockstore-core-v4.3.0) (2023-07-27)


### Features

* add tiered blockstore ([#238](https://github.com/ipfs/js-stores/issues/238)) ([5143948](https://github.com/ipfs/js-stores/commit/51439486d5fcd719b9af9182b35565e87da96c99))

## [blockstore-core-v4.2.0](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.1.1...blockstore-core-v4.2.0) (2023-06-03)


### Features

* add black hole stores ([#227](https://github.com/ipfs/js-stores/issues/227)) ([6074f0f](https://github.com/ipfs/js-stores/commit/6074f0fa831abc45b40177ea498a2e0fbb3eeb32))

## [blockstore-core-v4.1.1](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.1.0...blockstore-core-v4.1.1) (2023-06-03)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [blockstore-core-v4.1.0](https://github.com/ipfs/js-stores/compare/blockstore-core-v4.0.2...blockstore-core-v4.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [4.0.2](https://github.com/ipfs/js-blockstore-core/compare/v4.0.1...v4.0.2) (2023-03-23)


### Dependencies

* update interface-store to 5.x.x ([#74](https://github.com/ipfs/js-blockstore-core/issues/74)) ([32e0e52](https://github.com/ipfs/js-blockstore-core/commit/32e0e52e87c1ec9c245edeec20b3df369d479034))

## [4.0.1](https://github.com/ipfs/js-blockstore-core/compare/v4.0.0...v4.0.1) (2023-03-14)


### Bug Fixes

* add errors for get and has failed ([#71](https://github.com/ipfs/js-blockstore-core/issues/71)) ([cd990dd](https://github.com/ipfs/js-blockstore-core/commit/cd990dd6ebd4cb0d399b225e501365a3b8653f67))

## [4.0.0](https://github.com/ipfs/js-blockstore-core/compare/v3.0.0...v4.0.0) (2023-03-13)


### ⚠ BREAKING CHANGES

* `interface-blockstore@5` removes query/batch methods and adds getAll

### Features

* update to latest blockstore interface ([#70](https://github.com/ipfs/js-blockstore-core/issues/70)) ([273397d](https://github.com/ipfs/js-blockstore-core/commit/273397d7fca96db8cf95afc07ed0ea1a7d4239f3))

## [3.0.0](https://github.com/ipfs/js-blockstore-core/compare/v2.0.2...v3.0.0) (2023-01-06)


### ⚠ BREAKING CHANGES

* update blockstore deps (#59)

### Dependencies

* update blockstore deps ([#59](https://github.com/ipfs/js-blockstore-core/issues/59)) ([0299bf5](https://github.com/ipfs/js-blockstore-core/commit/0299bf558bc7f2ff3d63ce69a4dee55775f4389a))

## [2.0.2](https://github.com/ipfs/js-blockstore-core/compare/v2.0.1...v2.0.2) (2022-10-14)


### Dependencies

* bump multiformats from 9.9.0 to 10.0.0 ([#49](https://github.com/ipfs/js-blockstore-core/issues/49)) ([65b9c3f](https://github.com/ipfs/js-blockstore-core/commit/65b9c3ffeb0d1db1e13ee31104cf693aece9fc28))

## [2.0.1](https://github.com/ipfs/js-blockstore-core/compare/v2.0.0...v2.0.1) (2022-08-13)


### Dependencies

* bump interface-blockstore from 2.0.3 to 3.0.0 ([#41](https://github.com/ipfs/js-blockstore-core/issues/41)) ([be1323a](https://github.com/ipfs/js-blockstore-core/commit/be1323a7c4f6deb9d19163c3f6d3ecd57296a25c))
* bump interface-store from 2.0.2 to 3.0.0 ([#42](https://github.com/ipfs/js-blockstore-core/issues/42)) ([54caf74](https://github.com/ipfs/js-blockstore-core/commit/54caf748cf4277abb7f82a1eefb91bd48141c307))
* **dev:** bump interface-blockstore-tests from 2.0.4 to 3.0.0 ([#44](https://github.com/ipfs/js-blockstore-core/issues/44)) ([232033d](https://github.com/ipfs/js-blockstore-core/commit/232033db6a8204e2852d4ad29e6d4ff8d1c9a685))

## [2.0.0](https://github.com/ipfs/js-blockstore-core/compare/v1.0.5...v2.0.0) (2022-08-13)


### ⚠ BREAKING CHANGES

* this module is now ESM-only

### Features

* publish as ESM-only ([#45](https://github.com/ipfs/js-blockstore-core/issues/45)) ([01009f6](https://github.com/ipfs/js-blockstore-core/commit/01009f683bbc8b50c202919c448dc0d4cbb86249))


### Trivial Changes

* Update .github/workflows/stale.yml [skip ci] ([9e7d0d6](https://github.com/ipfs/js-blockstore-core/commit/9e7d0d6a2e2900b7739a956c371a3a0dcb623f92))

### [1.0.5](https://github.com/ipfs/js-blockstore-core/compare/v1.0.4...v1.0.5) (2022-01-07)


### Bug Fixes

* add semantic release config ([#13](https://github.com/ipfs/js-blockstore-core/issues/13)) ([de1e758](https://github.com/ipfs/js-blockstore-core/commit/de1e758decc2af2ec5e85e99c9b05d2110ade86f))

## [1.0.2](https://github.com/ipfs/js-blockstore-core/compare/v1.0.1...v1.0.2) (2021-09-09)



## [1.0.1](https://github.com/ipfs/js-blockstore-core/compare/v1.0.0...v1.0.1) (2021-09-09)



# [1.0.0](https://github.com/ipfs/js-blockstore-core/compare/v0.0.2...v1.0.0) (2021-09-09)



## [0.0.2](https://github.com/ipfs/js-blockstore-core/compare/v0.0.1...v0.0.2) (2021-09-09)


### Bug Fixes

* add types versions ([#1](https://github.com/ipfs/js-blockstore-core/issues/1)) ([fa8ce28](https://github.com/ipfs/js-blockstore-core/commit/fa8ce287da9e2528f7581151e6fa3ac86fcd4196))



## 0.0.1 (2021-09-09)
