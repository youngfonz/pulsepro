'use server'

import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'
import { checkLimit } from '@/lib/subscription'
import { revalidatePath } from 'next/cache'

export async function getClients(search?: string, status?: string, sort?: string) {
  try {
    const userId = await requireUserId()
    const where: Record<string, unknown> = { userId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    // Determine sort order
    type OrderBy = Record<string, 'asc' | 'desc'>
    let orderBy: OrderBy = { name: 'asc' }
    let sortByProjects = false

    switch (sort) {
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'name_desc':
        orderBy = { name: 'desc' }
        break
      case 'company':
        orderBy = { company: 'asc' }
        break
      case 'company_desc':
        orderBy = { company: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'projects':
        sortByProjects = true
        break
      case 'projects_desc':
        sortByProjects = true
        break
      default:
        orderBy = { name: 'asc' }
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        projects: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy,
    })

    // Sort by project count if requested (can't do this in Prisma directly)
    if (sortByProjects) {
      if (sort === 'projects_desc') {
        clients.sort((a, b) => b.projects.length - a.projects.length)
      } else {
        clients.sort((a, b) => a.projects.length - b.projects.length)
      }
    }

    return clients
  } catch (error) {
    console.error('Failed to fetch clients:', error)
    return []
  }
}

export async function getClient(id: string) {
  try {
    const userId = await requireUserId()
    return prisma.client.findFirst({
      where: { id, userId },
      include: {
        projects: {
          include: {
            _count: {
              select: { tasks: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  } catch (error) {
    console.error('Failed to fetch client:', error)
    return null
  }
}

export async function createClient(formData: FormData) {
  try {
    const userId = await requireUserId()

    const limit = await checkLimit('clients')
    if (!limit.allowed) {
      throw new Error(`Free plan limit: ${limit.limit} client${limit.limit === 1 ? '' : 's'}. Upgrade to Pro for unlimited clients.`)
    }

    const data = {
      userId,
      name: formData.get('name') as string,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      company: formData.get('company') as string || null,
      logo: formData.get('logo') as string || null,
      status: formData.get('status') as string || 'active',
      notes: formData.get('notes') as string || null,
    }

    const client = await prisma.client.create({ data })
    revalidatePath('/clients')
    return client
  } catch (error) {
    console.error('Failed to create client:', error)
    throw error instanceof Error ? error : new Error('Failed to create client')
  }
}

export async function updateClient(id: string, formData: FormData) {
  try {
    const userId = await requireUserId()
    const existing = await prisma.client.findFirst({ where: { id, userId } })
    if (!existing) return

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      company: formData.get('company') as string || null,
      logo: formData.get('logo') as string || null,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string || null,
    }

    await prisma.client.update({
      where: { id },
      data,
    })
    revalidatePath('/clients')
    revalidatePath(`/clients/${id}`)
  } catch (error) {
    console.error('Failed to update client:', error)
    throw new Error('Failed to update client')
  }
}

export async function deleteClient(id: string) {
  try {
    const userId = await requireUserId()
    const existing = await prisma.client.findFirst({ where: { id, userId } })
    if (!existing) return

    await prisma.client.delete({
      where: { id },
    })
    revalidatePath('/clients')
  } catch (error) {
    console.error('Failed to delete client:', error)
    throw new Error('Failed to delete client')
  }
}
