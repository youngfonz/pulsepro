import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'

export async function OPTIONS() { return handleCors() }

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth

    const url = new URL(request.url)
    const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(url.searchParams.get('month') || new Date().getMonth().toString())

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        url: null,
        OR: [
          { dueDate: { gte: startOfMonth, lte: endOfMonth } },
          { startDate: { gte: startOfMonth, lte: endOfMonth } },
        ],
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            client: { select: { name: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('API v1/calendar error:', error)
    return apiError('Internal error', 500)
  }
}
