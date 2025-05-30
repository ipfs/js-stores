/* eslint-disable no-console */

import { S3 } from '@aws-sdk/client-s3'
import { unixfs } from '@helia/unixfs'
import { BlockstoreS3 } from 'blockstore-s3'
import { createHelia } from 'helia'
import toBuffer from 'it-to-buffer'

async function main () {
  // Configure S3 as normal
  const s3 = new S3({
    region: 'region',
    credentials: {
      accessKeyId: 'myaccesskey',
      secretAccessKey: 'mysecretkey'
    }
  })

  const blockstore = new BlockstoreS3(s3, 'my-bucket')

  // Create a new Helia node with our S3 backed Repo
  console.log('Start Helia')
  const helia = await createHelia({
    blockstore
  })

  // Test out the repo by sending and fetching some data
  console.log('Helia is ready')

  try {
    const fs = unixfs(helia)

    // Let's add a file to Helia
    const cid = await fs.addBytes(Uint8Array.from([0, 1, 2, 3]))

    console.log('\nAdded file:', cid)

    // Log out the added files metadata and cat the file from IPFS
    const data = await toBuffer(fs.cat(cid))

    // Print out the files contents to console
    console.log(`\nFetched file content containing ${data.byteLength} bytes`)
  } catch (err) {
    // Log out the error
    console.log('File Processing Error:', err)
  }
  // After everything is done, shut the node down
  // We don't need to worry about catching errors here
  console.log('\n\nStopping the node')
  await helia.stop()
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
