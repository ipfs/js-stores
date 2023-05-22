import tempdir from 'ipfs-utils/src/temp-dir.js'
import { CID } from 'multiformats/cid'
import { LevelBlockstore } from '../../src/index.js'

async function testLevelIteratorDestroy (): Promise<void> {
  const store = new LevelBlockstore(tempdir())
  await store.open()
  await store.put(CID.parse('QmaQwYWpchozXhFv8nvxprECWBSCEppN9dfd2VQiJfRo3F'), new TextEncoder().encode(`TESTDATA${Date.now()}`))
  for await (const d of store.getAll()) {
    console.log(d) // eslint-disable-line no-console
  }
}

// Will exit with:
// > Assertion failed: (ended_), function ~Iterator, file ../binding.cc, line 546.
// If iterator gets destroyed (in c++ land) and .end() was not called on it.
void testLevelIteratorDestroy()
