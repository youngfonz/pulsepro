import { auth } from '@clerk/nextjs/server'

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
    throw new Error('Unauthorized')
  }

  return userId
}
