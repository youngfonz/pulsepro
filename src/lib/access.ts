import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'

export type ProjectRole = 'owner' | 'manager' | 'editor' | 'viewer'

const roleHierarchy: Record<ProjectRole, number> = {
  viewer: 0,
  editor: 1,
  manager: 2,
  owner: 3,
}

/**
 * Get all project IDs the current user can access via ProjectAccess.
 * Does NOT include projects the user owns (those use userId in WHERE).
 * Returns [] if user has no shared projects.
 */
export async function getAccessibleProjectIds(): Promise<string[]> {
  const userId = await requireUserId()
  const records = await prisma.projectAccess.findMany({
    where: { userId },
    select: { projectId: true },
  })
  return records.map(r => r.projectId)
}

/**
 * Get the user's role on a specific project.
 * Returns 'owner' if the user is the project creator.
 * Returns the ProjectAccess role if shared.
 * Returns null if no access.
 */
export async function getProjectRole(projectId: string): Promise<ProjectRole | null> {
  const userId = await requireUserId()

  // Check ownership first (fast path)
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (project) return 'owner'

  // Check ProjectAccess
  const access = await prisma.projectAccess.findUnique({
    where: { projectId_userId: { projectId, userId } },
    select: { role: true },
  })

  if (!access) return null
  const validRoles = new Set(['viewer', 'editor', 'manager'])
  if (!validRoles.has(access.role)) return null
  return access.role as ProjectRole
}

/**
 * Check if user can access a project (owner OR has ProjectAccess).
 */
export async function canAccessProject(projectId: string): Promise<boolean> {
  const role = await getProjectRole(projectId)
  return role !== null
}

/**
 * Require minimum role on a project. Throws if insufficient.
 */
export async function requireProjectAccess(
  projectId: string,
  minRole: ProjectRole = 'viewer'
): Promise<ProjectRole> {
  const role = await getProjectRole(projectId)
  if (!role) throw new Error('Access denied')

  if (roleHierarchy[role] < roleHierarchy[minRole]) {
    throw new Error('Insufficient permissions')
  }

  return role
}

/**
 * Build a Prisma WHERE clause that includes owned + shared projects.
 * If no shared projects exist, returns simple { userId } (identical to pre-teams behavior).
 */
export async function getProjectWhereWithAccess(): Promise<Record<string, unknown>> {
  const userId = await requireUserId()
  const sharedIds = await getAccessibleProjectIds()

  if (sharedIds.length === 0) {
    return { userId }
  }

  return {
    OR: [
      { userId },
      { id: { in: sharedIds } },
    ]
  }
}
