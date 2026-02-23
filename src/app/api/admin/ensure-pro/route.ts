import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const userId = await requireAdmin()

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    create: { userId, plan: 'pro' },
    update: { plan: 'pro' },
  })

  return NextResponse.json({
    ok: true,
    userId,
    plan: subscription.plan,
    message: 'Subscription set to Pro',
  })
}
