import { CID } from 'multiformats/cid'
// @ts-expect-error types are broken: https://github.com/andywer/threads.js/pull/470
import { expose } from 'threads/worker'
import { FsBlockstore } from '../../src/index.js'

let fs: FsBlockstore
expose({
  async isReady (path: string) {
    fs = new FsBlockstore(path)
    try {
      await fs.open()
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error opening blockstore', err)
      throw err
    }
  },
  async put (cidString: string, value: Uint8Array) {
    const key = CID.parse(cidString)
    try {
      return await fs.put(key, value)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error putting block', err)
      throw err
    }
  }
})
