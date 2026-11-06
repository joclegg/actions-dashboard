import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

export default defineConfig({
  testDir: './src',
  testMatch: '**/__e2e__/*.e2e.test.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  snapshotPathTemplate:
    '{testDir}/{testFileDir}/__snapshots__/{arg}-{projectName}-{platform}{ext}',
  use: {
    baseURL: `http://localhost:${PORT}/actions-dashboard/`,
    trace: 'on-first-retry',
    launchOptions: { slowMo: Number(process.env.SLOW_MO ?? 0) },
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@mobile/,
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grepInvert: /@desktop/ },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/actions-dashboard/`,
    reuseExistingServer: !process.env.CI,
  },
})
