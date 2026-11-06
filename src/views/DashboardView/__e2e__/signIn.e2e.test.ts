import { expect, test } from '@e2e/playwrightExtensions'

test.describe('signed out', () => {
  test.use({ signedIn: false })

  test('asks to sign in with GitHub', async ({ dashboardPage }) => {
    await expect(dashboardPage.heading).toHaveText('Actions dashboard')
    await expect(dashboardPage.signInButton).toBeVisible()
    await dashboardPage.expectScreenshot('signIn.png')
  })
})

test('signs out', async ({ dashboardPage }) => {
  await dashboardPage.signOutButton.click()
  await expect(dashboardPage.signInButton).toBeVisible()
})
