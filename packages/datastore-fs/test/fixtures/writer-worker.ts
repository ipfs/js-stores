import { Key } from 'interface-datastore'
import { expose } from 'threads/worker'
import { FsDatastore } from '../../src/index.js'

let fs: FsDatastore
expose({
  async isReady (path) {
    fs = new FsDatastore(path)
    try {
      await fs.open()
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error opening blockstore', err)
      throw err
    }
  },
  async put (keyString, value) {
    const key = new Key(keyString)
    try {
      return await fs.put(key, value)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error putting block', err)
      throw err
    }
  }
})
