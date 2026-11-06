import { test as base } from '@playwright/test'

import { DashboardPage } from '@e2e/dashboardPage'
import {
  INSTALLATIONS,
  NOW,
  REPOS,
  RUNS,
  SESSION,
  USER,
} from '@e2e/githubFixtures'

export const test = base.extend<{
  signedIn: boolean
  dashboardPage: DashboardPage
}>({
  signedIn: [true, { option: true }],
  dashboardPage: async ({ page, signedIn }, use) => {
    const dashboardPage = new DashboardPage(page)
    await page.clock.install({ time: new Date(NOW) })
    if (signedIn) {
      await page.addInitScript((session) => {
        if (!sessionStorage.getItem('seeded')) {
          sessionStorage.setItem('seeded', '1')
          localStorage.setItem('session', session)
        }
      }, JSON.stringify(SESSION))
    }
    await page.route('https://api.github.com/**', async (route) => {
      const url = new URL(route.request().url())
      const headers = {
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4990',
        'x-ratelimit-reset': '0',
      }
      const runs = url.pathname.match(
        /^\/repos\/[^/]+\/([^/]+)\/actions\/runs$/,
      )
      if (runs) {
        dashboardPage.runsRequests.push(runs[1])
        return route.fulfill({
          headers,
          json: { workflow_runs: RUNS[runs[1]] ?? [] },
        })
      }
      const body: Record<string, unknown> = {
        '/user': USER,
        '/user/installations': INSTALLATIONS,
        '/users/jo/repos': REPOS,
        '/user/installations/7/repositories': {
          repositories: REPOS.slice(0, 2),
        },
      }
      return url.pathname in body
        ? route.fulfill({ headers, json: body[url.pathname] })
        : route.fulfill({ status: 404, json: { message: 'Not Found' } })
    })
    await dashboardPage.open()
    await use(dashboardPage)
  },
})

export { expect } from '@playwright/test'
