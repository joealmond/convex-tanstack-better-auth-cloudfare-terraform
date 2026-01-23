import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}', 'convex/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.convex'],
    // Silent by default - no noisy errors
    reporters: ['default'],
    // Don't fail on missing tests
    passWithNoTests: true,
  },
})
