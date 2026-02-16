'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'
import crypto from 'crypto'

export async function generateTelegramLink() {
  const userId = await requireUserId()

  // Check Pro plan
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription || subscription.plan !== 'pro') {
    return { error: 'Telegram integration is a Pro feature.' }
  }

  // Generate a random verify code
  const code = crypto.randomBytes(16).toString('hex')
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.subscription.update({
    where: { userId },
    data: {
      telegramVerifyCode: code,
      telegramVerifyExpires: expires,
    },
  })

  const botUsername = process.env.TELEGRAM_BOT_USERNAME || ''
  const link = `https://t.me/${botUsername}?start=${code}`

  return { link }
}

export async function unlinkTelegram() {
  const userId = await requireUserId()

  await prisma.subscription.update({
    where: { userId },
    data: {
      telegramChatId: null,
      telegramVerifyCode: null,
      telegramVerifyExpires: null,
      telegramRemindersEnabled: false,
    },
  })

  return { success: true }
}

export async function toggleTelegramReminders(enabled: boolean) {
  const userId = await requireUserId()

  await prisma.subscription.update({
    where: { userId },
    data: { telegramRemindersEnabled: enabled },
  })

  return { success: true }
}

export async function getTelegramSettings() {
  const userId = await requireUserId()

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) {
    return {
      plan: 'free' as const,
      linked: false,
      remindersEnabled: false,
    }
  }

  return {
    plan: subscription.plan as 'free' | 'pro',
    linked: !!subscription.telegramChatId,
    remindersEnabled: subscription.telegramRemindersEnabled,
  }
}
