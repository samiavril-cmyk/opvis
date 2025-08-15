import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT for GitHub Pages: set base to './' so assets resolve under /docs.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'docs'
  },
  server: {
    port: 5173
  }
})
