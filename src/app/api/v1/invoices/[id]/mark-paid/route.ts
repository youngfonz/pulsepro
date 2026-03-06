import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'

export async function OPTIONS() { return handleCors() }

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateRequest(request)
    if ('error' in auth) return apiError(auth.error, auth.status)
    const { userId } = auth
    const { id } = await params

    const invoice = await prisma.invoice.findFirst({ where: { id, userId } })
    if (!invoice) return apiError('Invoice not found', 404)

    await prisma.invoice.update({
      where: { id },
      data: { status: 'paid', paidAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API v1/invoices/[id]/mark-paid error:', error)
    return apiError('Internal error', 500)
  }
}
