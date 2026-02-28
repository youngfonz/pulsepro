'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

interface Invoice {
  id: string
  number: string
  status: string
  issueDate: Date
  dueDate: Date
  taxRate: number
  paidAt: Date | null
  client: { id: string; name: string }
  project: { id: string; name: string } | null
  items: { amount: number }[]
}

const invoiceStatusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  overdue: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
}

const invoiceStatusLabels: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

function getInvoiceTotal(invoice: Invoice): number {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0)
  return subtotal + (subtotal * invoice.taxRate) / 100
}

export function InvoicesList({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No invoices yet. Create your first invoice to get started.
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Issue Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice) => {
              const total = getInvoiceTotal(invoice)
              return (
                <tr key={invoice.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-medium text-link hover:text-link/80 font-mono text-sm"
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/${invoice.client.id}`}
                      className="text-muted-foreground hover:text-link"
                    >
                      {invoice.client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {invoice.project ? (
                      <Link
                        href={`/projects/${invoice.project.id}`}
                        className="hover:text-link"
                      >
                        {invoice.project.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(invoice.issueDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">
                    {formatCurrency(total)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={invoiceStatusColors[invoice.status] ?? invoiceStatusColors.draft}>
                      {invoiceStatusLabels[invoice.status] ?? invoice.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-sm text-link hover:text-link/80"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="divide-y divide-border lg:hidden">
        {invoices.map((invoice) => {
          const total = getInvoiceTotal(invoice)
          return (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="block p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground font-mono text-sm">{invoice.number}</p>
                  <p className="text-sm text-muted-foreground truncate">{invoice.client.name}</p>
                  {invoice.project && (
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                      {invoice.project.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="font-semibold tabular-nums text-sm">
                    {formatCurrency(total)}
                  </span>
                  <Badge className={invoiceStatusColors[invoice.status] ?? invoiceStatusColors.draft}>
                    {invoiceStatusLabels[invoice.status] ?? invoice.status}
                  </Badge>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Issued {formatDate(invoice.issueDate)}
              </p>
            </Link>
          )
        })}
      </div>
    </>
  )
}
