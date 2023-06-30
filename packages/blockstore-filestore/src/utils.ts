import fs from 'node:fs'
import { Key } from 'interface-datastore'
import { base32 } from 'multiformats/bases/base32'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import * as Digest from 'multiformats/hashes/digest'

export const cidToKey = (cid: CID): Key => {
  return new Key(`/${base32.encode(cid.multihash.bytes).slice(1).toUpperCase()}`, false)
}

export const keyToCid = (key: Key): CID => {
  return CID.createV1(raw.code, Digest.decode(base32.decode(`b${key.toString().slice(1).toLowerCase()}`)))
}

export const readChunk = async (path: string, offset: bigint, size: number): Promise<Uint8Array> => {
  const fd = await new Promise<number>((resolve, reject) => {
    fs.open(path, (err, fd) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(fd)
      }
    })
  })

  const data = await new Promise<Uint8Array>((resolve, reject) => {
    fs.read(fd, { position: offset, length: size }, (err, _, data: Uint8Array) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

  await new Promise<void>((resolve, reject) => {
    fs.close(fd, (err) => {
      if (err != null) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  return data
}
