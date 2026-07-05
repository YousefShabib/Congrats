import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        rewrite: (p) =>
          p.replace(
            /^\/api/,
            `/${process.env.VITE_FIREBASE_PROJECT_ID ?? 'congrats-143a7'}/us-central1/aiApi`,
          ),
      },
    },
  },
})
