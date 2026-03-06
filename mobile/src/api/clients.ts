import { apiFetch, GetToken } from './client'
import { Client } from '../types/api'

interface ClientsResponse { clients: Client[] }

export function fetchClients(getToken: GetToken, filters?: Record<string, string>) {
  const params = new URLSearchParams(filters || {}).toString()
  return apiFetch<ClientsResponse>(`/clients${params ? `?${params}` : ''}`, getToken)
}

export function fetchClient(getToken: GetToken, id: string) {
  return apiFetch<Client>(`/clients/${id}`, getToken)
}

export function createClient(getToken: GetToken, data: Partial<Client>) {
  return apiFetch<Client>('/clients', getToken, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateClient(getToken: GetToken, id: string, data: Partial<Client>) {
  return apiFetch<Client>(`/clients/${id}`, getToken, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteClient(getToken: GetToken, id: string) {
  return apiFetch<{ success: boolean }>(`/clients/${id}`, getToken, { method: 'DELETE' })
}
