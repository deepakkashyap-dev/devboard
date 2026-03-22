import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'sharedUi',
            filename: 'remoteEntry.js',
            exposes: {
                './Button': './src/components/Button.tsx',
                './Badge': './src/components/Badge.tsx',
                './Card': './src/components/Card.tsx',
                './Skeleton': './src/components/Skeleton.tsx',
            },
            shared: ['react', 'react-dom'],
        }),
    ],
    build: { target: 'esnext', minify: false, cssCodeSplit: false },
    server: { port: 5003 },
    preview: { port: 5003 },
})