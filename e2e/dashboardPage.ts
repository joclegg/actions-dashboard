import { expect, type Locator, type Page } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly heading: Locator
  readonly signInButton: Locator
  readonly repositories: Locator
  readonly recentRuns: Locator
  readonly refreshButton: Locator
  readonly refreshSelect: Locator
  readonly ownerSelect: Locator
  readonly ownerInput: Locator
  readonly showButton: Locator
  readonly updated: Locator
  readonly signOutButton: Locator
  readonly runsRequests: string[] = []

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { level: 1 })
    this.signInButton = page.getByRole('button', {
      name: 'Sign in with GitHub',
    })
    this.repositories = page.getByRole('region', { name: 'Repositories' })
    this.recentRuns = page.getByRole('region', { name: 'Recent runs' })
    this.refreshButton = page.getByRole('button', { name: 'Refresh now' })
    this.refreshSelect = page.getByRole('combobox', { name: 'Auto-refresh' })
    this.ownerSelect = page.getByRole('combobox', {
      name: 'User or organisation',
    })
    this.ownerInput = page.getByRole('textbox', {
      name: 'Any user or organisation',
    })
    this.showButton = page.getByRole('button', { name: 'Show' })
    this.updated = page.getByText(/^Updated /)
    this.signOutButton = page.getByRole('button', { name: 'Sign out' })
  }

  repoRows(): Locator {
    return this.repositories.getByRole('listitem')
  }

  runRows(): Locator {
    return this.recentRuns.getByRole('listitem')
  }

  async open() {
    await this.page.goto('./')
  }

  async reload() {
    await this.page.reload()
  }

  async expectRepoOrder(names: string[]) {
    await expect(this.repoRows().getByRole('link').first()).toHaveText(names[0])
    for (const [index, name] of names.entries()) {
      await expect(
        this.repoRows().nth(index).getByRole('link').first(),
      ).toHaveText(name)
    }
  }

  async expectScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(name, { fullPage: true })
  }
}
