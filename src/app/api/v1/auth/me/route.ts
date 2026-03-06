import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'
import { isAdminUser } from '@/lib/auth'

export async function OPTIONS() { return handleCors() }

const PLAN_LIMITS = {
  free: { maxProjects: 3, maxTasks: 50, maxClients: 1, maxCollaborators: 0 },
  pro: { maxProjects: Infinity, maxTasks: Infinity, maxClients: Infinity, maxCollaborators: 3 },
  team: { maxProjects: Infinity, maxTasks: Infinity, maxClients: Infinity, maxCollaborators: 10 },
} as const

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth

    // Check maintenance mode
    const config = await prisma.systemConfig.findUnique({ where: { key: 'maintenance' } })
    if (config?.value === 'true' && !isAdminUser(userId)) {
      return apiError('System is under maintenance', 503)
    }

    // Get subscription (also check suspension)
    let subscription = await prisma.subscription.findUnique({ where: { userId } })

    if (subscription?.suspendedAt) {
      return apiError('Account suspended', 403)
    }

    // Auto-create team subscription for admin users
    if (isAdminUser(userId)) {
      if (!subscription) {
        subscription = await prisma.subscription.create({
          data: { userId, plan: 'team' },
        })
      } else if (subscription.plan !== 'team') {
        subscription = await prisma.subscription.update({
          where: { userId },
          data: { plan: 'team' },
        })
      }
    }

    const plan = (subscription?.plan || 'free') as keyof typeof PLAN_LIMITS
    const limits = PLAN_LIMITS[plan]

    const [projectCount, taskCount, clientCount] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.task.count({ where: { userId, url: null } }),
      prisma.client.count({ where: { userId } }),
    ])

    return NextResponse.json({
      userId,
      plan,
      status: subscription?.status || 'active',
      currentPeriodEnd: subscription?.currentPeriodEnd || null,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
      hasPortal: !!subscription?.polarCustomerId,
      usage: {
        projects: { current: projectCount, limit: limits.maxProjects },
        tasks: { current: taskCount, limit: limits.maxTasks },
        clients: { current: clientCount, limit: limits.maxClients },
      },
    })
  } catch (error) {
    console.error('API v1/auth/me error:', error)
    return apiError('Internal error', 500)
  }
}
