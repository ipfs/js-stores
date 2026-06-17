# Encoding Benchmark

Multiformats ships a number of base encoding algorithms. This module has no strong opinion
on which is best, as long as it is case insensitive, so benchmark them to choose the fastest.

At the time of writing `base8` is the fastest, followed other alorithms using `rfc4648` encoding
internally in `multiformats` (e.g. `base16`, `base32`), and finally anything using `baseX` encoding.

We choose base32upper which uses `rfc4648` because it has a longer alphabet so will shard better.

## Usage

```console
$ npm i
$ npm start

> benchmarks-gc@1.0.0 start
> npm run build && node dist/src/index.js


> benchmarks-gc@1.0.0 build
> aegir build --bundle false

[14:51:28] tsc [started]
[14:51:33] tsc [completed]
generating Ed25519 keypair...
┌─────────┬────────────────┬─────────┬───────────┬──────┐
│ (index) │ Implementation │  ops/s  │   ms/op   │ runs │
├─────────┼────────────────┼─────────┼───────────┼──────┤
//... results here
```
