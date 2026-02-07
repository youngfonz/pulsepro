'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  const [
    totalClients,
    activeClients,
    totalProjects,
    activeProjects,
    totalTasks,
    pendingTasks,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { status: 'active' } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: { in: ['in_progress', 'not_started'] } } }),
    prisma.task.count(),
    prisma.task.count({ where: { completed: false } }),
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  return prisma.project.findMany({
    where: {
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.task.findMany({
    where: {
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.task.findMany({
    where: {
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
  return prisma.project.findMany({
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
    return await prisma.client.count()
  } catch (error) {
    // Return 0 if database is not available (e.g., during build time)
    return 0
  }
}

export async function getTasksDueThisWeek() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  return prisma.task.count({
    where: {
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
  const [projects, tasks, bookmarks] = await Promise.all([
    // Recent projects
    prisma.project.findMany({
      include: { client: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    // Recent tasks (non-bookmark)
    prisma.task.findMany({
      where: { url: null },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    // Recent bookmarks
    prisma.task.findMany({
      where: { url: { not: null } },
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
