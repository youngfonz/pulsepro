'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTask(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      images: true,
      files: true,
      comments: {
        orderBy: { createdAt: 'desc' },
      },
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
  projectId?: string
  sort?: string
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

  if (options?.projectId && options.projectId !== 'all') {
    where.projectId = options.projectId
  }

  // Determine sort order
  type OrderBy = Record<string, 'asc' | 'desc' | Record<string, 'asc' | 'desc'>>
  let orderBy: OrderBy | OrderBy[] = [
    { completed: 'asc' as const },
    { dueDate: 'asc' as const },
    { priority: 'desc' as const },
  ]

  switch (options?.sort) {
    case 'due_date':
      orderBy = [{ completed: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }]
      break
    case 'due_date_desc':
      orderBy = [{ completed: 'asc' }, { dueDate: 'desc' }, { createdAt: 'desc' }]
      break
    case 'newest':
      orderBy = [{ completed: 'asc' }, { createdAt: 'desc' }]
      break
    case 'oldest':
      orderBy = [{ completed: 'asc' }, { createdAt: 'asc' }]
      break
    case 'name':
      orderBy = [{ completed: 'asc' }, { title: 'asc' }]
      break
    case 'name_desc':
      orderBy = [{ completed: 'asc' }, { title: 'desc' }]
      break
    case 'project':
      orderBy = [{ completed: 'asc' }, { project: { name: 'asc' } }]
      break
    case 'client':
      // Sort by client in memory after fetching (Prisma doesn't support nested relation ordering)
      orderBy = [{ completed: 'asc' }, { createdAt: 'desc' }]
      break
    case 'priority_high':
      orderBy = [{ completed: 'asc' }, { priority: 'desc' }]
      break
    case 'priority_low':
      orderBy = [{ completed: 'asc' }, { priority: 'asc' }]
      break
  }

  const tasks = await prisma.task.findMany({
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
    orderBy,
  })

  // Sort by client name in memory (Prisma doesn't support nested relation ordering)
  if (options?.sort === 'client') {
    tasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return a.project.client.name.localeCompare(b.project.client.name)
    })
  }

  return tasks
}

export async function getProjectsForTaskFilter() {
  return prisma.project.findMany({
    select: {
      id: true,
      name: true,
      client: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export async function addTaskComment(taskId: string, content: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  })

  if (!task) return

  await prisma.taskComment.create({
    data: {
      content,
      taskId,
    },
  })
  revalidatePath(`/projects/${task.projectId}`)
}

export async function deleteTaskComment(commentId: string) {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
    include: {
      task: {
        select: { projectId: true },
      },
    },
  })

  if (!comment) return

  await prisma.taskComment.delete({
    where: { id: commentId },
  })
  revalidatePath(`/projects/${comment.task.projectId}`)
}

export async function createBookmarkTask(
  projectId: string,
  data: {
    url: string
    title: string
    description?: string
    thumbnailUrl?: string
    bookmarkType: 'youtube' | 'twitter'
    tags?: string[]
    priority?: string
    dueDate?: string
    notes?: string
  }
) {
  const taskData = {
    title: data.title,
    description: data.description || null,
    notes: data.notes || null,
    priority: data.priority || 'medium',
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    projectId,
    url: data.url,
    bookmarkType: data.bookmarkType,
    thumbnailUrl: data.thumbnailUrl || null,
    tags: data.tags || [],
  }

  await prisma.task.create({ data: taskData })
  revalidatePath(`/projects/${projectId}`)
}

export async function getAllBookmarks(filters?: {
  search?: string
  projectId?: string
  bookmarkType?: string
  sort?: string
}) {
  const where: Record<string, unknown> = {
    url: { not: null }
  }

  if (filters?.search) {
    where.AND = [
      { url: { not: null } },
      {
        OR: [
          { title: { contains: filters.search } },
          { description: { contains: filters.search } },
          { url: { contains: filters.search } },
        ]
      }
    ]
    delete where.url
  }

  if (filters?.projectId && filters.projectId !== 'all') {
    where.projectId = filters.projectId
  }

  if (filters?.bookmarkType && filters.bookmarkType !== 'all') {
    where.bookmarkType = filters.bookmarkType
  }

  let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }

  switch (filters?.sort) {
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'title':
      orderBy = { title: 'asc' }
      break
  }

  const bookmarks = await prisma.task.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy,
  })

  if (filters?.sort === 'project') {
    bookmarks.sort((a, b) => a.project.name.localeCompare(b.project.name))
  }

  return bookmarks
}

export async function getAllTags() {
  const tasks = await prisma.task.findMany({
    where: {
      tags: {
        isEmpty: false,
      },
    },
    select: {
      tags: true,
    },
  })

  const allTags = new Set<string>()
  tasks.forEach((task) => {
    task.tags.forEach((tag) => allTags.add(tag))
  })

  return Array.from(allTags).sort()
}
