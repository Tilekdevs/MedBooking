import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ab1t.top',
        changeOrigin: true,
        secure: false,
        ws: false,
      },
    },
    allowedHosts: ['ab1t.top'],
  }
})
