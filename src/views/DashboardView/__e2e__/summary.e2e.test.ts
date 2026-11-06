import { expect, test } from '@e2e/playwrightExtensions'

test('lists repositories with failures first', async ({ dashboardPage }) => {
  await expect(dashboardPage.repoRows()).toHaveCount(3)
  await dashboardPage.expectRepoOrder(['api', 'web', 'docs'])
  await expect(
    dashboardPage.repositories.getByText(
      '1 archived or forked repository hidden.',
    ),
  ).toBeVisible()
  await expect(dashboardPage.updated).toHaveText('Updated 0s ago')
  await dashboardPage.expectScreenshot('summary.png')
})

test('shows recent runs from every repository, newest first', async ({
  dashboardPage,
}) => {
  await expect(dashboardPage.runRows()).toHaveCount(4)
  await expect(dashboardPage.runRows().first()).toContainText('Fix login')
  await expect(dashboardPage.runRows().nth(1)).toContainText('Try a branch')
  await expect(
    dashboardPage.runRows().first().getByRole('link'),
  ).toHaveAttribute('href', 'https://github.com/jo/x/actions/runs/11')
})

test('switches to an installed organisation', async ({ dashboardPage }) => {
  await dashboardPage.ownerSelect.selectOption('acme')
  await expect(dashboardPage.repoRows()).toHaveCount(2)
  await expect(
    dashboardPage.page.getByText('Showing public repositories only.'),
  ).toBeHidden()
})

test('looks up any user by name', async ({ dashboardPage }) => {
  await dashboardPage.ownerInput.fill('nobody')
  await dashboardPage.showButton.click()
  await expect(dashboardPage.page.getByRole('alert')).toHaveText(
    'No user or organisation with that name.',
  )
})
