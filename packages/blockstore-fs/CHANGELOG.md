## blockstore-fs [2.0.0](https://github.com/ipfs/js-stores/compare/blockstore-fs-1.1.11...blockstore-fs-2.0.0) (2024-08-02)


### ⚠ BREAKING CHANGES

* To detect the type of error thrown, use `.name` instead of `.code`

### Features

* use `.name` property for errors instead of `.code` ([#315](https://github.com/ipfs/js-stores/issues/315)) ([dacd6ce](https://github.com/ipfs/js-stores/commit/dacd6ce6f325262f1bc1451f20789e9e7cd9b9fd))



### Dependencies

* **interface-blockstore:** upgraded to 5.3.0
* **interface-store:** upgraded to 6.0.0
* **interface-blockstore-tests:** upgraded to 7.0.0

## blockstore-fs [1.1.11](https://github.com/ipfs/js-stores/compare/blockstore-fs-1.1.10...blockstore-fs-1.1.11) (2024-08-01)


### Dependencies

* bump it-glob from 2.0.7 to 3.0.1 ([#306](https://github.com/ipfs/js-stores/issues/306)) ([8f6313f](https://github.com/ipfs/js-stores/commit/8f6313f8a22cb537aeeac2a048aad644d3c9a7d2))

## blockstore-fs [1.1.10](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.9...blockstore-fs-1.1.10) (2024-02-12)


### Bug Fixes

* bump aegir to 42.2.3, update project config and fix deps ([#297](https://github.com/ipfs/js-stores/issues/297)) ([d521ef2](https://github.com/ipfs/js-stores/commit/d521ef251815527baee0a70705f775c0e47481ad))



### Dependencies

* **blockstore-core:** upgraded to 4.3.11
* **interface-blockstore:** upgraded to 5.2.10
* **interface-store:** upgraded to 5.1.8
* **interface-blockstore-tests:** upgraded to 6.1.10

## [blockstore-fs-v1.1.9](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.8...blockstore-fs-v1.1.9) (2023-12-30)


### Bug Fixes

* publish with limited concurrency ([85bcc4a](https://github.com/ipfs/js-stores/commit/85bcc4acc09d76d7938c55163c81d9b948c53803))
* readme update ([3bcfb6d](https://github.com/ipfs/js-stores/commit/3bcfb6d311d32a00f24c64cb55c3ba90ca495dba))


### Dependencies

* bump multiformats from 12.1.3 to 13.0.0 ([#286](https://github.com/ipfs/js-stores/issues/286)) ([c8ccd1d](https://github.com/ipfs/js-stores/commit/c8ccd1de91883d1a1cbd394c21a51b021d52baa3))

## [blockstore-fs-v1.1.8](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.7...blockstore-fs-v1.1.8) (2023-12-01)


### Bug Fixes

* cleanup references to datastore in blockstores ([#274](https://github.com/ipfs/js-stores/issues/274)) ([f550624](https://github.com/ipfs/js-stores/commit/f5506243b2cb1e6462457241a1614bd5f0755c12))

## [blockstore-fs-v1.1.7](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.6...blockstore-fs-v1.1.7) (2023-11-27)


### Documentation

* update datastore core readme and package config ([#245](https://github.com/ipfs/js-stores/issues/245)) ([c08d29a](https://github.com/ipfs/js-stores/commit/c08d29ab18ddea26a1d9dd73d673847469d28a13))


### Dependencies

* **dev:** bump aegir from 40.0.13 to 41.1.9 ([#268](https://github.com/ipfs/js-stores/issues/268)) ([0aa0944](https://github.com/ipfs/js-stores/commit/0aa0944d42798d1f6fd589e8a58de7d791760644))

## [blockstore-fs-v1.1.6](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.5...blockstore-fs-v1.1.6) (2023-09-05)


### Documentation

* update api docs ([#244](https://github.com/ipfs/js-stores/issues/244)) ([e0f6145](https://github.com/ipfs/js-stores/commit/e0f614575d675fe4db2ab30ea6a2a854e892d635))

## [blockstore-fs-v1.1.5](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.4...blockstore-fs-v1.1.5) (2023-08-03)


### Dependencies

* **dev:** bump aegir from 39.0.13 to 40.0.8 ([#241](https://github.com/ipfs/js-stores/issues/241)) ([00741ff](https://github.com/ipfs/js-stores/commit/00741ff043b40cf10ecc185665fcb705160c9877))

## [blockstore-fs-v1.1.4](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.3...blockstore-fs-v1.1.4) (2023-08-03)


### Dependencies

* bump multiformats from 11.0.2 to 12.0.1 ([#231](https://github.com/ipfs/js-stores/issues/231)) ([93b7c13](https://github.com/ipfs/js-stores/commit/93b7c13d0dd0508b04bae2ac5a9fb9c265fc5589))

## [blockstore-fs-v1.1.3](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.2...blockstore-fs-v1.1.3) (2023-06-03)


### Documentation

* fix capitalization of import ([#226](https://github.com/ipfs/js-stores/issues/226)) ([837221a](https://github.com/ipfs/js-stores/commit/837221aff3ef4d217063eb17953aff03764e7600))

## [blockstore-fs-v1.1.2](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.1...blockstore-fs-v1.1.2) (2023-06-03)


### Dependencies

* bump aegir from 38.1.8 to 39.0.9 ([#225](https://github.com/ipfs/js-stores/issues/225)) ([d0f301b](https://github.com/ipfs/js-stores/commit/d0f301b1243a0f4f692011449567b51b2706e70f))

## [blockstore-fs-v1.1.1](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.1.0...blockstore-fs-v1.1.1) (2023-03-31)


### Trivial Changes

* rename master to main ([#200](https://github.com/ipfs/js-stores/issues/200)) ([f85d719](https://github.com/ipfs/js-stores/commit/f85d719b711cd60237bdaa6a0bcd418e69a98598))


### Dependencies

* update all it-* deps ([#213](https://github.com/ipfs/js-stores/issues/213)) ([e963497](https://github.com/ipfs/js-stores/commit/e963497fdb33e61e2fe702866abbd42fba648fee))

## [blockstore-fs-v1.1.0](https://github.com/ipfs/js-stores/compare/blockstore-fs-v1.0.1...blockstore-fs-v1.1.0) (2023-03-23)


### Features

* add all blockstore and datastore implementations ([#197](https://github.com/ipfs/js-stores/issues/197)) ([0d85128](https://github.com/ipfs/js-stores/commit/0d851286d48c357b07df3f7419c1e903ed0e7fac))

## [1.0.1](https://github.com/ipfs/js-blockstore-fs/compare/v1.0.0...v1.0.1) (2023-03-23)


### Dependencies

* update interface-store to 5.x.x ([#1](https://github.com/ipfs/js-blockstore-fs/issues/1)) ([88fa91c](https://github.com/ipfs/js-blockstore-fs/commit/88fa91cb1405ed66f053ed265c1690ac0ad22214))

## 1.0.0 (2023-03-13)


### Bug Fixes

* update ci build files ([bdc1881](https://github.com/ipfs/js-blockstore-fs/commit/bdc18810e6d63ffdbf6fc6617757aaa96b0ba82c))


### Trivial Changes

* add missing dep ([f5ba415](https://github.com/ipfs/js-blockstore-fs/commit/f5ba41536816f08eb1b97f298091c7221c6c9360))
* initial import ([7a576cb](https://github.com/ipfs/js-blockstore-fs/commit/7a576cbad5696ad396c0cd2d557edf71d624a860))
