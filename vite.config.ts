import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  base: '/',
  build: {
    outDir: './dist',
  },
  server: {
    port: 999,
    open: true,
  },
});
