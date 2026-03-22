import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfeDashboard',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      remotes: {
        sharedUi: `${process.env.VITE_SHARED_UI_URL ?? 'http://localhost:5003'}/assets/remoteEntry.js`,
      },
      shared: ['react', 'react-dom', '@tanstack/react-query'],
    }),
  ],
  build: { target: 'esnext', minify: false, cssCodeSplit: false },
  server:  { port: 5002 },
  preview: { port: 5002 },
})