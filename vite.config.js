import { defineConfig } from 'vite'

export default defineConfig({
  base: '/solar-system/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'public/index.html'
    }
  },
}) 