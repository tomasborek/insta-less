import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss()],
  base: './',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'popup',
    target: 'esnext',
  },
});
