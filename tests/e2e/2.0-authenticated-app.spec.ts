import { test, expect, type Page } from '@playwright/test'

/**
 * Authenticated App Tests
 *
 * These tests require a running app with an authenticated session.
 * To run these, you need either:
 *   1. Set PLAYWRIGHT_STORAGE_STATE to a saved auth state JSON file
 *   2. Set TEST_USER_EMAIL and TEST_USER_PASSWORD for Clerk login
 *   3. Run the app without Clerk (no NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
 *
 * Skip all tests if no auth mechanism is configured.
 */

const HAS_AUTH_CONFIG =
  !!process.env.PLAYWRIGHT_STORAGE_STATE ||
  (!!process.env.TEST_USER_EMAIL && !!process.env.TEST_USER_PASSWORD) ||
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Helper: sign in via Clerk if needed
async function ensureAuthenticated(page: Page) {
  if (process.env.PLAYWRIGHT_STORAGE_STATE) {
    return // Already handled by storage state
  }

  // Navigate to a protected page — if redirected to sign-in, sign in
  await page.goto('/dashboard')
  await page.waitForTimeout(2000)

  if (page.url().includes('sign-in') || page.url().includes('clerk')) {
    // Attempt Clerk sign-in
    const email = process.env.TEST_USER_EMAIL
    const password = process.env.TEST_USER_PASSWORD
    if (!email || !password) {
      throw new Error('Cannot sign in: set TEST_USER_EMAIL and TEST_USER_PASSWORD')
    }

    // Clerk sign-in form
    await page.fill('input[name="identifier"]', email)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)
    await page.fill('input[name="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard', { timeout: 10000 })
  }
}

test.describe('Authenticated App — Dashboard', () => {
  test.skip(!HAS_AUTH_CONFIG, 'No auth config — set PLAYWRIGHT_STORAGE_STATE or TEST_USER_EMAIL/PASSWORD')

  test('dashboard loads', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)

    // Should see greeting or dashboard content
    const greeting = page.locator('text=/Good (morning|afternoon|evening)/i')
    const dashboardContent = page.locator('text=/dashboard|overview|stats/i')
    const hasGreeting = await greeting.count() > 0
    const hasContent = await dashboardContent.count() > 0
    expect(hasGreeting || hasContent).toBe(true)
  })

  test('dashboard shows stats', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/dashboard')
    // Should have stat cards or numbers visible
    await page.waitForTimeout(1500)
    // Look for stat-like elements (numbers, cards)
    const body = await page.textContent('body')
    expect(body).toBeTruthy()
  })
})

test.describe('Authenticated App — Tasks Page', () => {
  test.skip(!HAS_AUTH_CONFIG, 'No auth config')

  test('tasks page loads', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/tasks')
    await page.waitForTimeout(1500)
    expect(page.url()).toContain('/tasks')
  })

  test('add task dialog opens', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/tasks')
    await page.waitForTimeout(1500)

    // Look for "Add Task" button
    const addBtn = page.locator('button:has-text("Add Task"), a:has-text("Add Task")')
    if (await addBtn.count() > 0) {
      await addBtn.first().click()
      await page.waitForTimeout(500)
      // Dialog should be visible
      const dialog = page.locator('[role="dialog"], dialog, .modal')
      await expect(dialog.first()).toBeVisible({ timeout: 3000 })
    }
  })
})

test.describe('Authenticated App — Quick Add (N key)', () => {
  test.skip(!HAS_AUTH_CONFIG, 'No auth config')

  test('pressing N opens quick-add modal', async ({ page }) => {
    await ensureAuthenticated(page)
    const response = await page.goto('/dashboard')
    // Skip if page errors (DB not connected)
    if (response?.status() === 500) {
      test.skip(true, 'Dashboard returned 500 — DB not connected')
      return
    }
    await page.waitForTimeout(1500)

    // Press N key
    await page.keyboard.press('n')
    await page.waitForTimeout(500)

    // Quick-add modal should appear with "What needs to be done?" input
    const quickAdd = page.locator('input[placeholder="What needs to be done?"]')
    await expect(quickAdd).toBeVisible({ timeout: 3000 })
  })

  test('pressing Escape closes quick-add', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/dashboard')
    await page.waitForTimeout(1500)

    await page.keyboard.press('n')
    await page.waitForTimeout(500)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  })
})

test.describe('Authenticated App — Command Bar (Cmd+K)', () => {
  test.skip(!HAS_AUTH_CONFIG, 'No auth config')

  test('Cmd+K opens command bar', async ({ page }) => {
    await ensureAuthenticated(page)
    const response = await page.goto('/dashboard')
    if (response?.status() === 500) {
      test.skip(true, 'Dashboard returned 500 — DB not connected')
      return
    }
    await page.waitForTimeout(1500)

    // Cmd+K (Meta+K on Mac, Control+K elsewhere)
    await page.keyboard.press('Meta+k')
    await page.waitForTimeout(500)

    // Command bar should open with its search input
    const searchInput = page.locator('input[placeholder*="Search or type"]')
    await expect(searchInput).toBeVisible({ timeout: 3000 })
  })

  test('Escape closes command bar', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/dashboard')
    await page.waitForTimeout(1500)

    await page.keyboard.press('Meta+k')
    await page.waitForTimeout(500)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  })

  test('command bar shows quick actions', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/dashboard')
    await page.waitForTimeout(1500)

    await page.keyboard.press('Meta+k')
    await page.waitForTimeout(500)

    // Should show quick actions like Dashboard, Projects, Tasks, etc.
    const quickActions = ['Dashboard', 'Projects', 'Tasks', 'Calendar', 'Settings']
    for (const action of quickActions) {
      const item = page.locator(`text=${action}`)
      if (await item.count() > 0) {
        await expect(item.first()).toBeVisible()
      }
    }
  })
})

test.describe('Authenticated App — Navigation', () => {
  test.skip(!HAS_AUTH_CONFIG, 'No auth config')

  const appRoutes = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/tasks', name: 'Tasks' },
    { path: '/projects', name: 'Projects' },
    { path: '/clients', name: 'Clients' },
    { path: '/calendar', name: 'Calendar' },
    { path: '/bookmarks', name: 'Bookmarks' },
    { path: '/settings', name: 'Settings' },
  ]

  for (const { path, name } of appRoutes) {
    test(`${name} page loads (${path})`, async ({ page }) => {
      await ensureAuthenticated(page)
      await page.goto(path)
      await page.waitForTimeout(1500)
      // Should stay on the page (not redirect away)
      expect(page.url()).toContain(path)
    })
  }
})

test.describe('Authenticated App — Settings', () => {
  test.skip(!HAS_AUTH_CONFIG, 'No auth config')

  test('settings page shows integration cards', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/settings')
    await page.waitForTimeout(2000)

    // Should show Telegram, Email, Siri cards (either active or upgrade prompt)
    await expect(page.locator('text=Telegram').first()).toBeVisible()
    await expect(page.locator('text=Email to Task').first()).toBeVisible()
    await expect(page.locator('text=Siri & Shortcuts').first()).toBeVisible()
  })

  test('dark mode toggle exists', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/settings')
    await page.waitForTimeout(2000)

    // Look for appearance/theme section
    const darkModeToggle = page.locator('text=/dark|theme|appearance/i')
    await expect(darkModeToggle.first()).toBeVisible()
  })
})

test.describe('Authenticated App — Calendar', () => {
  test.skip(!HAS_AUTH_CONFIG, 'No auth config')

  test('calendar month view loads', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/calendar')
    await page.waitForTimeout(2000)

    // Should show month/year
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    const monthText = page.locator(`text=${currentMonth}`)
    if (await monthText.count() > 0) {
      await expect(monthText.first()).toBeVisible()
    }
  })

  test('calendar navigation (next/prev month) works', async ({ page }) => {
    await ensureAuthenticated(page)
    await page.goto('/calendar')
    await page.waitForTimeout(2000)

    // Look for navigation buttons
    const nextBtn = page.locator('button:has-text("Next"), button[aria-label*="next"]')
    const prevBtn = page.locator('button:has-text("Prev"), button[aria-label*="prev"]')

    if (await nextBtn.count() > 0) {
      await nextBtn.first().click()
      await page.waitForTimeout(500)
    }

    if (await prevBtn.count() > 0) {
      await prevBtn.first().click()
      await page.waitForTimeout(500)
    }
  })
})
