import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

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
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/journal/entries': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/journal/tags': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/journal/entry-tags': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/journal/media': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/habits': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/habit-logs': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/analyticsCache': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/wordCloud': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/moodCalendar': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/wellness': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/notifications': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/subscriptions': {
        target: 'https://mindflow-backend-mlbg.onrender.com',
        changeOrigin: true,
        secure: true
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