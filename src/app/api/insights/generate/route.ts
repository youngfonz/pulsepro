import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'
import { generateAIInsights, hashInsightContext, type InsightContext } from '@/lib/ai-insights'

const CACHE_TTL_HOURS = 4
const COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes

async function gatherInsightContext(userId: string): Promise<InsightContext> {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const [stats, projectHealth, overdueTasks, tasksDueToday, tasksDueThisWeek] = await Promise.all([
    // Stats
    (async () => {
      const [totalProjects, activeProjects, totalTasks, pendingTasks] = await Promise.all([
        prisma.project.count({ where: { userId } }),
        prisma.project.count({ where: { userId, status: { in: ['in_progress', 'not_started'] } } }),
        prisma.task.count({ where: { userId, url: null } }),
        prisma.task.count({ where: { userId, url: null, completed: false } }),
      ])
      return { totalProjects, activeProjects, totalTasks, pendingTasks }
    })(),

    // Project health summary
    prisma.project.findMany({
      where: { userId, status: { notIn: ['completed'] } },
      include: {
        client: { select: { name: true } },
        tasks: { select: { completed: true, dueDate: true } },
      },
      take: 10,
    }).then(projects => projects.map(p => {
      const total = p.tasks.length
      const completed = p.tasks.filter(t => t.completed).length
      const overdue = p.tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length
      const score = total === 0 ? 80 : Math.max(0, Math.min(100, 100 - Math.round((overdue / total) * 40) + Math.round((completed / total) * 10)))
      const label = score >= 70 ? 'healthy' : score >= 40 ? 'at_risk' : 'critical'
      return {
        projectName: p.name,
        clientName: p.client.name,
        label,
        score,
        overdueTasks: overdue,
        totalTasks: total,
        completedTasks: completed,
        href: `/projects/${p.id}`,
      }
    })),

    // Overdue tasks
    prisma.task.findMany({
      where: { userId, completed: false, url: null, dueDate: { lt: now } },
      include: { project: { select: { name: true, id: true } } },
      orderBy: { dueDate: 'asc' },
      take: 10,
    }).then(tasks => tasks.map(t => ({
      title: t.title,
      projectName: t.project.name,
      dueDate: t.dueDate!.toISOString().split('T')[0],
      priority: t.priority,
    }))),

    // Tasks due today
    prisma.task.findMany({
      where: {
        userId,
        completed: false,
        url: null,
        dueDate: { gte: now, lt: new Date(now.getTime() + 86400000) },
      },
      include: { project: { select: { name: true } } },
      take: 10,
    }).then(tasks => tasks.map(t => ({
      title: t.title,
      projectName: t.project.name,
      priority: t.priority,
    }))),

    // Tasks due this week count
    prisma.task.count({
      where: {
        userId,
        completed: false,
        url: null,
        dueDate: { gte: now, lt: new Date(now.getTime() + 7 * 86400000) },
      },
    }),
  ])

  return { stats, projectHealth, overdueTasks, tasksDueToday, tasksDueThisWeek }
}

export async function POST() {
  try {
    const userId = await requireUserId()

    // Rate limit: check if we generated within the cooldown period
    const cached = await prisma.cachedInsight.findUnique({ where: { userId } })
    if (cached && cached.createdAt.getTime() > Date.now() - COOLDOWN_MS) {
      return NextResponse.json({ insights: JSON.parse(cached.insights) })
    }

    const ctx = await gatherInsightContext(userId)
    const contextHash = hashInsightContext(ctx)

    // If context unchanged and cache still valid, return cached
    if (cached && cached.context === contextHash && cached.expiresAt > new Date()) {
      return NextResponse.json({ insights: JSON.parse(cached.insights) })
    }

    const insights = await generateAIInsights(ctx)

    const expiresAt = new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000)

    await prisma.cachedInsight.upsert({
      where: { userId },
      create: { userId, insights: JSON.stringify(insights), context: contextHash, expiresAt },
      update: { insights: JSON.stringify(insights), context: contextHash, expiresAt, createdAt: new Date() },
    })

    return NextResponse.json({ insights })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Insight generation API error:', message, error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
