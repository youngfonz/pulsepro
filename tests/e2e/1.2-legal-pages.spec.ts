import { test, expect } from '@playwright/test'

test.describe('1.2 Legal & Info Pages', () => {
  const pages = [
    { path: '/about', title: 'About' },
    { path: '/privacy', title: 'Privacy' },
    { path: '/terms', title: 'Terms' },
    { path: '/contact', title: 'Contact' },
  ]

  for (const { path, title } of pages) {
    test(`${path} — page loads`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      // Page should have some content
      const bodyText = await page.textContent('body')
      expect(bodyText?.length).toBeGreaterThan(50)
    })
  }
})
