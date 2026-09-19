import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/itsadatee/',
  server: {
    port: 3000,
    open: true,
  },
});