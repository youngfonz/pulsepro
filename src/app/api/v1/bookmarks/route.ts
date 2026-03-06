import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'

export async function OPTIONS() { return handleCors() }

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth

    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const projectId = url.searchParams.get('projectId')
    const bookmarkType = url.searchParams.get('bookmarkType')
    const sort = url.searchParams.get('sort')

    // Get shared project IDs
    const sharedAccess = await prisma.projectAccess.findMany({
      where: { userId },
      select: { projectId: true },
    })
    const sharedIds = sharedAccess.map(r => r.projectId)

    const ownershipFilter = sharedIds.length > 0
      ? { OR: [{ userId }, { projectId: { in: sharedIds } }] }
      : { userId }

    const where: Record<string, unknown> = {
      ...ownershipFilter,
      url: { not: null },
    }

    if (search) {
      where.AND = [
        { url: { not: null } },
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } },
          ],
        },
      ]
      delete where.url
    }

    if (projectId && projectId !== 'all') {
      where.projectId = projectId
    }

    if (bookmarkType && bookmarkType !== 'all') {
      where.bookmarkType = bookmarkType
    }

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }
    switch (sort) {
      case 'oldest': orderBy = { createdAt: 'asc' }; break
      case 'title': orderBy = { title: 'asc' }; break
    }

    const bookmarks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy,
      take: 200,
    })

    if (sort === 'project') {
      bookmarks.sort((a, b) => (a.project?.name ?? '').localeCompare(b.project?.name ?? ''))
    }

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('API v1/bookmarks error:', error)
    return apiError('Internal error', 500)
  }
}
