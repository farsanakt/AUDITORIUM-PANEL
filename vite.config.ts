import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  preview: {
    host: '0.0.0.0', 
    port: 8080,  
    allowedHosts: ['ibookingvenue.com'],  
  },
});
