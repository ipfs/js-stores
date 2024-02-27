import { Key, type Datastore, type Query, type Pair, type KeyQuery } from 'interface-datastore'
import map from 'it-map'
import { KeyTransformDatastore } from './keytransform.js'
import type { AbortOptions } from 'interface-store'

/**
 * Wraps a given datastore into a keytransform which
 * makes a given prefix transparent.
 *
 * For example, if the prefix is `new Key(/hello)` a call
 * to `store.put(new Key('/world'), mydata)` would store the data under
 * `/hello/world`.
 */
export class NamespaceDatastore extends KeyTransformDatastore {
  private readonly iChild: Datastore
  private readonly iKey: Key

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

    this.iChild = child
    this.iKey = prefix
  }

  query (q: Query, options?: AbortOptions): AsyncIterable<Pair> {
    const query: Query = {
      ...q
    }

    query.filters = (query.filters ?? []).map(filter => {
      return ({ key, value }) => filter({ key: this.transform.invert(key), value })
    })

    const { prefix } = q
    if (prefix != null && prefix !== '/') {
      delete query.prefix
      query.filters.push(({ key }) => {
        return this.transform.invert(key).toString().startsWith(prefix)
      })
    }

    if (query.orders != null) {
      query.orders = query.orders.map(order => {
        return (a, b) => order(
          { key: this.transform.invert(a.key), value: a.value },
          { key: this.transform.invert(b.key), value: b.value }
        )
      })
    }

    query.filters.unshift(({ key }) => this.iKey.isAncestorOf(key))

    return map(this.iChild.query(query, options), ({ key, value }) => {
      return {
        key: this.transform.invert(key),
        value
      }
    })
  }

  queryKeys (q: KeyQuery, options?: AbortOptions): AsyncIterable<Key> {
    const query = {
      ...q
    }

    query.filters = (query.filters ?? []).map(filter => {
      return (key) => filter(this.transform.invert(key))
    })

    const { prefix } = q
    if (prefix != null && prefix !== '/') {
      delete query.prefix
      query.filters.push((key) => {
        return this.transform.invert(key).toString().startsWith(prefix)
      })
    }

    if (query.orders != null) {
      query.orders = query.orders.map(order => {
        return (a, b) => order(
          this.transform.invert(a),
          this.transform.invert(b)
        )
      })
    }

    query.filters.unshift(key => this.iKey.isAncestorOf(key))

    return map(this.iChild.queryKeys(query, options), key => {
      return this.transform.invert(key)
    })
  }
}
