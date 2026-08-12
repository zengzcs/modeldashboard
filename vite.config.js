import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/metrics': {
        target: 'http://192.168.1.100:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/metrics/, '/metrics')
      }
    }
  }
})
