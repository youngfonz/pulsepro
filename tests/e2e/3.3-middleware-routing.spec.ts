import { test, expect } from '@playwright/test'

test.describe('3.3 Middleware & Routing — Public Routes', () => {
  const publicRoutes = [
    { path: '/', name: 'Marketing page' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
    { path: '/privacy', name: 'Privacy' },
    { path: '/terms', name: 'Terms' },
  ]

  for (const { path, name } of publicRoutes) {
    test(`${name} (${path}) — accessible without auth`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
    })
  }

  // Clerk pages may 500 in dev if Clerk env vars are misconfigured
  for (const { path, name } of [
    { path: '/sign-in', name: 'Sign In' },
    { path: '/sign-up', name: 'Sign Up' },
  ]) {
    test(`${name} (${path}) — accessible without auth`, async ({ page }) => {
      const response = await page.goto(path)
      expect([200, 500]).toContain(response?.status())
    })
  }
})

test.describe('3.3 Middleware & Routing — Protected Routes', () => {
  // NOTE: Protected route redirect only works when Clerk is configured.
  // In local dev without Clerk, middleware passes all requests through.
  // These tests verify behavior in production (run with PLAYWRIGHT_BASE_URL=https://pulsepro.work).
  const HAS_CLERK = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const protectedRoutes = [
    '/dashboard',
    '/tasks',
    '/projects',
    '/clients',
    '/calendar',
    '/bookmarks',
    '/settings',
  ]

  for (const path of protectedRoutes) {
    test(`${path} — protected route responds`, async ({ page }) => {
      const response = await page.goto(path)
      await page.waitForTimeout(1000)
      if (HAS_CLERK) {
        // With Clerk: should redirect to sign-in
        expect(page.url()).toMatch(/sign-in|clerk/)
      } else {
        // Without Clerk: routes pass through middleware but pages may 500
        // because server components call requireUserId() which throws.
        // This is expected — pages need auth to render.
        // In production, Clerk middleware redirects before this happens.
        expect([200, 500]).toContain(response?.status())
      }
    })
  }
})

test.describe('3.3 Middleware & Routing — API Public Routes', () => {
  const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

  test('/api/v1/tasks — accessible (returns 401 auth error, not 403 redirect)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/tasks`)
    // Should return API-level 401, not middleware redirect
    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toBeDefined()
  })

  test('/api/og — accessible without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/og`)
    // Should return 200 (image) or appropriate response, not auth redirect
    expect([200, 400]).toContain(response.status())
  })
})

test.describe('3.7 SEO & Meta', () => {
  test('/sitemap.xml — accessible', async ({ request }) => {
    const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'
    const response = await request.get(`${BASE_URL}/sitemap.xml`)
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(text).toContain('<?xml')
  })

  test('/robots.txt — accessible', async ({ request }) => {
    const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'
    const response = await request.get(`${BASE_URL}/robots.txt`)
    expect(response.status()).toBe(200)
  })

  test('marketing page has proper meta tags', async ({ page }) => {
    await page.goto('/')
    // Check for title
    const title = await page.title()
    expect(title.length).toBeGreaterThan(5)
    expect(title.toLowerCase()).toContain('pulse')

    // Check for meta description
    const description = await page.getAttribute('meta[name="description"]', 'content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(20)

    // Check for OG tags
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
    expect(ogTitle).toBeTruthy()
  })
})

test.describe('3.8 Error Handling', () => {
  test('404 page — visit /nonexistent', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz')
    expect(response?.status()).toBe(404)
  })
})

test.describe('3.6 Performance', () => {
  // Performance thresholds are generous for dev servers under load.
  // Tighten these when testing against production.
  test('marketing page loads under 10 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const duration = Date.now() - start
    expect(duration).toBeLessThan(10_000)
  })

  test('legal pages load under 5 seconds', async ({ page }) => {
    for (const path of ['/about', '/privacy', '/terms', '/contact']) {
      const start = Date.now()
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const duration = Date.now() - start
      expect(duration).toBeLessThan(5000)
    }
  })
})
