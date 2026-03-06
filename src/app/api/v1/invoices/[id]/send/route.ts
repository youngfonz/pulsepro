import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest, apiError, handleCors } from '@/lib/api-auth'
import { sendInvoiceEmail } from '@/lib/email'

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

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        project: { select: { id: true, name: true } },
        items: true,
      },
    })

    if (!invoice) return apiError('Invoice not found', 404)
    if (!invoice.client.email) {
      return apiError(`Client "${invoice.client.name}" has no email address`, 400)
    }

    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0)
    const total = subtotal + subtotal * (invoice.taxRate / 100)

    await prisma.invoice.update({
      where: { id },
      data: { status: 'sent' },
    })

    await sendInvoiceEmail({ ...invoice, subtotal, total })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API v1/invoices/[id]/send error:', error)
    return apiError('Internal error', 500)
  }
}
