import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Todo lo que empiece con /api va al backend de Express
      '/api': 'http://localhost:3000',
    },
  },
});
