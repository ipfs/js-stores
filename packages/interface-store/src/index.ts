/**
 * @packageDocumentation
 *
 * An abstraction of the Datastore/Blockstore codebases.
 */

import type { AbortOptions } from 'abort-error'

export interface Store<Key, Input, Output, InputPair, OutputPair,
  HasOptionsExtension = {}, PutOptionsExtension = {},
  PutManyOptionsExtension = {}, GetOptionsExtension = {},
  GetManyOptionsExtension = {}, DeleteOptionsExtension = {},
  DeleteManyOptionsExtension = {}> {
  /**
   * Check for the existence of a value for the passed key
   *
   * @example
   * ```js
   *const exists = await store.has(new Key('awesome'))
   *
   *if (exists) {
   *  console.log('it is there')
   *} else {
   *  console.log('it is not there')
   *}
   *```
   */
  has(key: Key, options?: AbortOptions & HasOptionsExtension): boolean | Promise<boolean>

  /**
   * Store the passed value under the passed key
   *
   * @example
   *
   * ```js
   * await store.put([{ key: new Key('awesome'), value: new Uint8Array([0, 1, 2, 3]) }])
   * ```
   */
  put(key: Key, val: Input, options?: AbortOptions & PutOptionsExtension): Key | Promise<Key>

  /**
   * Store the given key/value pairs
   *
   * @example
   * ```js
   * const source = [{ key: new Key('awesome'), value: new Uint8Array([0, 1, 2, 3]) }]
   *
   * for await (const { key, value } of store.putMany(source)) {
   *   console.info(`put content for key ${key}`)
   * }
   * ```
   */
  putMany(
    source: Iterable<InputPair> | AsyncIterable<InputPair>,
    options?: AbortOptions & PutManyOptionsExtension
  ): Generator<Key> | AsyncGenerator<Key>

  /**
   * Retrieve the value stored under the given key
   *
   * @example
   * ```js
   * const value = await store.get(new Key('awesome'))
   * console.log('got content: %s', value.toString('utf8'))
   * // => got content: datastore
   * ```
   */
  get(key: Key, options?: AbortOptions & GetOptionsExtension): Output

  /**
   * Retrieve values for the passed keys
   *
   * @example
   * ```js
   * for await (const { key, value } of store.getMany([new Key('awesome')])) {
   *   console.log(`got "${key}" = "${new TextDecoder('utf8').decode(value)}"`')
   *   // => got "/awesome" = "datastore"
   * }
   * ```
   */
  getMany(
    source: Iterable<Key> | AsyncIterable<Key>,
    options?: AbortOptions & GetManyOptionsExtension
  ): Generator<OutputPair> | AsyncGenerator<OutputPair>

  /**
   * Remove the record for the passed key
   *
   * @example
   *
   * ```js
   * await store.delete(new Key('awesome'))
   * console.log('deleted awesome content :(')
   * ```
   */
  delete(key: Key, options?: AbortOptions & DeleteOptionsExtension): void | Promise<void>

  /**
   * Remove values for the passed keys
   *
   * @example
   *
   * ```js
   * const source = [new Key('awesome')]
   *
   * for await (const key of store.deleteMany(source)) {
   *   console.log(`deleted content with key ${key}`)
   * }
   * ```
   */
  deleteMany(
    source: Iterable<Key> | AsyncIterable<Key>,
    options?: AbortOptions & DeleteManyOptionsExtension
  ): Generator<Key> | AsyncGenerator<Key>
}

export * from './errors.ts'
