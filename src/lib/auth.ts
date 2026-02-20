import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export interface AuthContext {
  userId: string
  orgId: string | null
  orgRole: string | null
  /** orgId when in an org, userId when in personal workspace */
  scopeId: string
}

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

/**
 * Returns the full auth context including org info.
 * Use scopeId for data scoping — it's orgId when in an org, userId for personal workspace.
 * Use orgId to check if user is in an org context.
 * Use orgRole to check permissions (e.g., 'org:admin').
 */
export async function getAuthContext(): Promise<AuthContext> {
  if (!clerkEnabled) {
    return {
      userId: 'local-dev-user',
      orgId: null,
      orgRole: null,
      scopeId: 'local-dev-user',
    }
  }

  const { userId, orgId, orgRole } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return {
    userId,
    orgId: orgId || null,
    orgRole: orgRole || null,
    scopeId: orgId || userId,
  }
}

/**
 * Returns the Prisma where clause for scoping data to the current context.
 * In an org: { orgId }. In personal workspace: { userId }.
 */
export async function getScopeWhere(): Promise<{ userId: string } | { orgId: string }> {
  const { userId, orgId } = await getAuthContext()
  return orgId ? { orgId } : { userId }
}
