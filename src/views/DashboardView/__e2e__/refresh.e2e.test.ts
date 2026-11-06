import { expect, test } from '@e2e/playwrightExtensions'

test('auto-refresh is off by default', async ({ dashboardPage }) => {
  await expect(dashboardPage.refreshSelect).toHaveValue('0')
  await expect(dashboardPage.repoRows()).toHaveCount(3)
  await dashboardPage.page.clock.runFor(120_000)
  await expect(dashboardPage.updated).toHaveText('Updated 2m ago')
})

test('refreshes now on request', async ({ dashboardPage }) => {
  await expect(dashboardPage.updated).toHaveText('Updated 0s ago')
  await dashboardPage.page.clock.runFor(30_000)
  await expect(dashboardPage.updated).toHaveText('Updated 30s ago')
  await dashboardPage.refreshButton.click()
  await expect(dashboardPage.updated).toHaveText('Updated 0s ago')
})

test('refreshes on the chosen interval and remembers it', async ({
  dashboardPage,
}) => {
  await expect(dashboardPage.updated).toHaveText('Updated 0s ago')
  await dashboardPage.refreshSelect.selectOption('10s')
  await dashboardPage.page.clock.runFor(9_000)
  await expect(dashboardPage.updated).toHaveText('Updated 9s ago')
  await dashboardPage.page.clock.runFor(2_000)
  await expect(dashboardPage.updated).toHaveText('Updated 1s ago')

  await dashboardPage.reload()
  await expect(dashboardPage.refreshSelect).toHaveValue('10000')
})
