import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    // SPAバンドルを dist/app 配下に出力
    outDir: 'dist/app',
    emptyOutDir: true,
  },
  base: '/app/',
})
