import { prisma } from '@/lib/prisma'
import { requireUserId, isAdminUser } from '@/lib/auth'

export type Plan = 'free' | 'pro' | 'team'

const PLAN_LIMITS = {
  free: {
    maxProjects: 3,
    maxTasks: 50,
    maxClients: 1,
    maxCollaborators: 0,
  },
  pro: {
    maxProjects: Infinity,
    maxTasks: Infinity,
    maxClients: Infinity,
    maxCollaborators: 3,
  },
  team: {
    maxProjects: Infinity,
    maxTasks: Infinity,
    maxClients: Infinity,
    maxCollaborators: 10,
  },
} as const

export async function getUserSubscription() {
  const userId = await requireUserId()
  const admin = isAdminUser(userId)

  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  // Auto-create Pro subscription for admin users
  if (!subscription && admin) {
    subscription = await prisma.subscription.create({
      data: { userId, plan: 'pro' },
    })
  }

  if (!subscription) {
    return {
      plan: 'free' as Plan,
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      hasPortal: false,
    }
  }

  return {
    plan: subscription.plan as Plan,
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    hasPortal: !!subscription.polarCustomerId,
  }
}

export async function getUserPlan(): Promise<Plan> {
  const sub = await getUserSubscription()
  return sub.plan
}

export async function canUseTelegram(): Promise<boolean> {
  const plan = await getUserPlan()
  return plan === 'pro' || plan === 'team'
}

export async function canUseAIInsights(): Promise<boolean> {
  const plan = await getUserPlan()
  return plan === 'pro' || plan === 'team'
}

export async function checkCollaboratorLimit(projectId: string): Promise<{
  allowed: boolean
  current: number
  limit: number
  plan: Plan
}> {
  const plan = await getUserPlan()
  const limits = PLAN_LIMITS[plan]
  const current = await prisma.projectAccess.count({ where: { projectId } })
  return {
    allowed: current < limits.maxCollaborators,
    current,
    limit: limits.maxCollaborators,
    plan,
  }
}

export async function checkLimit(resource: 'projects' | 'tasks' | 'clients'): Promise<{
  allowed: boolean
  current: number
  limit: number
  plan: Plan
}> {
  const userId = await requireUserId()
  const plan = await getUserPlan()
  const limits = PLAN_LIMITS[plan]

  let current: number

  switch (resource) {
    case 'projects':
      current = await prisma.project.count({ where: { userId } })
      return { allowed: current < limits.maxProjects, current, limit: limits.maxProjects, plan }
    case 'tasks':
      current = await prisma.task.count({ where: { userId, url: null } })
      return { allowed: current < limits.maxTasks, current, limit: limits.maxTasks, plan }
    case 'clients':
      current = await prisma.client.count({ where: { userId } })
      return { allowed: current < limits.maxClients, current, limit: limits.maxClients, plan }
  }
}
