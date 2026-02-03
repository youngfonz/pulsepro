'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getClients(search?: string, status?: string) {
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } },
    ]
  }

  if (status && status !== 'all') {
    where.status = status
  }

  return prisma.client.findMany({
    where,
    include: {
      projects: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getClient(id: string) {
  return prisma.client.findUnique({
    where: { id },
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
}

export async function createClient(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    company: formData.get('company') as string || null,
    logo: formData.get('logo') as string || null,
    status: formData.get('status') as string || 'active',
    notes: formData.get('notes') as string || null,
  }

  await prisma.client.create({ data })
  revalidatePath('/clients')
}

export async function updateClient(id: string, formData: FormData) {
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
}

export async function deleteClient(id: string) {
  await prisma.client.delete({
    where: { id },
  })
  revalidatePath('/clients')
}
