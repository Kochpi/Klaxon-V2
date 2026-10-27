import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Les appels à /api sont envoyés à notre serveur Express (port 3000).
    // Le navigateur ne voit qu'un seul site : le cookie de connexion fonctionne sans réglage de plus.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
