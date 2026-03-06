import { apiFetch, GetToken } from './client'
import { Invoice } from '../types/api'

interface InvoicesResponse { invoices: Invoice[] }

export function fetchInvoices(getToken: GetToken, filters?: Record<string, string>) {
  const params = new URLSearchParams(filters || {}).toString()
  return apiFetch<InvoicesResponse>(`/invoices${params ? `?${params}` : ''}`, getToken)
}

export function fetchInvoice(getToken: GetToken, id: string) {
  return apiFetch<Invoice>(`/invoices/${id}`, getToken)
}

export function createInvoice(getToken: GetToken, data: Record<string, unknown>) {
  return apiFetch<Invoice>('/invoices', getToken, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function sendInvoice(getToken: GetToken, id: string) {
  return apiFetch<Invoice>(`/invoices/${id}/send`, getToken, { method: 'POST' })
}

export function markInvoicePaid(getToken: GetToken, id: string) {
  return apiFetch<Invoice>(`/invoices/${id}/mark-paid`, getToken, { method: 'POST' })
}
