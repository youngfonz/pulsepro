'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId, getAuthContext } from '@/lib/auth'
import { requireProjectAccess } from '@/lib/access'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function grantProjectAccess(
  projectId: string,
  targetUserId: string,
  role: 'viewer' | 'editor' | 'manager'
) {
  await requireProjectAccess(projectId, 'manager')
  const userId = await requireUserId()

  if (targetUserId === userId) throw new Error('Cannot grant access to yourself')

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, userId: true },
  })
  if (!project) throw new Error('Project not found')
  if (targetUserId === project.userId) throw new Error('User is already the project owner')

  await prisma.projectAccess.upsert({
    where: { projectId_userId: { projectId, userId: targetUserId } },
    create: { projectId, userId: targetUserId, role, grantedBy: userId },
    update: { role },
  })

  revalidatePath(`/projects/${projectId}`)
}

export async function revokeProjectAccess(
  projectId: string,
  targetUserId: string
) {
  await requireProjectAccess(projectId, 'manager')

  await prisma.projectAccess.deleteMany({
    where: { projectId, userId: targetUserId },
  })

  revalidatePath(`/projects/${projectId}`)
}

export async function getProjectMembers(projectId: string) {
  await requireProjectAccess(projectId, 'viewer')

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true },
  })
  if (!project) return { owner: null, members: [] }

  const accessRecords = await prisma.projectAccess.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  })

  const allUserIds = [project.userId, ...accessRecords.map(r => r.userId)].filter(Boolean) as string[]
  const uniqueIds = [...new Set(allUserIds)]

  const clerk = await clerkClient()
  const users = await clerk.users.getUserList({
    userId: uniqueIds,
    limit: uniqueIds.length,
  })
  const userMap = new Map(users.data.map(u => [u.id, {
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.emailAddresses[0]?.emailAddress || 'Unknown',
    email: u.emailAddresses[0]?.emailAddress ?? '',
    imageUrl: u.imageUrl,
  }]))

  return {
    owner: userMap.get(project.userId!) ?? null,
    members: accessRecords.map(r => ({
      userId: r.userId,
      role: r.role,
      createdAt: r.createdAt,
      user: userMap.get(r.userId) ?? { id: r.userId, name: 'Unknown', email: '', imageUrl: '' },
    })),
  }
}

export async function getOrgMembers() {
  const { orgId } = await getAuthContext()
  if (!orgId) return []

  const clerk = await clerkClient()
  const memberships = await clerk.organizations.getOrganizationMembershipList({
    organizationId: orgId,
    limit: 100,
  })

  return memberships.data.map(m => ({
    userId: m.publicUserData?.userId ?? '',
    name: [m.publicUserData?.firstName, m.publicUserData?.lastName].filter(Boolean).join(' ') || 'Unknown',
    email: m.publicUserData?.identifier ?? '',
    imageUrl: m.publicUserData?.imageUrl ?? '',
    role: m.role,
  })).filter(m => m.userId)
}
