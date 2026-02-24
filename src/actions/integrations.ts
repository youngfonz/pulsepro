'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId, isAdminUser } from '@/lib/auth'
import crypto from 'crypto'

// ── Settings ────────────────────────────────────────────────────────

export async function getIntegrationSettings() {
  const userId = await requireUserId()
  const admin = isAdminUser(userId)

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) {
    return {
      plan: admin ? ('pro' as const) : ('free' as const),
      emailToken: null,
      apiToken: null,
    }
  }

  return {
    plan: (admin || subscription.plan === 'pro') ? ('pro' as const) : ('free' as const),
    emailToken: subscription.inboundEmailToken,
    apiToken: subscription.apiToken,
  }
}

// ── Email-to-Task Token ─────────────────────────────────────────────

export async function generateEmailToken() {
  const userId = await requireUserId()
  const admin = isAdminUser(userId)

  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription && admin) {
    subscription = await prisma.subscription.create({
      data: { userId, plan: 'pro' },
    })
  }

  if (!subscription || (subscription.plan !== 'pro' && !admin)) {
    return { error: 'Email-to-Task is a Pro feature.' }
  }

  if (subscription.inboundEmailToken) {
    return { token: subscription.inboundEmailToken }
  }

  const token = crypto.randomBytes(16).toString('hex')

  await prisma.subscription.update({
    where: { userId },
    data: { inboundEmailToken: token },
  })

  return { token }
}

export async function regenerateEmailToken() {
  const userId = await requireUserId()
  const admin = isAdminUser(userId)

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription || (subscription.plan !== 'pro' && !admin)) {
    return { error: 'Email-to-Task is a Pro feature.' }
  }

  const token = crypto.randomBytes(16).toString('hex')

  await prisma.subscription.update({
    where: { userId },
    data: { inboundEmailToken: token },
  })

  return { token }
}

// ── API Token (Siri / Shortcuts) ────────────────────────────────────

export async function generateApiToken() {
  const userId = await requireUserId()
  const admin = isAdminUser(userId)

  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription && admin) {
    subscription = await prisma.subscription.create({
      data: { userId, plan: 'pro' },
    })
  }

  if (!subscription || (subscription.plan !== 'pro' && !admin)) {
    return { error: 'API access is a Pro feature.' }
  }

  if (subscription.apiToken) {
    return { token: subscription.apiToken }
  }

  const token = `pp_${crypto.randomBytes(24).toString('hex')}`

  await prisma.subscription.update({
    where: { userId },
    data: { apiToken: token },
  })

  return { token }
}

export async function revokeApiToken() {
  const userId = await requireUserId()

  const subscription = await prisma.subscription.findUnique({ where: { userId } })
  if (!subscription) return { error: 'No subscription found.' }

  await prisma.subscription.update({
    where: { userId },
    data: { apiToken: null },
  })

  return { success: true }
}

export async function regenerateApiToken() {
  const userId = await requireUserId()
  const admin = isAdminUser(userId)

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription || (subscription.plan !== 'pro' && !admin)) {
    return { error: 'API access is a Pro feature.' }
  }

  const token = `pp_${crypto.randomBytes(24).toString('hex')}`

  await prisma.subscription.update({
    where: { userId },
    data: { apiToken: token },
  })

  return { token }
}
