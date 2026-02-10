import { CustomerPortal } from '@polar-sh/nextjs'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (req: NextRequest) => {
    const { userId } = await auth()
    if (!userId) return ''

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { polarCustomerId: true },
    })

    return subscription?.polarCustomerId || ''
  },
  server: (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
})
