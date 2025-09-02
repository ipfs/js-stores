import { Key } from 'interface-datastore'
// @ts-expect-error types are broken: https://github.com/andywer/threads.js/pull/470
import { expose } from 'threads/worker'
import { FsDatastore } from '../../src/index.js'

let fs: FsDatastore
expose({
  async isReady (path: string) {
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
  async put (keyString: string, value: Uint8Array) {
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
