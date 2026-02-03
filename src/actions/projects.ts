'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProjects(filters?: {
  search?: string
  status?: string
  priority?: string
  clientId?: string
  sort?: string
}) {
  const where: Record<string, unknown> = {}

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ]
  }

  if (filters?.status && filters.status !== 'all') {
    where.status = filters.status
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
      orderBy = { priority: 'desc' }
      break
    case 'priority_low':
      orderBy = { priority: 'asc' }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  return prisma.project.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { tasks: true },
      },
    },
    orderBy,
  })
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
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
}

export async function getProjectsForGantt() {
  return prisma.project.findMany({
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
}

export async function createProject(formData: FormData) {
  const data = {
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
}

export async function updateProject(id: string, formData: FormData) {
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
}

export async function deleteProject(id: string) {
  const project = await prisma.project.delete({
    where: { id },
  })
  revalidatePath('/projects')
  revalidatePath(`/clients/${project.clientId}`)
}

export async function getClientsForSelect() {
  return prisma.client.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  })
}

export async function addProjectImage(projectId: string, path: string, name: string) {
  await prisma.projectImage.create({
    data: {
      path,
      name,
      projectId,
    },
  })
  revalidatePath(`/projects/${projectId}`)
}

export async function removeProjectImage(imageId: string) {
  const image = await prisma.projectImage.findUnique({
    where: { id: imageId },
    select: { projectId: true },
  })

  if (!image) return

  await prisma.projectImage.delete({
    where: { id: imageId },
  })
  revalidatePath(`/projects/${image.projectId}`)
}

// Time Entry Actions
export async function addTimeEntry(projectId: string, formData: FormData) {
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
}

export async function deleteTimeEntry(id: string) {
  const entry = await prisma.timeEntry.findUnique({
    where: { id },
    select: { projectId: true },
  })

  if (!entry) return

  await prisma.timeEntry.delete({
    where: { id },
  })
  revalidatePath(`/projects/${entry.projectId}`)
}
