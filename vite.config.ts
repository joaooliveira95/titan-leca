import { readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function omitSourceVideos() {
  return {
    name: 'omit-source-videos',
    async closeBundle() {
      const dir = join(process.cwd(), 'dist/videos')
      const names = await readdir(dir).catch(() => [])
      await Promise.all(
        names.filter((name) => name.endsWith('.mov')).map((name) => unlink(join(dir, name))),
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), omitSourceVideos()],
})
