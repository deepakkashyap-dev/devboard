import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: {
          mfeTasks:     env.VITE_MFE_TASKS_URL     ?? 'http://localhost:5001/assets/remoteEntry.js',
          mfeDashboard: env.VITE_MFE_DASHBOARD_URL ?? 'http://localhost:5002/assets/remoteEntry.js',
        },
        shared: ['react', 'react-dom'],
      }),
    ],
    build: { target: 'esnext', minify: false, cssCodeSplit: false },
    server:  { port: 3000 },
    preview: { port: 3000 },
  }
})