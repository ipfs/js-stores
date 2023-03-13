
export type AwaitIterable<T> = Iterable<T> | AsyncIterable<T>
export type Await<T> = Promise<T> | T

/**
 * Options for async operations.
 */
export interface Options {
  signal?: AbortSignal
}

export interface Store<Key, Value, Pair> {
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
  has: (key: Key, options?: Options) => Await<boolean>

  /**
   * Store the passed value under the passed key
   *
   * @example
   *
   * ```js
   * await store.put([{ key: new Key('awesome'), value: new Uint8Array([0, 1, 2, 3]) }])
   * ```
   */
  put: (key: Key, val: Value, options?: Options) => Await<void>

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
  putMany: (
    source: AwaitIterable<Pair>,
    options?: Options
  ) => AwaitIterable<Pair>

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
  get: (key: Key, options?: Options) => Await<Value>

  /**
   * Retrieve values for the passed keys
   *
   * @example
   * ```js
   * for await (const value of store.getMany([new Key('awesome')])) {
   *   console.log('got content:', new TextDecoder('utf8').decode(value))
   *   // => got content: datastore
   * }
   * ```
   */
  getMany: (
    source: AwaitIterable<Key>,
    options?: Options
  ) => AwaitIterable<Value>

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
  delete: (key: Key, options?: Options) => Await<void>

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
  deleteMany: (
    source: AwaitIterable<Key>,
    options?: Options
  ) => AwaitIterable<Key>
}
