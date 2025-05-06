import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  preview: {
    host: '0.0.0.0',  // This allows external access to the preview server
    port: 5173,  // Or any port you'd like
    allowedHosts: ['ibookingvenue.com'],  // Restricts access to the specified domain
  },
});
