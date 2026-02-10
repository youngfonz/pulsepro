'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'

export async function getDashboardStats() {
  const userId = await requireUserId()
  const [
    totalClients,
    activeClients,
    totalProjects,
    activeProjects,
    totalTasks,
    pendingTasks,
  ] = await Promise.all([
    prisma.client.count({ where: { userId } }),
    prisma.client.count({ where: { userId, status: 'active' } }),
    prisma.project.count({ where: { userId } }),
    prisma.project.count({ where: { userId, status: { in: ['in_progress', 'not_started'] } } }),
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, completed: false } }),
  ])

  return {
    totalClients,
    activeClients,
    totalProjects,
    activeProjects,
    totalTasks,
    pendingTasks,
  }
}

export async function getProjectsDueThisWeek() {
  const userId = await requireUserId()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  return prisma.project.findMany({
    where: {
      userId,
      status: { notIn: ['completed'] },
      dueDate: {
        gte: today,
        lte: weekFromNow,
      },
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { dueDate: 'asc' },
    take: 5,
  })
}

export async function getTasksDueToday() {
  const userId = await requireUserId()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.task.findMany({
    where: {
      userId,
      completed: false,
      dueDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { priority: 'desc' },
    take: 10,
  })
}

export async function getOverdueTasks() {
  const userId = await requireUserId()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.task.findMany({
    where: {
      userId,
      completed: false,
      dueDate: {
        lt: today,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { dueDate: 'asc' },
    take: 5,
  })
}

export async function getRecentProjects() {
  const userId = await requireUserId()
  return prisma.project.findMany({
    where: { userId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
}

export async function getClientCount() {
  try {
    const userId = await requireUserId()
    return await prisma.client.count({ where: { userId } })
  } catch (error) {
    // Return 0 if database is not available (e.g., during build time)
    return 0
  }
}

export async function getTasksDueThisWeek() {
  const userId = await requireUserId()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  return prisma.task.count({
    where: {
      userId,
      completed: false,
      dueDate: {
        gte: today,
        lte: weekFromNow,
      },
    },
  })
}

export type RecentItem = {
  id: string
  type: 'project' | 'task' | 'bookmark'
  title: string
  subtitle: string
  status?: string
  priority?: string
  href: string
  updatedAt: Date
}

export async function getRecentlyViewed(): Promise<RecentItem[]> {
  const userId = await requireUserId()
  const [projects, tasks, bookmarks] = await Promise.all([
    // Recent projects
    prisma.project.findMany({
      where: { userId },
      include: { client: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    // Recent tasks (non-bookmark)
    prisma.task.findMany({
      where: { userId, url: null },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    // Recent bookmarks
    prisma.task.findMany({
      where: { userId, url: { not: null } },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])

  const items: RecentItem[] = [
    ...projects.map((p) => ({
      id: p.id,
      type: 'project' as const,
      title: p.name,
      subtitle: p.client.name,
      status: p.status,
      href: `/projects/${p.id}`,
      updatedAt: p.updatedAt,
    })),
    ...tasks.map((t) => ({
      id: t.id,
      type: 'task' as const,
      title: t.title,
      subtitle: t.project.name,
      priority: t.priority,
      href: `/projects/${t.project.id}`,
      updatedAt: t.updatedAt,
    })),
    ...bookmarks.map((b) => ({
      id: b.id,
      type: 'bookmark' as const,
      title: b.title,
      subtitle: b.project.name,
      href: `/projects/${b.project.id}`,
      updatedAt: b.updatedAt,
    })),
  ]

  // Sort by most recent and take top 8
  return items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 8)
}

/**
 * One-time backfill: assigns all records with userId=null to the current user.
 * Safe to call multiple times — does nothing if no orphaned records exist.
 */
export async function backfillUserId() {
  const userId = await requireUserId()

  const [clients, projects, tasks] = await Promise.all([
    prisma.client.updateMany({ where: { userId: null }, data: { userId } }),
    prisma.project.updateMany({ where: { userId: null }, data: { userId } }),
    prisma.task.updateMany({ where: { userId: null }, data: { userId } }),
  ])

  const total = clients.count + projects.count + tasks.count
  if (total > 0) {
    console.log(`Backfilled ${clients.count} clients, ${projects.count} projects, ${tasks.count} tasks to user ${userId}`)
  }

  return total
}
