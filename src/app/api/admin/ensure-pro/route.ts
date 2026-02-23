import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!isAdminUser(userId)) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

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
  } catch (error) {
    console.error('ensure-pro error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Internal error', detail: message }, { status: 500 })
  }
}
