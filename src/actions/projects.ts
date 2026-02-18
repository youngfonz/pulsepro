'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'
import { checkLimit } from '@/lib/subscription'
import { revalidatePath } from 'next/cache'

export async function getProjects(filters?: {
  search?: string
  status?: string
  priority?: string
  clientId?: string
  sort?: string
}) {
  try {
    const userId = await requireUserId()
    const where: Record<string, unknown> = { userId }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'completed') {
        // Match projects with status 'completed' OR all tasks done
        const completedCondition = {
          OR: [
            { status: 'completed' },
            { tasks: { every: { completed: true }, some: {} } },
          ],
        }
        where.AND = [...((where.AND as Record<string, unknown>[]) || []), completedCondition]
      } else {
        // For non-completed statuses, exclude projects where all tasks are done
        where.status = filters.status
        where.NOT = {
          tasks: { every: { completed: true }, some: {} },
        }
      }
    }

    if (filters?.priority && filters.priority !== 'all') {
      where.priority = filters.priority
    }

    if (filters?.clientId && filters.clientId !== 'all') {
      where.clientId = filters.clientId
    }

    // Determine sort order
    type OrderBy = Record<string, 'asc' | 'desc' | Record<string, 'asc' | 'desc'>>
    let orderBy: OrderBy | OrderBy[] = { createdAt: 'desc' as const }
    let customSort: 'priority' | 'priority_desc' | 'status' | 'status_desc' | null = null

    switch (filters?.sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'name_desc':
        orderBy = { name: 'desc' }
        break
      case 'client':
        orderBy = { client: { name: 'asc' } }
        break
      case 'client_desc':
        orderBy = { client: { name: 'desc' } }
        break
      case 'due_date':
        orderBy = [{ dueDate: 'asc' }, { createdAt: 'desc' }]
        break
      case 'due_date_desc':
        orderBy = [{ dueDate: 'desc' }, { createdAt: 'desc' }]
        break
      case 'priority_high':
        customSort = 'priority_desc'
        break
      case 'priority_low':
        customSort = 'priority'
        break
      case 'status':
        customSort = 'status'
        break
      case 'status_desc':
        customSort = 'status_desc'
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        tasks: {
          select: { id: true, completed: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: customSort ? { createdAt: 'desc' } : orderBy,
    })

    // Apply custom sorting for priority and status (string enums that need logical ordering)
    if (customSort) {
      const priorityOrder = { low: 1, medium: 2, high: 3 }
      const statusOrder = { not_started: 1, in_progress: 2, on_hold: 3, completed: 4 }

      projects.sort((a, b) => {
        if (customSort === 'priority') {
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
        } else if (customSort === 'priority_desc') {
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
        } else if (customSort === 'status') {
          return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
        } else if (customSort === 'status_desc') {
          return statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder]
        }
        return 0
      })
    }

    return projects
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

export async function getProject(id: string) {
  try {
    const userId = await requireUserId()
    return prisma.project.findFirst({
      where: { id, userId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
        tasks: {
          include: {
            images: true,
            files: true,
            comments: {
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: [
            { completed: 'asc' },
            { priority: 'desc' },
            { createdAt: 'desc' },
          ],
        },
        timeEntries: {
          orderBy: { date: 'desc' },
        },
      },
    })
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

export async function getProjectsForGantt() {
  try {
    const userId = await requireUserId()
    return prisma.project.findMany({
      where: { userId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        tasks: {
          orderBy: [
            { startDate: 'asc' },
            { dueDate: 'asc' },
          ],
        },
      },
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Failed to fetch projects for Gantt:', error)
    return []
  }
}

export async function createProject(formData: FormData) {
  try {
    const userId = await requireUserId()

    // Verify client belongs to this user
    const clientId = formData.get('clientId') as string
    const client = await prisma.client.findFirst({ where: { id: clientId, userId } })
    if (!client) throw new Error('Client not found')

    const limit = await checkLimit('projects')
    if (!limit.allowed) {
      throw new Error(`Free plan limit: ${limit.limit} projects. Upgrade to Pro for unlimited projects.`)
    }

    const data = {
      userId,
      name: formData.get('name') as string,
      description: formData.get('description') as string || null,
      notes: formData.get('notes') as string || null,
      status: formData.get('status') as string || 'not_started',
      priority: formData.get('priority') as string || 'medium',
      dueDate: formData.get('dueDate')
        ? new Date(formData.get('dueDate') as string)
        : null,
      budget: formData.get('budget')
        ? parseFloat(formData.get('budget') as string)
        : null,
      clientId: formData.get('clientId') as string,
    }

    const project = await prisma.project.create({ data })
    revalidatePath('/projects')
    revalidatePath(`/clients/${data.clientId}`)
    return project
  } catch (error) {
    console.error('Failed to create project:', error)
    throw error instanceof Error ? error : new Error('Failed to create project')
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const userId = await requireUserId()
    const existing = await prisma.project.findFirst({ where: { id, userId } })
    if (!existing) return

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || null,
      notes: formData.get('notes') as string || null,
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      dueDate: formData.get('dueDate')
        ? new Date(formData.get('dueDate') as string)
        : null,
      budget: formData.get('budget')
        ? parseFloat(formData.get('budget') as string)
        : null,
      clientId: formData.get('clientId') as string,
    }

    await prisma.project.update({
      where: { id },
      data,
    })
    revalidatePath('/projects')
    revalidatePath(`/projects/${id}`)
    revalidatePath(`/clients/${data.clientId}`)
    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Failed to update project:', error)
    throw new Error('Failed to update project')
  }
}

export async function deleteProject(id: string) {
  try {
    const userId = await requireUserId()
    const project = await prisma.project.findFirst({ where: { id, userId } })
    if (!project) return

    await prisma.project.delete({
      where: { id },
    })
    revalidatePath('/projects')
    revalidatePath(`/clients/${project.clientId}`)
    revalidatePath('/dashboard')
    revalidatePath('/tasks')
  } catch (error) {
    console.error('Failed to delete project:', error)
    throw new Error('Failed to delete project')
  }
}

export async function getClientsForSelect() {
  try {
    const userId = await requireUserId()
    return prisma.client.findMany({
      where: { userId, status: 'active' },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Failed to fetch clients for select:', error)
    return []
  }
}

export async function addProjectImage(projectId: string, path: string, name: string) {
  try {
    const userId = await requireUserId()
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } })
    if (!project) return

    await prisma.projectImage.create({
      data: {
        path,
        name,
        projectId,
      },
    })
    revalidatePath(`/projects/${projectId}`)
  } catch (error) {
    console.error('Failed to add project image:', error)
    throw new Error('Failed to add project image')
  }
}

export async function removeProjectImage(imageId: string) {
  try {
    const userId = await requireUserId()
    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
      include: { project: { select: { id: true, userId: true } } },
    })

    if (!image || image.project.userId !== userId) return

    await prisma.projectImage.delete({
      where: { id: imageId },
    })
    revalidatePath(`/projects/${image.project.id}`)
  } catch (error) {
    console.error('Failed to remove project image:', error)
    throw new Error('Failed to remove project image')
  }
}

// Time Entry Actions
export async function addTimeEntry(projectId: string, formData: FormData) {
  try {
    const userId = await requireUserId()
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } })
    if (!project) return

    const hours = parseFloat(formData.get('hours') as string)
    const description = formData.get('description') as string || null
    const dateStr = formData.get('date') as string

    await prisma.timeEntry.create({
      data: {
        hours,
        description,
        date: dateStr ? new Date(dateStr) : new Date(),
        projectId,
      },
    })
    revalidatePath(`/projects/${projectId}`)
  } catch (error) {
    console.error('Failed to add time entry:', error)
    throw new Error('Failed to add time entry')
  }
}

export async function deleteTimeEntry(id: string) {
  try {
    const userId = await requireUserId()
    const entry = await prisma.timeEntry.findUnique({
      where: { id },
      include: { project: { select: { id: true, userId: true } } },
    })

    if (!entry || entry.project.userId !== userId) return

    await prisma.timeEntry.delete({
      where: { id },
    })
    revalidatePath(`/projects/${entry.project.id}`)
  } catch (error) {
    console.error('Failed to delete time entry:', error)
    throw new Error('Failed to delete time entry')
  }
}
