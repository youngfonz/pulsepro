'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'

export async function getDashboardStats() {
  try {
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
      prisma.task.count({ where: { userId, url: null } }),
      prisma.task.count({ where: { userId, url: null, completed: false } }),
    ])

    return {
      totalClients,
      activeClients,
      totalProjects,
      activeProjects,
      totalTasks,
      pendingTasks,
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return {
      totalClients: 0,
      activeClients: 0,
      totalProjects: 0,
      activeProjects: 0,
      totalTasks: 0,
      pendingTasks: 0,
    }
  }
}

export async function getProjectsDueThisWeek() {
  try {
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
  } catch (error) {
    console.error('Failed to fetch projects due this week:', error)
    return []
  }
}

export async function getTasksDueToday() {
  try {
    const userId = await requireUserId()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return prisma.task.findMany({
      where: {
        userId,
        url: null,
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
  } catch (error) {
    console.error('Failed to fetch tasks due today:', error)
    return []
  }
}

export async function getOverdueTasks() {
  try {
    const userId = await requireUserId()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return prisma.task.findMany({
      where: {
        userId,
        url: null,
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
  } catch (error) {
    console.error('Failed to fetch overdue tasks:', error)
    return []
  }
}

export async function getRecentProjects() {
  try {
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
  } catch (error) {
    console.error('Failed to fetch recent projects:', error)
    return []
  }
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
  try {
    const userId = await requireUserId()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)

    return prisma.task.count({
      where: {
        userId,
        url: null,
        completed: false,
        dueDate: {
          gte: today,
          lte: weekFromNow,
        },
      },
    })
  } catch (error) {
    console.error('Failed to count tasks due this week:', error)
    return 0
  }
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
  try {
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
  } catch (error) {
    console.error('Failed to fetch recently viewed items:', error)
    return []
  }
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
    console.info(`Backfilled ${clients.count} clients, ${projects.count} projects, ${tasks.count} tasks to user ${userId}`)
  }

  return total
}

// --- Project Health Scores ---

export type ProjectHealth = {
  projectId: string
  projectName: string
  clientName: string
  score: number
  label: 'healthy' | 'at_risk' | 'critical' | 'completed'
  href: string
  overdueTasks: number
  totalTasks: number
  completedTasks: number
}

export async function getProjectHealth(): Promise<ProjectHealth[]> {
  try {
    const userId = await requireUserId()
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const projects = await prisma.project.findMany({
      where: { userId, status: { notIn: ['completed'] } },
      include: {
        client: { select: { name: true } },
        tasks: {
          where: { url: null },
          select: { completed: true, dueDate: true, priority: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    const results: ProjectHealth[] = projects.map((project) => {
      const total = project.tasks.length
      const completed = project.tasks.filter((t) => t.completed).length
      const overdue = project.tasks.filter(
        (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now
      ).length

      if (total === 0) {
        return {
          projectId: project.id,
          projectName: project.name,
          clientName: project.client.name,
          score: 80,
          label: 'healthy' as const,
          href: `/projects/${project.id}`,
          overdueTasks: 0,
          totalTasks: 0,
          completedTasks: 0,
        }
      }

      let score = 100

      // Overdue penalty: up to 40 points
      const overdueRatio = overdue / total
      score -= Math.round(overdueRatio * 40)

      // Staleness penalty: up to 20 points
      const daysSinceUpdate = Math.floor(
        (now.getTime() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceUpdate > 14) score -= 20
      else if (daysSinceUpdate > 7) score -= 10
      else if (daysSinceUpdate > 3) score -= 5

      // Deadline risk: up to 20 points
      if (project.dueDate) {
        const daysUntilDue = Math.floor(
          (new Date(project.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
        const completionRatio = completed / total
        if (daysUntilDue < 0) {
          score -= 20 // project itself is overdue
        } else if (daysUntilDue <= 3 && completionRatio < 0.5) {
          score -= 15
        } else if (daysUntilDue <= 7 && completionRatio < 0.3) {
          score -= 10
        }
      }

      // Completion bonus: up to 10 points
      const completionRatio = completed / total
      score += Math.round(completionRatio * 10)

      score = Math.max(0, Math.min(100, score))

      const label: ProjectHealth['label'] =
        score >= 70 ? 'healthy' : score >= 40 ? 'at_risk' : 'critical'

      return {
        projectId: project.id,
        projectName: project.name,
        clientName: project.client.name,
        score,
        label,
        href: `/projects/${project.id}`,
        overdueTasks: overdue,
        totalTasks: total,
        completedTasks: completed,
      }
    })

    // Also add completed projects
    const completedProjects = await prisma.project.findMany({
      where: { userId, status: 'completed' },
      include: {
        client: { select: { name: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    })

    for (const p of completedProjects) {
      results.push({
        projectId: p.id,
        projectName: p.name,
        clientName: p.client.name,
        score: 100,
        label: 'completed',
        href: `/projects/${p.id}`,
        overdueTasks: 0,
        totalTasks: p._count.tasks,
        completedTasks: p._count.tasks,
      })
    }

    // Sort: critical first, then at_risk, then healthy, then completed
    const order = { critical: 0, at_risk: 1, healthy: 2, completed: 3 }
    return results.sort((a, b) => order[a.label] - order[b.label] || a.score - b.score)
  } catch (error) {
    console.error('Failed to compute project health:', error)
    return []
  }
}

// --- Smart Insights ---

export type Insight = {
  id: string
  color: 'red' | 'amber' | 'blue' | 'green'
  message: string
  href: string
}

export async function getSmartInsights(): Promise<Insight[]> {
  try {
    const userId = await requireUserId()
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekFromNow = new Date(now)
    weekFromNow.setDate(weekFromNow.getDate() + 7)

    const [
      overdueTasks,
      highPriorityDueSoon,
      staleProjects,
      completedThisWeek,
      totalPending,
    ] = await Promise.all([
      // Overdue tasks grouped by project
      prisma.task.findMany({
        where: { userId, completed: false, url: null, dueDate: { lt: now } },
        include: { project: { select: { id: true, name: true } } },
      }),
      // High priority tasks due today or tomorrow
      prisma.task.findMany({
        where: {
          userId,
          completed: false,
          url: null,
          priority: 'high',
          dueDate: { gte: now, lt: new Date(tomorrow.getTime() + 86400000) },
        },
        select: { id: true, title: true },
      }),
      // Projects not updated in 10+ days
      prisma.project.findMany({
        where: {
          userId,
          status: { notIn: ['completed'] },
          updatedAt: { lt: new Date(now.getTime() - 10 * 86400000) },
        },
        select: { id: true, name: true, updatedAt: true },
        take: 3,
      }),
      // Tasks completed this week
      prisma.task.count({
        where: { userId, completed: true, url: null, updatedAt: { gte: weekAgo } },
      }),
      // Total pending tasks
      prisma.task.count({
        where: { userId, completed: false, url: null },
      }),
    ])

    const insights: Insight[] = []

    // 1. Overdue tasks by project (critical)
    const overdueByProject: Record<string, { name: string; id: string; count: number }> = {}
    for (const t of overdueTasks) {
      if (!overdueByProject[t.project.id]) {
        overdueByProject[t.project.id] = { name: t.project.name, id: t.project.id, count: 0 }
      }
      overdueByProject[t.project.id].count++
    }
    const worstProject = Object.values(overdueByProject).sort((a, b) => b.count - a.count)[0]
    if (worstProject) {
      insights.push({
        id: 'overdue-project',
        color: 'red',
        message: `${worstProject.name} has ${worstProject.count} overdue task${worstProject.count > 1 ? 's' : ''} — needs attention`,
        href: `/projects/${worstProject.id}`,
      })
    }

    // 2. High priority tasks due soon
    if (highPriorityDueSoon.length > 0) {
      insights.push({
        id: 'high-priority-soon',
        color: 'blue',
        message: `${highPriorityDueSoon.length} high-priority task${highPriorityDueSoon.length > 1 ? 's' : ''} due in the next 2 days — start here`,
        href: '/tasks',
      })
    }

    // 3. Stale projects
    if (staleProjects.length > 0) {
      const stalest = staleProjects[0]
      const daysStale = Math.floor(
        (now.getTime() - new Date(stalest.updatedAt).getTime()) / 86400000
      )
      insights.push({
        id: 'stale-project',
        color: 'amber',
        message: `${stalest.name} hasn't been updated in ${daysStale} days`,
        href: `/projects/${stalest.id}`,
      })
    }

    // 4. Weekly progress
    if (completedThisWeek > 0) {
      insights.push({
        id: 'weekly-progress',
        color: 'green',
        message: `You completed ${completedThisWeek} task${completedThisWeek > 1 ? 's' : ''} this week — nice momentum`,
        href: '/tasks',
      })
    }

    // 5. All clear
    if (insights.length === 0) {
      if (totalPending === 0) {
        insights.push({
          id: 'all-done',
          color: 'green',
          message: 'All tasks complete — time to plan what\'s next',
          href: '/projects',
        })
      } else {
        insights.push({
          id: 'on-track',
          color: 'green',
          message: 'No overdue tasks — you\'re on track',
          href: '/dashboard',
        })
      }
    }

    return insights.slice(0, 3)
  } catch (error) {
    console.error('Failed to generate insights:', error)
    return []
  }
}
