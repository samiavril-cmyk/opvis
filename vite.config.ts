import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Fully relative base works reliably under GitHub Pages subpaths
  base: './',
  plugins: [react()],
  build: { outDir: 'docs' },
  server: { port: 5173 }
})
