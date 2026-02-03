'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTask(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      images: true,
      files: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

export async function createTask(projectId: string, formData: FormData) {
  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    notes: formData.get('notes') as string || null,
    priority: formData.get('priority') as string || 'medium',
    startDate: formData.get('startDate')
      ? new Date(formData.get('startDate') as string)
      : null,
    dueDate: formData.get('dueDate')
      ? new Date(formData.get('dueDate') as string)
      : null,
    projectId,
  }

  await prisma.task.create({ data })
  revalidatePath(`/projects/${projectId}`)
}

export async function updateTask(id: string, formData: FormData) {
  const task = await prisma.task.findUnique({
    where: { id },
    select: { projectId: true },
  })

  if (!task) return

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    notes: formData.get('notes') as string || null,
    priority: formData.get('priority') as string,
    startDate: formData.get('startDate')
      ? new Date(formData.get('startDate') as string)
      : null,
    dueDate: formData.get('dueDate')
      ? new Date(formData.get('dueDate') as string)
      : null,
  }

  await prisma.task.update({
    where: { id },
    data,
  })
  revalidatePath(`/projects/${task.projectId}`)
}

export async function toggleTask(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    select: { completed: true, projectId: true },
  })

  if (!task) return

  await prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  })
  revalidatePath(`/projects/${task.projectId}`)
  revalidatePath('/tasks')
}

export async function deleteTask(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    select: { projectId: true },
  })

  if (!task) return

  await prisma.task.delete({
    where: { id },
  })
  revalidatePath(`/projects/${task.projectId}`)
}

export async function addTaskImage(taskId: string, path: string, name: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  })

  if (!task) return

  await prisma.taskImage.create({
    data: {
      path,
      name,
      taskId,
    },
  })
  revalidatePath(`/projects/${task.projectId}`)
}

export async function removeTaskImage(imageId: string) {
  const image = await prisma.taskImage.findUnique({
    where: { id: imageId },
    include: {
      task: {
        select: { projectId: true },
      },
    },
  })

  if (!image) return

  await prisma.taskImage.delete({
    where: { id: imageId },
  })
  revalidatePath(`/projects/${image.task.projectId}`)
}

export async function addTaskFile(
  taskId: string,
  path: string,
  name: string,
  type: string,
  size: number
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  })

  if (!task) return

  await prisma.taskFile.create({
    data: {
      path,
      name,
      type,
      size,
      taskId,
    },
  })
  revalidatePath(`/projects/${task.projectId}`)
}

export async function removeTaskFile(fileId: string) {
  const file = await prisma.taskFile.findUnique({
    where: { id: fileId },
    include: {
      task: {
        select: { projectId: true },
      },
    },
  })

  if (!file) return

  await prisma.taskFile.delete({
    where: { id: fileId },
  })
  revalidatePath(`/projects/${file.task.projectId}`)
}

export async function getTasksDueToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.task.findMany({
    where: {
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
  })
}

export async function getOverdueTasks() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.task.findMany({
    where: {
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
  })
}

export async function getAllTasksForGantt() {
  return prisma.task.findMany({
    include: {
      project: {
        select: {
          id: true,
          name: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [
      { project: { name: 'asc' } },
      { startDate: 'asc' },
      { dueDate: 'asc' },
    ],
  })
}

export async function getTasksForCalendar(year: number, month: number) {
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

  return prisma.task.findMany({
    where: {
      OR: [
        {
          dueDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        {
          startDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      ],
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          client: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { dueDate: 'asc' },
  })
}

export async function getAllTasks(options?: {
  date?: string
  status?: 'all' | 'pending' | 'completed'
  priority?: 'all' | 'high' | 'medium' | 'low'
}) {
  const where: Record<string, unknown> = {}

  if (options?.date) {
    const targetDate = new Date(options.date)
    targetDate.setHours(0, 0, 0, 0)
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    where.OR = [
      {
        dueDate: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      {
        startDate: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    ]
  }

  if (options?.status === 'pending') {
    where.completed = false
  } else if (options?.status === 'completed') {
    where.completed = true
  }

  if (options?.priority && options.priority !== 'all') {
    where.priority = options.priority
  }

  return prisma.task.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          name: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [
      { completed: 'asc' },
      { dueDate: 'asc' },
      { priority: 'desc' },
    ],
  })
}
