'use server'

import { getUserSubscription, checkLimit, type Plan } from '@/lib/subscription'

export async function getSubscriptionStatus() {
  return getUserSubscription()
}

export async function getUsageLimits() {
  const [projects, tasks, clients] = await Promise.all([
    checkLimit('projects'),
    checkLimit('tasks'),
    checkLimit('clients'),
  ])

  return { projects, tasks, clients }
}

