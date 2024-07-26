import { base10 } from 'multiformats/bases/base10'
import { base16upper } from 'multiformats/bases/base16'
import { base256emoji } from 'multiformats/bases/base256emoji'
import { base32, base32upper, base32hexupper, base32z } from 'multiformats/bases/base32'
import { base36, base36upper } from 'multiformats/bases/base36'
import { base8 } from 'multiformats/bases/base8'
import { CID } from 'multiformats/cid'
import { Bench } from 'tinybench'

const RESULT_PRECISION = 2

const cid = CID.parse('QmeimKZyjcBnuXmAD9zMnSjM9JodTbgGT3gutofkTqz9rE')

async function main (): Promise<void> {
  const suite = new Bench()
  suite.add('base8', () => {
    base8.encode(cid.bytes)
  })
  suite.add('base10', () => {
    base10.encode(cid.bytes)
  })
  suite.add('base16upper', () => {
    base16upper.encode(cid.bytes)
  })
  suite.add('base32', () => {
    base32.encode(cid.bytes)
  })
  suite.add('base32upper', () => {
    base32upper.encode(cid.bytes)
  })
  suite.add('base32hexupper', () => {
    base32hexupper.encode(cid.bytes)
  })
  suite.add('base32z', () => {
    base32z.encode(cid.bytes)
  })
  suite.add('base36', () => {
    base36.encode(cid.bytes)
  })
  suite.add('base36upper', () => {
    base36upper.encode(cid.bytes)
  })
  suite.add('base256emoji', () => {
    base256emoji.encode(cid.bytes)
  })

  await suite.run()

  console.table(suite.tasks.sort((a, b) => { // eslint-disable-line no-console
    const resultA = a.result?.hz ?? 0
    const resultB = b.result?.hz ?? 0

    if (resultA === resultB) {
      return 0
    }

    if (resultA < resultB) {
      return 1
    }

    return -1
  }).map(({ name, result }) => ({
    Implementation: name,
    'ops/s': parseFloat(result?.hz.toFixed(RESULT_PRECISION) ?? '0'),
    'ms/op': parseFloat(result?.period.toFixed(RESULT_PRECISION) ?? '0'),
    runs: result?.samples.length
  })))
}

main().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
