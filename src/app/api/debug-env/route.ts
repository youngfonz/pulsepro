import { NextResponse } from 'next/server'

export async function GET() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return NextResponse.json({
    hasClerkKey: !!clerkKey,
    keyPrefix: clerkKey ? clerkKey.substring(0, 10) + '...' : null,
    keyLength: clerkKey?.length || 0,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('CLERK')).sort()
  })
}
