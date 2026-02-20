'use server'

import { prisma } from '@/lib/prisma'
import { getAuthContext } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateTaskStatus(
  taskId: string,
  status: string,
  sortOrder: number
) {
  const { userId, orgId } = await getAuthContext()
  const scopeWhere = orgId ? { orgId } : { userId }
  const task = await prisma.task.findFirst({
    where: { id: taskId, ...scopeWhere },
    select: { projectId: true },
  })

  if (!task) return

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      sortOrder,
      completed: status === 'done',
    },
  })

  revalidatePath(`/projects/${task.projectId}`)
  revalidatePath('/tasks')
}
