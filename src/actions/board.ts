'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateTaskStatus(
  taskId: string,
  status: string,
  sortOrder: number
) {
  const userId = await requireUserId()
  let task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { projectId: true },
  })

  if (!task) {
    const { requireProjectAccess } = await import('@/lib/access')
    const found = await prisma.task.findFirst({
      where: { id: taskId },
      select: { projectId: true },
    })
    if (found) {
      if (found.projectId) await requireProjectAccess(found.projectId, 'editor')
      task = found
    }
  }

  if (!task) return

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      sortOrder,
      completed: status === 'done',
    },
  })

  if (task.projectId) revalidatePath(`/projects/${task.projectId}`)
  revalidatePath('/tasks')
}
