/// <reference types="vitest/config" />
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/actions-dashboard/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@e2e': path.resolve(import.meta.dirname, './e2e'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/*.test.ts'],
    testTimeout: 1000,
  },
})
