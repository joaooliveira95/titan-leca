import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.dirname(fileURLToPath(import.meta.url))
const sources = path.join(dir, '../TITAN FOTOGRAFIAS')
const outDir = path.join(dir, '../public/images')

await mkdir(outDir, { recursive: true })

const jobs = [
  {
    name: 'hero',
    file: '1-201.jpg',
    width: 1600,
    height: 2000,
    position: 'centre',
    grade: 'place',
    widths: [640, 960, 1280, 1600],
  },
  {
    name: 'individual',
    file: '1-45.jpg',
    width: 1200,
    height: 1500,
    position: 'north',
    grade: 'editorial',
    widths: [480, 720, 960, 1200],
  },
  {
    name: 'duo',
    file: '1-26.jpg',
    width: 1200,
    height: 1500,
    position: 'north',
    grade: 'editorial',
    widths: [480, 720, 960, 1200],
  },
  {
    name: 'group',
    file: '1-112.jpg',
    width: 1200,
    height: 1500,
    position: 'centre',
    grade: 'editorial',
    trim: 0.62,
    widths: [480, 720, 960, 1200],
  },
  {
    name: 'studio',
    file: '1-105.jpg',
    width: 2000,
    height: 1334,
    position: 'centre',
    grade: 'editorial',
    widths: [800, 1200, 1600, 2000],
  },
]

async function grade(input, { width, height, position, grade: mode, trim }) {
  const oriented = await sharp(input).rotate().toBuffer()
  const meta = await sharp(oriented).metadata()
  let img = sharp(oriented)
  if (trim) {
    img = sharp(oriented).extract({
      left: 0,
      top: 0,
      width: Math.round(meta.width * trim),
      height: meta.height,
    })
  }
  let pipeline = img.resize(width, height, { fit: 'cover', position })

  if (mode === 'place') {
    pipeline = pipeline.modulate({ saturation: 0.8, brightness: 1.02 }).linear(1.05, -8)
  } else if (mode === 'editorial') {
    pipeline = pipeline
      .modulate({ saturation: 0.72, brightness: 1.05 })
      .tint({ r: 232, g: 220, b: 204 })
  }

  return pipeline.png().toBuffer()
}

for (const job of jobs) {
  const master = await grade(path.join(sources, job.file), job)
  const fallbackWidth = job.widths[job.widths.length - 2] ?? job.widths.at(-1)

  for (const width of job.widths) {
    const resized = sharp(master).resize(width)
    await resized
      .clone()
      .avif({ quality: 48, effort: 5 })
      .toFile(path.join(outDir, `${job.name}-${width}.avif`))
    await resized
      .clone()
      .webp({ quality: 74 })
      .toFile(path.join(outDir, `${job.name}-${width}.webp`))
    if (width === fallbackWidth) {
      await resized
        .clone()
        .jpeg({ quality: 76, mozjpeg: true })
        .toFile(path.join(outDir, `${job.name}.jpg`))
    }
  }
  console.log('encoded', job.name)
}

const hero = await sharp(path.join(outDir, 'hero-1600.avif'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 74, mozjpeg: true })
  .toFile(path.join(outDir, 'og.jpg'))

console.log('og', hero.size)
