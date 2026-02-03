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
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })
}
