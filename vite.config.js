import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const backendTarget = 'https://mindflow-backend-mlbg.onrender.com'

function apiOnly(req, res, proxyOptions) {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return '/index.html'
  }
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: true
      },
      '/journal/entries': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/journal/tags': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/journal/entry-tags': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/journal/media': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/habits': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/habit-logs': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/analyticsCache': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/wordCloud': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/moodCalendar': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/wellness': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/notifications': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      },
      '/chat': {
        target: backendTarget,
        changeOrigin: true,
        secure: true,
        bypass: apiOnly
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/chart.js') || id.includes('primevue/chart')) {
            return 'vendor-chart'
          }
          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/pinia') || id.includes('node_modules/vue-i18n')) {
            return 'vendor-core'
          }
        }
      }
    }
  }
})
