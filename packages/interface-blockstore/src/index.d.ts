import {
  Pair as StorePair
} from 'interface-store'
import {
  CID
} from 'multiformats'

export interface Pair extends StorePair<CID, Uint8Array> {

}