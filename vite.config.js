import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Vite configuration for Vue.js
// This tells Vite to use the Vue plugin and sets up the development server
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 3000,
    open: true // Automatically open browser when dev server starts
  }
})