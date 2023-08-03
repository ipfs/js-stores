import * as Errors from './errors.js'
import * as shard from './shard.js'
import type { Key } from 'interface-datastore'

export { BaseDatastore } from './base.js'
export { MemoryDatastore } from './memory.js'
export { KeyTransformDatastore } from './keytransform.js'
export { ShardingDatastore } from './sharding.js'
export { MountDatastore } from './mount.js'
export { TieredDatastore } from './tiered.js'
export { NamespaceDatastore } from './namespace.js'

export { Errors }
export { shard }

export interface Shard {
  name: string
  param: number
  readonly _padding: string
  fun: (s: string) => string
  toString: () => string
}

export interface KeyTransform {
  convert: (key: Key) => Key
  invert: (key: Key) => Key
}
