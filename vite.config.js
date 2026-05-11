import { defineConfig } from 'vite';

export default defineConfig({
  base: '/nova_pos/',
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  }
});