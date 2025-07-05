import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import demoLinksPlugin from './vite-plugin-demo-links.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), demoLinksPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './',
  build: {
    outDir: 'dist'
  },
  appType: 'mpa',
})
