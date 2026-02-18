import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const userId = await requireUserId()
  const searchParams = request.nextUrl.searchParams
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
  const month = parseInt(searchParams.get('month') || new Date().getMonth().toString())

  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      url: null,
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

  return NextResponse.json(tasks)
}
