
import {createClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

const projectRoot = path.resolve(here, '../..')
const imageFolder = path.join(
  projectRoot,
  'assets',
  'guava',
  'menu'
)

const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('Missing SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId: '9tcimamh',
  dataset: 'production',
  apiVersion: '2025-02-19',
  token,
  useCdn: false,
})

const slug = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

async function main() {
  console.log('Looking for Guava menu images...')
  console.log('Image folder:', imageFolder)

  if (!existsSync(imageFolder)) {
    console.error('Image folder not found.')
    process.exit(1)
  }

  const items = await client.fetch(`
    *[_type == "menuItem" && defined(legacyImagePath)]{
      _id,
      nameEn,
      legacyImagePath,
      "imageAssetId": image.asset._ref
    }
  `)

  console.log(`Found ${items.length} menu items with image paths.`)

  let uploaded = 0
  let missing = 0
  let skipped = 0
  let failed = 0

  for (const item of items) {
    if (item.imageAssetId) {
      skipped++
      continue
    }

    const filename = path.basename(
      item.legacyImagePath || `${slug(item.nameEn)}.webp`
    )

    const filePath = path.join(imageFolder, filename)

    if (!existsSync(filePath)) {
      console.log('Missing:', filename)
      missing++
      continue
    }

    try {
      const asset = await client.assets.upload(
        'image',
        readFileSync(filePath),
        {
          filename,
          contentType: 'image/webp',
        }
      )

      await client
        .patch(item._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit()

      uploaded++
      console.log('Uploaded:', item.nameEn)
    } catch (error) {
      failed++
      console.error('Failed:', item.nameEn, error.message)
    }
  }

  console.log('-------------------------')
  console.log('Image import finished')
  console.log('Uploaded:', uploaded)
  console.log('Missing files:', missing)
  console.log('Already had images:', skipped)
  console.log('Failed:', failed)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
