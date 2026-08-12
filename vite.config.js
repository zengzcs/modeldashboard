import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 10001,
    host: '0.0.0.0'
  },
  server: {
    port: 10001,
    proxy: {
      '/metrics': {
        target: 'http://192.168.1.100:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/metrics/, '/metrics')
      }
    }
  }
})
