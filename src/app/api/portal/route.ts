import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  // Check if the user has a Polar customer ID before calling the portal
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { polarCustomerId: true },
  })

  if (!subscription?.polarCustomerId) {
    // No Polar customer ID — redirect to settings with an error indicator
    // This happens when the subscription was created manually or the webhook didn't fire
    return NextResponse.redirect(new URL('/settings?billing=no-portal', req.url))
  }

  const { CustomerPortal } = await import('@polar-sh/nextjs')

  const handler = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    getCustomerId: async () => subscription.polarCustomerId!,
    server: (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  })

  return handler(req)
}
