import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

test.describe('3.2 API Security', () => {
  test('POST /api/v1/tasks without auth header — returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      data: { title: 'Test task' },
    })
    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toBe('Missing or invalid Authorization header')
  })

  test('POST /api/v1/tasks with invalid token — returns 401 or 500', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: { Authorization: 'Bearer invalid_token_12345' },
      data: { title: 'Test task' },
    })
    // 401 in production (Prisma connected), 500 if DB unavailable in dev
    expect([401, 500]).toContain(response.status())
  })

  test('GET /api/v1/tasks without auth header — returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/tasks`)
    expect(response.status()).toBe(401)
  })

  test('GET /api/v1/tasks with invalid token — returns 401 or 500', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/tasks`, {
      headers: { Authorization: 'Bearer invalid_token_12345' },
    })
    // 401 in production, 500 if DB unavailable in dev
    expect([401, 500]).toContain(response.status())
  })

  test('POST /api/v1/tasks with fake token — rejects (401 or 500)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: { Authorization: 'Bearer pp_test' },
      data: {},
    })
    // Auth check should reject — 401 with DB, 500 without
    expect([401, 500]).toContain(response.status())
  })

  test('POST /api/v1/tasks with Bearer but empty token — returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: { Authorization: 'Bearer ' },
      data: { title: 'Test' },
    })
    expect(response.status()).toBe(401)
  })

  test('POST /api/v1/tasks with wrong auth scheme — returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: { Authorization: 'Basic dXNlcjpwYXNz' },
      data: { title: 'Test' },
    })
    expect(response.status()).toBe(401)
  })
})

test.describe('3.2 API Security — Webhook Endpoints', () => {
  test('POST /api/webhook/email with no valid token — handles gracefully', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/webhook/email`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        from: 'test@example.com',
        to: 'invalid@in.pulsepro.work',
        subject: 'Test',
        text: 'Test body',
      },
    })
    // Should not be 500 — should handle gracefully
    expect(response.status()).not.toBe(500)
  })

  test('POST /api/cron/daily-reminder without CRON_SECRET — returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/cron/daily-reminder`)
    // Should reject without proper auth
    expect([401, 403, 405]).toContain(response.status())
  })
})

test.describe('3.2 API Security — With Valid Token (conditional)', () => {
  const API_TOKEN = process.env.TEST_API_TOKEN

  test.skip(!API_TOKEN, 'Requires TEST_API_TOKEN env var')

  test('POST /api/v1/tasks with valid token and title — returns 201', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: { title: 'E2E Test Task' },
    })
    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.task).toBeDefined()
    expect(body.task.title).toBe('E2E Test Task')
    expect(body.task.id).toBeDefined()
  })

  test('POST with priority and dueDate — returns correct values', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        title: 'E2E Priority Task',
        priority: 'high',
        dueDate: '2026-03-01',
        description: 'Test description',
      },
    })
    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.task.priority).toBe('high')
    expect(body.task.description).toBe('Test description')
    expect(body.task.dueDate).toContain('2026-03-01')
  })

  test('POST with invalid priority — defaults to medium', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: { title: 'E2E Default Priority', priority: 'urgent' },
    })
    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.task.priority).toBe('medium')
  })

  test('POST with empty title — returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: { title: '' },
    })
    expect(response.status()).toBe(400)
  })

  test('POST with no title field — returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/tasks`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: { description: 'No title' },
    })
    expect(response.status()).toBe(400)
  })

  test('GET /api/v1/tasks — returns task list', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/tasks`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.tasks).toBeDefined()
    expect(Array.isArray(body.tasks)).toBe(true)
  })

  test('GET with limit=2 — returns max 2 tasks', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/tasks?limit=2`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.tasks.length).toBeLessThanOrEqual(2)
  })

  test('GET with status filter — filters correctly', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/tasks?status=todo`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })
    expect(response.status()).toBe(200)
    const body = await response.json()
    for (const task of body.tasks) {
      expect(task.status).toBe('todo')
    }
  })
})
