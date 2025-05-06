import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  preview: {
    allowedHosts: ['ibookingvenue.com']
  }
})
