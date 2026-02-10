import { Webhooks } from '@polar-sh/nextjs'
import { prisma } from '@/lib/prisma'

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionActive: async (payload) => {
    const { customerId, id: subscriptionId } = payload.data
    const userId = payload.data.metadata?.userId as string | undefined

    if (!userId) {
      console.error('Polar webhook: missing userId in subscription metadata')
      return
    }

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        polarCustomerId: customerId,
        polarSubscriptionId: subscriptionId,
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
      },
      update: {
        polarCustomerId: customerId,
        polarSubscriptionId: subscriptionId,
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
        cancelAtPeriodEnd: false,
      },
    })
  },

  onSubscriptionCanceled: async (payload) => {
    const userId = payload.data.metadata?.userId as string | undefined
    if (!userId) return

    await prisma.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: true,
      },
    })
  },

  onSubscriptionRevoked: async (payload) => {
    const userId = payload.data.metadata?.userId as string | undefined
    if (!userId) return

    await prisma.subscription.update({
      where: { userId },
      data: {
        plan: 'free',
        status: 'canceled',
        cancelAtPeriodEnd: false,
      },
    })
  },

  onSubscriptionUpdated: async (payload) => {
    const userId = payload.data.metadata?.userId as string | undefined
    if (!userId) return

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        polarCustomerId: payload.data.customerId,
        polarSubscriptionId: payload.data.id,
        plan: 'pro',
        status: payload.data.status,
        currentPeriodEnd: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
      },
      update: {
        status: payload.data.status,
        currentPeriodEnd: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
      },
    })
  },
})
