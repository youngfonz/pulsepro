import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { polarCustomerId: true },
  })

  let customerId = subscription?.polarCustomerId

  // If no Polar customer ID stored, try to find the customer in Polar by email
  if (!customerId) {
    try {
      const clerk = await clerkClient()
      const user = await clerk.users.getUser(userId)
      const email = user.emailAddresses[0]?.emailAddress

      if (email) {
        const res = await fetch(
          `https://api.polar.sh/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
            },
          }
        )

        if (res.ok) {
          const data = await res.json()
          const polarCustomer = data.items?.[0]
          if (polarCustomer?.id) {
            customerId = polarCustomer.id

            // Save it so we don't have to look it up again
            if (subscription) {
              await prisma.subscription.update({
                where: { userId },
                data: { polarCustomerId: customerId },
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to look up Polar customer:', error)
    }
  }

  if (!customerId) {
    return NextResponse.redirect(new URL('/settings?billing=no-portal', req.url))
  }

  const { CustomerPortal } = await import('@polar-sh/nextjs')

  const handler = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    getCustomerId: async () => customerId!,
    server: (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  })

  return handler(req)
}
