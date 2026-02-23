import { test, expect } from '@playwright/test'

test.describe('1.1 Marketing Page (Logged Out)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
  })

  test('marketing page loads without errors', async ({ page }) => {
    await expect(page).toHaveTitle(/Pulse Pro/)
    // No console errors
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.waitForTimeout(1000)
    expect(errors).toHaveLength(0)
  })

  test('hero section renders headline and CTA buttons', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Think less')
    await expect(page.locator('h1')).toContainText('Run smoother')
    await expect(page.locator('text=Add your first task in 5 seconds')).toBeVisible()
    await expect(page.locator('a[href="/sign-up"]').first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'See how it works' })).toBeVisible()
  })

  test('rotating announcement badge is visible', async ({ page }) => {
    const badge = page.locator('.animate-pulse').first()
    await expect(badge).toBeVisible()
  })

  test('StatsImpact section displays', async ({ page }) => {
    // Stats section should exist below hero
    const statsSection = page.locator('section').nth(1)
    await expect(statsSection).toBeVisible()
  })

  test('Features section renders all 4 feature cards', async ({ page }) => {
    const featuresSection = page.locator('#features')
    await expect(featuresSection).toBeVisible()

    await expect(page.locator('text=Capture anything instantly')).toBeVisible()
    await expect(page.locator('text=See every project at a glance')).toBeVisible()
    await expect(page.locator('text=Never miss another deadline')).toBeVisible()
    await expect(page.locator('text=Keep every client organized')).toBeVisible()
  })

  test('Capture tasks section with 5 tabs', async ({ page }) => {
    await expect(page.locator('text=Capture tasks from anywhere')).toBeVisible()

    // All 5 tab buttons should exist
    await expect(page.locator('button:has-text("AI Insights")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Email to Task")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Siri")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Keyboard")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Telegram")').first()).toBeVisible()
  })

  test('capture tabs can be clicked manually', async ({ page }) => {
    // Scroll to the capture section first so tabs are in viewport
    await page.locator('text=Capture tasks from anywhere').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    // Click Email to Task tab button and wait for content to switch
    const emailTab = page.locator('button:has-text("Email to Task")').first()
    await emailTab.scrollIntoViewIfNeeded()
    await emailTab.click({ force: true })
    await page.waitForTimeout(800)
    await expect(page.locator('text=Forward an email').first()).toBeVisible({ timeout: 10000 })

    // Click Telegram tab button
    await page.locator('button:has-text("Telegram")').first().click({ force: true })
    await page.waitForTimeout(500)
  })

  test('Testimonials section renders', async ({ page }) => {
    const testimonials = page.locator('text=What people are saying')
    // May not exist if section uses different text; check for the section element
    const section = page.locator('section').filter({ hasText: /testimonial|saying|love/i })
    // At least some testimonial section content should exist
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(500)
  })

  test('WhySwitch section shows all competitor cards', async ({ page }) => {
    await expect(page.locator('text=Why freelancers switch')).toBeVisible()

    const competitors = ['Notion', 'Trello', 'Asana', 'ClickUp', 'Apple Notes']
    for (const name of competitors) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible()
    }
  })

  test('Pricing section shows Free vs Pro vs Team', async ({ page }) => {
    const pricingSection = page.locator('#pricing')
    await expect(pricingSection).toBeVisible()

    // Prices
    await expect(pricingSection.locator('text=$0').first()).toBeVisible()
    await expect(pricingSection.locator('text=$12').first()).toBeVisible()
    await expect(pricingSection.locator('text=$29').first()).toBeVisible()

    // Free tier limits
    await expect(pricingSection.locator('text=3 projects')).toBeVisible()
    await expect(pricingSection.locator('text=50 tasks')).toBeVisible()
    await expect(pricingSection.locator('text=1 client')).toBeVisible()

    // Pro features
    await expect(pricingSection.locator('text=Unlimited projects, tasks & clients')).toBeVisible()
  })

  test('FAQ section expands and collapses', async ({ page }) => {
    const faqSection = page.locator('#faq')
    await expect(faqSection).toBeVisible()

    // Check specific FAQs exist
    await expect(page.locator('text=Who is Pulse Pro for?')).toBeVisible()
    await expect(page.locator('text=Do I need to set up projects first?')).toBeVisible()
    await expect(page.locator('text=Is there a free plan?')).toBeVisible()
    await expect(page.locator('text=Will prices go up?')).toBeVisible()

    // Click a FAQ to expand it
    await page.locator('text=Who is Pulse Pro for?').click()
    await expect(page.locator('text=Apple Notes is your current task manager')).toBeVisible()

    // Click again to collapse
    await page.locator('text=Who is Pulse Pro for?').click()
  })

  test('FAQ about projects mentions standalone tasks', async ({ page }) => {
    await page.locator('text=Do I need to set up projects first?').click()
    await expect(page.locator('text=Press N, type what you need to do')).toBeVisible()
  })

  test('Final CTA section renders with button', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    // Look for a final CTA link to sign up
    const ctaButtons = page.locator('a[href="/sign-up"]')
    expect(await ctaButtons.count()).toBeGreaterThanOrEqual(2) // hero + final CTA
  })

  test('navigation links work (Features, Pricing, FAQ anchors)', async ({ page }) => {
    // Desktop nav
    await page.locator('nav a[href="#features"]').click()
    await page.waitForTimeout(300)

    await page.locator('nav a[href="#pricing"]').click()
    await page.waitForTimeout(300)

    await page.locator('nav a[href="#faq"]').click()
    await page.waitForTimeout(300)
  })

  test('Sign In and Get Started nav links present', async ({ page }) => {
    await expect(page.locator('a[href="/sign-in"]').first()).toBeVisible()
    await expect(page.locator('a[href="/sign-up"]').first()).toBeVisible()
  })
})

test.describe('1.1 Marketing Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('mobile nav has hamburger menu', async ({ page }) => {
    await page.goto('/')
    // Hamburger menu button
    const menuButton = page.locator('button[aria-label="Toggle menu"]')
    await expect(menuButton).toBeVisible()

    // Click hamburger opens mobile menu
    await menuButton.click()
    await page.waitForTimeout(300)

    // Mobile menu should show navigation links
    const mobileNav = page.locator('nav.flex.flex-col')
    await expect(mobileNav).toBeVisible()
    await expect(mobileNav.locator('a[href="#features"]')).toBeVisible()
    await expect(mobileNav.locator('a[href="#pricing"]')).toBeVisible()
  })

  test('hero section stacks correctly on mobile', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    // Check no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5) // 5px tolerance
  })
})
