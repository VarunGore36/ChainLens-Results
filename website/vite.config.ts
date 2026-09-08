import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { cpSync, existsSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-data',
      writeBundle() {
        const src = resolve(__dirname, '../data')
        const dest = resolve(__dirname, 'dist/data')
        if (existsSync(src)) {
          if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
          cpSync(src, dest, { recursive: true })
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 700,
  },
  server: {
    port: 3000,
  },
})
