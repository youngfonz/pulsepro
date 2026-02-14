import { NextRequest, NextResponse } from 'next/server'
import { requireUserId } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    if (!process.env.POLAR_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
    }

    // Inject userId into metadata server-side so client components don't need Clerk hooks
    const userId = await requireUserId()
    const url = new URL(req.url)
    if (!url.searchParams.has('metadata[userId]')) {
      url.searchParams.set('metadata[userId]', userId)
    }
    const enrichedReq = new NextRequest(url, req)

    const { Checkout } = await import('@polar-sh/nextjs')

    const handler = Checkout({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      successUrl: process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=true`
        : '/settings?upgraded=true',
      server: (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    })

    return handler(enrichedReq)
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
