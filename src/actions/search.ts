'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'

export interface SearchResult {
  id: string
  title: string
  subtitle: string
  href: string
  type: 'project' | 'task' | 'client' | 'bookmark'
  priority?: string
  status?: string
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const userId = await requireUserId()
  const trimmed = query.trim()

  if (!trimmed || trimmed.length < 2) return []

  const { getAccessibleProjectIds } = await import('@/lib/access')
  const sharedIds = await getAccessibleProjectIds()
  const ownerFilter = sharedIds.length > 0
    ? { OR: [{ userId }, { id: { in: sharedIds } }] }
    : { userId }
  const taskOwnerFilter = sharedIds.length > 0
    ? { OR: [{ userId }, { projectId: { in: sharedIds } }] }
    : { userId }

  const [projects, tasks, clients, bookmarks] = await Promise.all([
    prisma.project.findMany({
      where: {
        AND: [
          ownerFilter,
          {
            OR: [
              { name: { contains: trimmed, mode: 'insensitive' } },
              { description: { contains: trimmed, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        priority: true,
        client: { select: { name: true } },
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),

    prisma.task.findMany({
      where: {
        AND: [
          taskOwnerFilter,
          { url: null },
          {
            OR: [
              { title: { contains: trimmed, mode: 'insensitive' } },
              { description: { contains: trimmed, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        priority: true,
        completed: true,
        project: { select: { id: true, name: true } },
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),

    prisma.client.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: trimmed, mode: 'insensitive' } },
          { company: { contains: trimmed, mode: 'insensitive' } },
          { email: { contains: trimmed, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        company: true,
        status: true,
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),

    prisma.task.findMany({
      where: {
        AND: [
          taskOwnerFilter,
          { url: { not: null } },
          {
            OR: [
              { title: { contains: trimmed, mode: 'insensitive' } },
              { url: { contains: trimmed, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        url: true,
        bookmarkType: true,
        project: { select: { id: true, name: true } },
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),
  ])

  const results: SearchResult[] = []

  for (const p of projects) {
    results.push({
      id: p.id,
      title: p.name,
      subtitle: p.client.name,
      href: `/projects/${p.id}`,
      type: 'project',
      status: p.status,
      priority: p.priority,
    })
  }

  for (const t of tasks) {
    results.push({
      id: t.id,
      title: t.title,
      subtitle: t.project?.name ?? 'Quick task',
      href: t.project ? `/projects/${t.project.id}` : `/tasks/${t.id}`,
      type: 'task',
      priority: t.priority,
      status: t.completed ? 'completed' : undefined,
    })
  }

  for (const c of clients) {
    results.push({
      id: c.id,
      title: c.name,
      subtitle: c.company || 'Client',
      href: `/clients/${c.id}`,
      type: 'client',
      status: c.status,
    })
  }

  for (const b of bookmarks) {
    results.push({
      id: b.id,
      title: b.title,
      subtitle: b.project?.name ?? 'Quick task',
      href: b.url || (b.project ? `/projects/${b.project.id}` : `/tasks/${b.id}`),
      type: 'bookmark',
    })
  }

  return results
}
