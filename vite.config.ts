import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/call-logs-api': {
        target: 'https://one.2440066.xyz',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
