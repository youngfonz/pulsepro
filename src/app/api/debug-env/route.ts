import { NextResponse } from 'next/server'

export async function GET() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const allKeys = Object.keys(process.env)

  return NextResponse.json({
    hasClerkKey: !!clerkKey,
    keyPrefix: clerkKey ? clerkKey.substring(0, 10) + '...' : null,
    keyLength: clerkKey?.length || 0,
    clerkKeys: allKeys.filter(k => k.includes('CLERK')).sort(),
    nextPublicKeys: allKeys.filter(k => k.startsWith('NEXT_PUBLIC')).sort(),
    totalEnvVars: allKeys.length
  })
}
