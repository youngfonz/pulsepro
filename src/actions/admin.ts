'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { clerkClient } from '@clerk/nextjs/server'

export async function getAdminStats() {
  await requireAdmin()

  const clerk = await clerkClient()

  const [totalUsers, totalProjects, totalTasks, totalClients, proUsers] = await Promise.all([
    clerk.users.getCount(),
    prisma.project.count(),
    prisma.task.count({ where: { url: null } }),
    prisma.client.count(),
    prisma.subscription.count({ where: { plan: 'pro' } }),
  ])

  return { totalUsers, totalProjects, totalTasks, totalClients, proUsers }
}

export async function getAdminUsers(page = 1, limit = 50) {
  await requireAdmin()

  const clerk = await clerkClient()

  const users = await clerk.users.getUserList({
    limit,
    offset: (page - 1) * limit,
    orderBy: '-created_at',
  })

  const userIds = users.data.map(u => u.id)

  const [subscriptions, projectCounts, taskCounts, clientCounts] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId: { in: userIds } },
    }),
    prisma.project.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds } },
      _count: true,
    }),
    prisma.task.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds }, url: null },
      _count: true,
    }),
    prisma.client.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds } },
      _count: true,
    }),
  ])

  const subMap = new Map(subscriptions.map(s => [s.userId, s]))
  const projectMap = new Map(projectCounts.map(p => [p.userId!, p._count]))
  const taskMap = new Map(taskCounts.map(t => [t.userId!, t._count]))
  const clientMap = new Map(clientCounts.map(c => [c.userId!, c._count]))

  return {
    users: users.data.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      plan: (subMap.get(user.id)?.plan as string) ?? 'free',
      status: (subMap.get(user.id)?.status as string) ?? 'active',
      projectCount: projectMap.get(user.id) ?? 0,
      taskCount: taskMap.get(user.id) ?? 0,
      clientCount: clientMap.get(user.id) ?? 0,
    })),
    totalCount: users.totalCount,
  }
}
