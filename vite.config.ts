import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/IPL/', // IMPORTANT for GitHub Pages repo named IPL

  plugins: [react(), tailwindcss()],

  // No Google AI / Gemini env wiring anymore
  // define: { 'process.env.GEMINI_API_KEY': ... } removed

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
    // HMR toggle as before
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
