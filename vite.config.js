import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mzidankusuma.alwaysdata.net/',
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'https://mzidankusuma.alwaysdata.net/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
