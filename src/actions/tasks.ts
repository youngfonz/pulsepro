'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'
import { checkLimit } from '@/lib/subscription'
import { revalidatePath } from 'next/cache'
import { getAccessibleProjectIds } from '@/lib/access'

export async function getTask(id: string) {
  const userId = await requireUserId()
  const include = {
    images: true,
    files: true,
    comments: {
      orderBy: { createdAt: 'desc' as const },
    },
    project: {
      select: {
        id: true,
        name: true,
      },
    },
  }

  let task = await prisma.task.findFirst({ where: { id, userId }, include })

  if (!task) {
    const sharedIds = await getAccessibleProjectIds()
    if (sharedIds.length > 0) {
      task = await prisma.task.findFirst({
        where: { id, projectId: { in: sharedIds } },
        include,
      })
    }
  }

  return task
}

export async function createTask(projectId: string, formData: FormData) {
  try {
    const userId = await requireUserId()

    // Verify project belongs to this user
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } })
    if (!project) throw new Error('Project not found')

    const limit = await checkLimit('tasks')
    if (!limit.allowed) {
      throw new Error(`Free plan limit: ${limit.limit} tasks. Upgrade to Pro for unlimited tasks.`)
    }

    const data = {
      userId,
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
  } catch (error) {
    console.error('createTask:', error)
    throw new Error('Failed to create task')
  }
}

export async function updateTask(id: string, formData: FormData) {
  try {
    const userId = await requireUserId()
    const task = await prisma.task.findFirst({
      where: { id, userId },
      select: { projectId: true, url: true },
    })

    if (!task) return

    const data: Record<string, unknown> = {
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

    if (task.url) {
      const tagsRaw = formData.get('tags') as string | null
      if (tagsRaw !== null) {
        data.tags = JSON.parse(tagsRaw)
      }

      const thumbnailUrl = formData.get('thumbnailUrl') as string | null
      if (thumbnailUrl !== null) {
        data.thumbnailUrl = thumbnailUrl || null
      }
    }

    await prisma.task.update({
      where: { id },
      data,
    })
    revalidatePath(`/projects/${task.projectId}`)
    revalidatePath(`/tasks/${id}`)
    revalidatePath('/tasks')
    revalidatePath('/bookmarks')
  } catch (error) {
    console.error('updateTask:', error)
    throw new Error('Failed to update task')
  }
}

export async function toggleTask(id: string) {
  try {
    const userId = await requireUserId()
    const task = await prisma.task.findFirst({
      where: { id, userId },
      select: { completed: true, projectId: true },
    })

    if (!task) return

    const newCompleted = !task.completed
    await prisma.task.update({
      where: { id },
      data: {
        completed: newCompleted,
        status: newCompleted ? 'done' : 'todo',
      },
    })
    revalidatePath(`/projects/${task.projectId}`)
    revalidatePath(`/tasks/${id}`)
    revalidatePath('/tasks')
  } catch (error) {
    console.error('toggleTask:', error)
    throw new Error('Failed to toggle task')
  }
}

export async function deleteTask(id: string) {
  try {
    const userId = await requireUserId()
    const task = await prisma.task.findFirst({
      where: { id, userId },
      select: { projectId: true },
    })

    if (!task) return

    await prisma.task.delete({
      where: { id },
    })
    revalidatePath(`/projects/${task.projectId}`)
    revalidatePath('/tasks')
  } catch (error) {
    console.error('deleteTask:', error)
    throw new Error('Failed to delete task')
  }
}

export async function addTaskImage(taskId: string, path: string, name: string) {
  try {
    const userId = await requireUserId()
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
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
  } catch (error) {
    console.error('addTaskImage:', error)
    throw new Error('Failed to add task image')
  }
}

export async function removeTaskImage(imageId: string) {
  try {
    const userId = await requireUserId()
    const image = await prisma.taskImage.findUnique({
      where: { id: imageId },
      include: {
        task: {
          select: { projectId: true, userId: true },
        },
      },
    })

    if (!image) return
    if (image.task.userId !== userId) return

    await prisma.taskImage.delete({
      where: { id: imageId },
    })
    revalidatePath(`/projects/${image.task.projectId}`)
  } catch (error) {
    console.error('removeTaskImage:', error)
    throw new Error('Failed to remove task image')
  }
}

export async function addTaskFile(
  taskId: string,
  path: string,
  name: string,
  type: string,
  size: number
) {
  try {
    const userId = await requireUserId()
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
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
  } catch (error) {
    console.error('addTaskFile:', error)
    throw new Error('Failed to add task file')
  }
}

export async function removeTaskFile(fileId: string) {
  try {
    const userId = await requireUserId()
    const file = await prisma.taskFile.findUnique({
      where: { id: fileId },
      include: {
        task: {
          select: { projectId: true, userId: true },
        },
      },
    })

    if (!file) return
    if (file.task.userId !== userId) return

    await prisma.taskFile.delete({
      where: { id: fileId },
    })
    revalidatePath(`/projects/${file.task.projectId}`)
  } catch (error) {
    console.error('removeTaskFile:', error)
    throw new Error('Failed to remove task file')
  }
}

export async function getTasksDueToday() {
  const userId = await requireUserId()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.task.findMany({
    where: {
      userId,
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
  const userId = await requireUserId()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.task.findMany({
    where: {
      userId,
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
  const userId = await requireUserId()
  return prisma.task.findMany({
    where: { userId },
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
    take: 500,
  })
}

export async function getTasksForCalendar(year: number, month: number) {
  const userId = await requireUserId()
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

  return prisma.task.findMany({
    where: {
      userId,
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
    take: 200,
  })
}

export async function getAllTasks(options?: {
  date?: string
  status?: 'all' | 'pending' | 'completed'
  priority?: 'all' | 'high' | 'medium' | 'low'
  projectId?: string
  sort?: string
}) {
  const userId = await requireUserId()
  const sharedIds = await getAccessibleProjectIds()
  const ownershipFilter = sharedIds.length > 0
    ? { OR: [{ userId }, { projectId: { in: sharedIds } }] }
    : { userId }
  const where: Record<string, unknown> = { ...ownershipFilter, url: null }

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
    take: 200,
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
  const userId = await requireUserId()
  return prisma.project.findMany({
    where: { userId },
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
  try {
    const userId = await requireUserId()
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
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
  } catch (error) {
    console.error('addTaskComment:', error)
    throw new Error('Failed to add comment')
  }
}

export async function deleteTaskComment(commentId: string) {
  try {
    const userId = await requireUserId()
    const comment = await prisma.taskComment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          select: { projectId: true, userId: true },
        },
      },
    })

    if (!comment) return
    if (comment.task.userId !== userId) return

    await prisma.taskComment.delete({
      where: { id: commentId },
    })
    revalidatePath(`/projects/${comment.task.projectId}`)
  } catch (error) {
    console.error('deleteTaskComment:', error)
    throw new Error('Failed to delete comment')
  }
}

export async function createBookmarkTask(
  projectId: string,
  data: {
    url: string
    title: string
    description?: string
    thumbnailUrl?: string
    bookmarkType: 'youtube' | 'twitter' | 'website'
    tags?: string[]
    priority?: string
    dueDate?: string
    notes?: string
  }
) {
  try {
    const userId = await requireUserId()

    // Verify project belongs to this user
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } })
    if (!project) throw new Error('Project not found')

    const limit = await checkLimit('tasks')
    if (!limit.allowed) {
      throw new Error(`Free plan limit: ${limit.limit} tasks. Upgrade to Pro for unlimited tasks.`)
    }

    const taskData = {
      userId,
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
  } catch (error) {
    console.error('createBookmarkTask:', error)
    throw new Error('Failed to create bookmark task')
  }
}

export async function getAllBookmarks(filters?: {
  search?: string
  projectId?: string
  bookmarkType?: string
  sort?: string
}) {
  const userId = await requireUserId()
  const sharedIds = await getAccessibleProjectIds()
  const ownershipFilter = sharedIds.length > 0
    ? { OR: [{ userId }, { projectId: { in: sharedIds } }] }
    : { userId }
  const where: Record<string, unknown> = {
    ...ownershipFilter,
    url: { not: null }
  }

  if (filters?.search) {
    where.AND = [
      { url: { not: null } },
      {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { url: { contains: filters.search, mode: 'insensitive' } },
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
    take: 200,
  })

  if (filters?.sort === 'project') {
    bookmarks.sort((a, b) => a.project.name.localeCompare(b.project.name))
  }

  return bookmarks
}

export async function getAllTags() {
  const userId = await requireUserId()
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      tags: {
        isEmpty: false,
      },
    },
    select: {
      tags: true,
    },
    take: 500,
  })

  const allTags = new Set<string>()
  tasks.forEach((task) => {
    task.tags.forEach((tag) => allTags.add(tag))
  })

  return Array.from(allTags).sort()
}
