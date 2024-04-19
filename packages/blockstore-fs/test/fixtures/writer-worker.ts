import { expose } from 'threads/worker'
import { FsBlockstore } from '../../src/index.js'
import { CID } from 'multiformats/cid'

let fs: FsBlockstore
expose({
  isReady(path) {
    fs = new FsBlockstore(path)
    return fs.open()
  },
  put(cidString, value) {
    const key = CID.parse(cidString)
    return fs.put(key, value)
  },
  close() {
    return fs.close()
  }
})
