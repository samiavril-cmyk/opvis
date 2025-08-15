import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/opvis/',
  plugins: [react()],
  build: { outDir: 'docs' },
  server: { port: 5173 }
})
