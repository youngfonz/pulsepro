import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'

export async function OPTIONS() { return handleCors() }

interface SearchResult {
  id: string
  title: string
  subtitle: string
  href: string
  type: 'project' | 'task' | 'client' | 'bookmark'
  priority?: string
  status?: string
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth

    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Get shared project IDs
    const sharedAccess = await prisma.projectAccess.findMany({
      where: { userId },
      select: { projectId: true },
    })
    const sharedIds = sharedAccess.map(r => r.projectId)

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
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
        select: {
          id: true, name: true, status: true, priority: true,
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
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
        select: {
          id: true, title: true, priority: true, status: true,
          project: { select: { id: true, name: true } },
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),

      prisma.client.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, company: true, status: true },
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
                { title: { contains: query, mode: 'insensitive' } },
                { url: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
        select: {
          id: true, title: true, url: true, bookmarkType: true,
          project: { select: { id: true, name: true } },
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
    ])

    const results: SearchResult[] = []

    for (const p of projects) {
      results.push({
        id: p.id, title: p.name, subtitle: p.client.name,
        href: `/projects/${p.id}`, type: 'project',
        status: p.status, priority: p.priority,
      })
    }

    for (const t of tasks) {
      results.push({
        id: t.id, title: t.title, subtitle: t.project?.name ?? 'Quick task',
        href: t.project ? `/projects/${t.project.id}` : `/tasks/${t.id}`, type: 'task',
        priority: t.priority, status: t.status === 'done' ? 'completed' : undefined,
      })
    }

    for (const c of clients) {
      results.push({
        id: c.id, title: c.name, subtitle: c.company || 'Client',
        href: `/clients/${c.id}`, type: 'client', status: c.status,
      })
    }

    for (const b of bookmarks) {
      results.push({
        id: b.id, title: b.title,
        subtitle: b.project?.name ?? 'Quick task',
        href: b.url || (b.project ? `/projects/${b.project.id}` : `/tasks/${b.id}`),
        type: 'bookmark',
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('API v1/search error:', error)
    return apiError('Internal error', 500)
  }
}
