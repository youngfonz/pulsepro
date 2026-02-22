import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Bearer token auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    if (!token) {
      return NextResponse.json({ error: 'Missing API token' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: { apiToken: token },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Invalid API token' }, { status: 401 })
    }

    if (subscription.plan !== 'pro') {
      return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
    }

    const body = await request.json()
    const { title, project, priority, dueDate, description } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Match project by name (case-insensitive, optional)
    let projectId: string | undefined
    if (project && typeof project === 'string') {
      const found = await prisma.project.findFirst({
        where: {
          userId: subscription.userId,
          name: { equals: project, mode: 'insensitive' },
        },
        select: { id: true },
      })
      if (found) {
        projectId = found.id
      }
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high']
    const taskPriority = validPriorities.includes(priority) ? priority : 'medium'

    // Parse due date
    let parsedDueDate: Date | null = null
    if (dueDate) {
      const d = new Date(dueDate)
      if (!isNaN(d.getTime())) {
        parsedDueDate = d
      }
    }

    const task = await prisma.task.create({
      data: {
        userId: subscription.userId,
        title: title.trim(),
        description: description?.trim() || null,
        priority: taskPriority,
        dueDate: parsedDueDate,
        projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        dueDate: true,
        projectId: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('API v1/tasks error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const subscription = await prisma.subscription.findFirst({
      where: { apiToken: token },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Invalid API token' }, { status: 401 })
    }

    if (subscription.plan !== 'pro') {
      return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status') // todo, in_progress, done
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100)

    const where: Record<string, unknown> = { userId: subscription.userId }
    if (status) where.status = status

    const tasks = await prisma.task.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        completed: true,
        dueDate: true,
        projectId: true,
        project: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('API v1/tasks GET error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
