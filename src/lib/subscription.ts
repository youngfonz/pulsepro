import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'

export type Plan = 'free' | 'pro'

const PLAN_LIMITS = {
  free: {
    maxProjects: 3,
    maxTasks: 50,
    maxClients: 1,
  },
  pro: {
    maxProjects: Infinity,
    maxTasks: Infinity,
    maxClients: Infinity,
  },
} as const

export async function getUserSubscription() {
  const userId = await requireUserId()

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) {
    return {
      plan: 'free' as Plan,
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }
  }

  return {
    plan: subscription.plan as Plan,
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
  }
}

export async function getUserPlan(): Promise<Plan> {
  const sub = await getUserSubscription()
  return sub.plan
}

export async function canUseTelegram(): Promise<boolean> {
  const plan = await getUserPlan()
  return plan === 'pro'
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
      current = await prisma.task.count({ where: { userId } })
      return { allowed: current < limits.maxTasks, current, limit: limits.maxTasks, plan }
    case 'clients':
      current = await prisma.client.count({ where: { userId } })
      return { allowed: current < limits.maxClients, current, limit: limits.maxClients, plan }
  }
}
