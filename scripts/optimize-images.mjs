import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.dirname(fileURLToPath(import.meta.url))
const sources = path.join(dir, 'sources')
const outDir = path.join(dir, '../public/images')

await mkdir(outDir, { recursive: true })

const jobs = [
  {
    name: 'hero',
    file: 'hero-e.jpg',
    width: 1600,
    height: 2000,
    position: 'right',
    grade: 'bw',
    widths: [640, 960, 1280, 1600],
  },
  {
    name: 'individual',
    file: 'hero-a.jpg',
    width: 1200,
    height: 1500,
    position: 'left',
    grade: 'bw',
    widths: [480, 720, 960, 1200],
  },
  {
    name: 'duo',
    file: 'run-b.jpg',
    width: 1200,
    height: 1500,
    position: 'centre',
    grade: 'orange',
    widths: [480, 720, 960, 1200],
  },
  {
    name: 'group',
    file: 'kb-c.jpg',
    width: 1200,
    height: 1500,
    position: 'centre',
    grade: 'bw',
    widths: [480, 720, 960, 1200],
  },
  {
    name: 'studio',
    file: 'gym-d.jpg',
    width: 2000,
    height: 1334,
    position: 'centre',
    grade: 'warm',
    widths: [800, 1200, 1600, 2000],
  },
]

async function grade(input, { width, height, position, grade: mode }) {
  let pipeline = sharp(input).rotate().resize(width, height, { fit: 'cover', position })

  if (mode === 'bw') {
    pipeline = pipeline.grayscale().linear(1.08, -8).sharpen({ sigma: 0.4 })
  } else if (mode === 'warm') {
    pipeline = pipeline.modulate({ saturation: 0.42, brightness: 1.04 }).tint({ r: 226, g: 212, b: 190 })
  } else if (mode === 'orange') {
    const gray = await pipeline.clone().grayscale().linear(1.22, -18).toBuffer()
    const orange = await sharp({
      create: { width, height, channels: 3, background: { r: 255, g: 62, b: 10 } },
    })
      .png()
      .toBuffer()
    pipeline = sharp(gray)
      .composite([{ input: orange, blend: 'multiply' }])
      .modulate({ brightness: 1.05, saturation: 1.12 })
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
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .jpeg({ quality: 74, mozjpeg: true })
  .toFile(path.join(outDir, 'og.jpg'))

console.log('og', hero.size)
