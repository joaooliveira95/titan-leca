import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.dirname(fileURLToPath(import.meta.url))
const masters = path.join(dir, '../design/intro')
const outDir = path.join(dir, '../public/images/intro')

const frames = [
  ['image-1.png', 'structure', 68, 84],
  ['image-2.png', 'material', 68, 84],
  ['image-3.png', 'place', 54, 76],
  ['image-4.png', 'identity', 54, 76],
  ['image-5.png', 'brand', 54, 76],
  ['image-6.png', 'movement', 54, 76],
  ['image-7.png', 'reveal', 54, 76],
]

const widths = [768, 1280, 1672]

await mkdir(outDir, { recursive: true })

for (const [file, name, avifQuality, webpQuality] of frames) {
  const input = path.join(masters, file)
  for (const width of widths) {
    const resized = sharp(input).resize({ width, withoutEnlargement: true })
    const avifPath = path.join(outDir, `${name}-${width}.avif`)
    const webpPath = path.join(outDir, `${name}-${width}.webp`)
    await resized.clone().avif({ quality: avifQuality, effort: 5 }).toFile(avifPath)
    await resized.clone().webp({ quality: webpQuality }).toFile(webpPath)
    const avif = await stat(avifPath)
    const webp = await stat(webpPath)
    console.log(
      `${name}-${width}`,
      `avif ${Math.round(avif.size / 1024)}KB`,
      `webp ${Math.round(webp.size / 1024)}KB`,
    )
  }
}

const shipped = (await readdir(outDir)).filter((file) => file.startsWith('image-'))
if (shipped.length) {
  console.log('unexpected masters still in public:', shipped.join(', '))
}
