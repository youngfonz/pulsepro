import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'

export async function OPTIONS() { return handleCors() }

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth

    // Get shared project IDs
    const sharedAccess = await prisma.projectAccess.findMany({
      where: { userId },
      select: { projectId: true },
    })
    const sharedIds = sharedAccess.map(r => r.projectId)

    // Stats
    const [
      totalClients,
      activeClients,
      ownedTotalProjects,
      ownedActiveProjects,
      ownedTotalTasks,
      ownedPendingTasks,
    ] = await Promise.all([
      prisma.client.count({ where: { userId } }),
      prisma.client.count({ where: { userId, status: 'active' } }),
      prisma.project.count({ where: { userId } }),
      prisma.project.count({ where: { userId, status: { in: ['in_progress', 'not_started'] } } }),
      prisma.task.count({ where: { userId, url: null } }),
      prisma.task.count({ where: { userId, url: null, status: { not: 'done' } } }),
    ])

    let totalProjects = ownedTotalProjects
    let activeProjects = ownedActiveProjects
    let totalTasks = ownedTotalTasks
    let pendingTasks = ownedPendingTasks

    if (sharedIds.length > 0) {
      const [sharedProjects, sharedActive, sharedTasks, sharedPending] = await Promise.all([
        prisma.project.count({ where: { id: { in: sharedIds } } }),
        prisma.project.count({ where: { id: { in: sharedIds }, status: { in: ['in_progress', 'not_started'] } } }),
        prisma.task.count({ where: { projectId: { in: sharedIds }, url: null } }),
        prisma.task.count({ where: { projectId: { in: sharedIds }, url: null, status: { not: 'done' } } }),
      ])
      totalProjects += sharedProjects
      activeProjects += sharedActive
      totalTasks += sharedTasks
      pendingTasks += sharedPending
    }

    // Overdue tasks
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const overdueTasks = await prisma.task.findMany({
      where: {
        userId,
        url: null,
        status: { not: 'done' },
        dueDate: { lt: today },
      },
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    })

    // Projects due this week
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)

    const projectsDueThisWeek = await prisma.project.findMany({
      where: {
        userId,
        status: { notIn: ['completed'] },
        dueDate: { gte: today, lte: weekFromNow },
      },
      include: {
        client: { select: { id: true, name: true } },
        _count: { select: { tasks: true } },
        tasks: { select: { status: true }, where: { url: null } },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    })

    const dueProjects = projectsDueThisWeek
      .filter(p => p.tasks.length === 0 || p.tasks.some(t => t.status !== 'done'))
      .map(({ tasks, ...rest }) => rest)

    // Project health
    const activeProjectsForHealth = await prisma.project.findMany({
      where: { userId, status: { notIn: ['completed'] } },
      include: {
        client: { select: { name: true } },
        tasks: {
          where: { url: null },
          select: { status: true, dueDate: true, priority: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const projectHealth = activeProjectsForHealth.map(project => {
      const total = project.tasks.length
      const completed = project.tasks.filter(t => t.status === 'done').length
      const overdue = project.tasks.filter(
        t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now
      ).length

      if (total === 0) {
        return {
          projectId: project.id, projectName: project.name, clientName: project.client.name,
          score: 80, label: 'healthy' as const,
          overdueTasks: 0, totalTasks: 0, completedTasks: 0,
        }
      }

      let score = 100
      const overdueRatio = overdue / total
      score -= Math.round(overdueRatio * 40)

      const daysSinceUpdate = Math.floor(
        (now.getTime() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceUpdate > 14) score -= 20
      else if (daysSinceUpdate > 7) score -= 10
      else if (daysSinceUpdate > 3) score -= 5

      if (project.dueDate) {
        const daysUntilDue = Math.floor(
          (new Date(project.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
        const completionRatio = completed / total
        if (daysUntilDue < 0) score -= 20
        else if (daysUntilDue <= 3 && completionRatio < 0.5) score -= 15
        else if (daysUntilDue <= 7 && completionRatio < 0.3) score -= 10
      }

      const completionRatio = completed / total
      score += Math.round(completionRatio * 10)
      score = Math.max(0, Math.min(100, score))

      const label: 'healthy' | 'at_risk' | 'critical' =
        score >= 70 ? 'healthy' : score >= 40 ? 'at_risk' : 'critical'

      return {
        projectId: project.id, projectName: project.name, clientName: project.client.name,
        score, label,
        overdueTasks: overdue, totalTasks: total, completedTasks: completed,
      }
    })

    const order = { critical: 0, at_risk: 1, healthy: 2 }
    projectHealth.sort((a, b) => order[a.label] - order[b.label] || a.score - b.score)

    return NextResponse.json({
      stats: {
        totalClients, activeClients,
        totalProjects, activeProjects,
        totalTasks, pendingTasks,
      },
      overdueTasks,
      projectsDueThisWeek: dueProjects,
      projectHealth,
    })
  } catch (error) {
    console.error('API v1/dashboard error:', error)
    return apiError('Internal error', 500)
  }
}
