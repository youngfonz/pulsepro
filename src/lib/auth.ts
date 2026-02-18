import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

/**
 * Returns the authenticated user's Clerk ID.
 * When Clerk is disabled (no env var), returns a stable fallback ID.
 */
export async function requireUserId(): Promise<string> {
  if (!clerkEnabled) {
    return 'local-dev-user'
  }

  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return userId
}
