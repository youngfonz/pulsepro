import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'

export async function OPTIONS() { return handleCors() }

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth
    const { id: projectId } = await params

    // Verify project access
    let hasAccess = !!(await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    }))

    if (!hasAccess) {
      const access = await prisma.projectAccess.findUnique({
        where: { projectId_userId: { projectId, userId } },
      })
      hasAccess = !!access
    }

    if (!hasAccess) return apiError('Project not found', 404)

    const timeEntries = await prisma.timeEntry.findMany({
      where: { projectId },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ timeEntries })
  } catch (error) {
    console.error('API v1/projects/[id]/time-entries GET error:', error)
    return apiError('Internal error', 500)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth
    const { id: projectId } = await params

    // Verify project access (editor+)
    let hasAccess = !!(await prisma.project.findFirst({
      where: { id: projectId, userId },
      select: { id: true },
    }))

    if (!hasAccess) {
      const access = await prisma.projectAccess.findUnique({
        where: { projectId_userId: { projectId, userId } },
        select: { role: true },
      })
      if (access && ['editor', 'manager'].includes(access.role)) {
        hasAccess = true
      }
    }

    if (!hasAccess) return apiError('Project not found or insufficient permissions', 404)

    const body = await request.json()
    const hours = parseFloat(body.hours)
    if (isNaN(hours) || hours <= 0) return apiError('Valid hours required', 400)

    const entry = await prisma.timeEntry.create({
      data: {
        hours,
        description: body.description || null,
        date: body.date ? new Date(body.date) : new Date(),
        projectId,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('API v1/projects/[id]/time-entries POST error:', error)
    return apiError('Internal error', 500)
  }
}
