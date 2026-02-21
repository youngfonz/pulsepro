import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Static marketing pages — bypass Clerk entirely
const bypassPaths = new Set(['/about', '/contact', '/privacy', '/terms'])

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/polar',
  '/api/cron/daily-reminder',
  '/api/webhook/telegram',
  '/api/og',
])

const clerkHandler = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export default function middleware(request: NextRequest) {
  if (bypassPaths.has(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  if (!clerkEnabled) {
    return NextResponse.next()
  }
  return clerkHandler(request, {} as any)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
