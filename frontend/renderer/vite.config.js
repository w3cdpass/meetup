import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://xp1b3hbq-3000.inc1.devtunnels.ms/',
        ws: true,
        changeOrigin: true
      },
      '/api': {
        target: 'https://xp1b3hbq-3000.inc1.devtunnels.ms/',
        changeOrigin: true
      }
    },
  }
})
