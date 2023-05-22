import { Key } from 'interface-datastore'
import { KeyTransformDatastore } from './keytransform.js'
import type { Datastore } from 'interface-datastore'

/**
 * Wraps a given datastore into a keytransform which
 * makes a given prefix transparent.
 *
 * For example, if the prefix is `new Key(/hello)` a call
 * to `store.put(new Key('/world'), mydata)` would store the data under
 * `/hello/world`.
 */
export class NamespaceDatastore extends KeyTransformDatastore {
  constructor (child: Datastore, prefix: Key) {
    super(child, {
      convert (key) {
        return prefix.child(key)
      },
      invert (key) {
        if (prefix.toString() === '/') {
          return key
        }

        if (!prefix.isAncestorOf(key)) {
          throw new Error(`Expected prefix: (${prefix.toString()}) in key: ${key.toString()}`)
        }

        return new Key(key.toString().slice(prefix.toString().length), false)
      }
    })
  }
}
