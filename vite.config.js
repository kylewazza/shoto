import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blog from './scripts/blog-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), blog()],
})
