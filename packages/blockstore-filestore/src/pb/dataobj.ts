/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { encodeMessage, decodeMessage, message } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface DataObj {
  FilePath: string
  Offset: bigint
  Size: number
}

export namespace DataObj {
  let _codec: Codec<DataObj>

  export const codec = (): Codec<DataObj> => {
    if (_codec == null) {
      _codec = message<DataObj>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.FilePath != null && obj.FilePath !== '')) {
          w.uint32(10)
          w.string(obj.FilePath)
        }

        if ((obj.Offset != null && obj.Offset !== 0n)) {
          w.uint32(16)
          w.uint64(obj.Offset)
        }

        if ((obj.Size != null && obj.Size !== 0)) {
          w.uint32(24)
          w.uint32(obj.Size)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          FilePath: '',
          Offset: 0n,
          Size: 0
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.FilePath = reader.string()
              break
            case 2:
              obj.Offset = reader.uint64()
              break
            case 3:
              obj.Size = reader.uint32()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<DataObj>): Uint8Array => {
    return encodeMessage(obj, DataObj.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): DataObj => {
    return decodeMessage(buf, DataObj.codec())
  }
}
