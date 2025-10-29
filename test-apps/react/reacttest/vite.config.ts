import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // makes sure that Vite serves from the correct base when running in devcontainer
  base: process.env.VITE_BASE_URL || '/',
  build: {
    sourcemap: true,
  },
  server: {
    host: '0.0.0.0',
  },
  preview: {
    host: '0.0.0.0',
  },
})
