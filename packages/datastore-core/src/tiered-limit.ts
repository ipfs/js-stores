import { logger } from '@libp2p/logger'
import { type Key, type KeyQuery, type Pair, type Query } from 'interface-datastore'
import { BaseDatastore } from './base.js'
import type { AbortOptions, AwaitIterable } from 'interface-store'

/**
 * @example for memory store limited to 1MB, where extra data is dropped
 *
 * ```typescript
 * import { MemoryDatastore } from 'datastore-core'
 * import { TieredLimitDatastore } from 'datastore-core'
 * import { BlackHoleDatastore } from 'datastore-core'
 *
 * const tieredLimitDatastore = new TieredLimitDatastore({
 *  maxBytes: 1024 * 1024, // 1MB limit
 *  store: new MemoryDatastore()
 * }, new BlackHoleDatastore())
 * ```
 */

const log = logger('datastore:core:tiered-limit')

export class TieredLimitDatastore<T extends BaseDatastore, T2 extends BaseDatastore> extends BaseDatastore {
  private readonly primaryStore: T
  private readonly backingStore: T2
  private readonly maxBytes: number
  private currentBytes: number = 0
  /**
   * Tracks sizes of items
   *
   * Note: this map is not taken into account when considering the maxBytes limit
   */
  private readonly sizeMap = new Map<Key, number>()
  /**
   * Tracks order for eviction
   * keys are added to the end of the array when added or updated
   * keys are removed from the start of the array when evicted
   * Note: size of keys is not tracked, so if you have large keys, you should
   * increase the maxBytes limit accordingly
   */
  private readonly evictionOrder: Key[] = []

  constructor ({ maxBytes, store }: { maxBytes: number, store: T }, backingStore: T2) {
    super()
    this.primaryStore = store
    this.backingStore = backingStore
    this.maxBytes = maxBytes
  }

  private updateSize (key: Key, sizeDelta: number): void {
    this.currentBytes += sizeDelta
    if (sizeDelta > 0) {
      // If adding or updating size, push key to eviction order
      this.evictionOrder.push(key)
    } else {
      // If reducing size, find and remove the key from eviction order
      const index = this.evictionOrder.indexOf(key)
      if (index !== -1) this.evictionOrder.splice(index, 1)
    }
  }

  /**
   * Evict items from primary store to backing store until required space is available
   */
  private async evictSpace (requiredSpace: number): Promise<void> {
    if (requiredSpace <= 0) {
      return // No need to evict negative space
    }
    if (this.currentBytes + requiredSpace > this.maxBytes && this.evictionOrder.length > 0) {
      log.trace('Evicting %d bytes from primary store to backing store', requiredSpace)
      while (this.currentBytes + requiredSpace > this.maxBytes && this.evictionOrder.length > 0) {
        const keyToEvict = this.evictionOrder.shift() // Get the oldest key
        if (keyToEvict == null) {
          // this shouldn't happen, but if it does:
          // TODO: do we want to just add to the backingStore if we can't evict?
          throw new Error('Need to evict but nothing else to evict. Is the item you are trying to add too large?')
        }
        const size = this.sizeMap.get(keyToEvict)
        if (size == null) {
          throw new Error('Key to evict not found in size map. This should not happen.')
        }
        log.trace('Evicting %d bytes for key "%s"', size, keyToEvict.toString())
        const value = await this.primaryStore.get(keyToEvict) // Get value to evict
        await this.backingStore.put(keyToEvict, value) // Ensure it's saved in the backing store
        await this.primaryStore.delete(keyToEvict) // Delete from primary store
        this.sizeMap.delete(keyToEvict) // Remove size tracking for this key
        this.currentBytes -= size // Update current used bytes
      }
      log.trace('Eviction complete')
    }
  }

  async handleSizeForPut (key: Key, value: Uint8Array): Promise<void> {
    const size = value.byteLength
    if (size > this.maxBytes) {
      throw new Error(`Item size ${size} exceeds maxBytes limit of ${this.maxBytes}`)
    }
    const existingSize = this.sizeMap.get(key) ?? 0 // existing size is 0 if not found
    const sizeDelta = size - existingSize // if already in the primary store, this will be 0

    await this.evictSpace(sizeDelta) // Evict if needed before adding new item

    this.sizeMap.set(key, size) // Update size tracking
    this.updateSize(key, sizeDelta)
  }

  async put (key: Key, value: Uint8Array, options?: AbortOptions): Promise<Key> {
    log.trace('Putting %s', key.toString())
    try {
      await this.handleSizeForPut(key, value)
    } catch (err: any) {
      log.error('Error putting %s to primary store: %s', key.toString(), err)
      log.trace('Putting %s to backing store', key.toString())
      await this.backingStore.put(key, value, options)
      return key
    }
    log.trace('Putting %s to primary store', key.toString())
    await this.primaryStore.put(key, value, options)

    // Write to backingstore happens upon eviction
    return key
  }

  async get (key: Key, options?: AbortOptions): Promise<Uint8Array> {
    if (await this.primaryStore.has(key)) {
      log.trace('Getting %s from primary store', key.toString())
      return this.primaryStore.get(key, options)
    }

    log.trace('Getting %s from backing store', key.toString())
    const value = await this.backingStore.get(key, options)
    // TODO: Do we always want to put the value back into the primary store? It could be a config option.
    await this.put(key, value, options)
    return value
  }

  async has (key: Key, options?: AbortOptions): Promise<boolean> {
    if (await this.primaryStore.has(key, options)) {
      return true
    }
    return this.backingStore.has(key, options)
  }

  private async deleteFromPrimaryStore (key: Key, options?: any): Promise<void> {
    if (await this.primaryStore.has(key, options)) {
      const size = this.sizeMap.get(key)
      if (size != null) {
        this.updateSize(key, -size) // Update size tracking
        this.sizeMap.delete(key) // Remove size tracking
      }
      await this.primaryStore.delete(key, options)
    }
  }

  async delete (key: Key, options?: AbortOptions): Promise<void> {
    log.trace('Deleting %s', key.toString())
    await this.deleteFromPrimaryStore(key, options)
    await this.backingStore.delete(key, options)
  }

  async * _allKeys (q: KeyQuery, options?: AbortOptions): AwaitIterable<Key> {
    // TODO: How to handle stores that don't implement _allKeys? Do we want to?
    yield * this.primaryStore._allKeys(q, options)
    yield * this.backingStore._allKeys(q, options)
  }

  async * _all (q: Query, options?: AbortOptions): AwaitIterable<Pair> {
    // TODO: How to handle stores that don't implement _all? Do we want to?
    yield * this.primaryStore._all(q, options)
    yield * this.backingStore._all(q, options)
  }
}
