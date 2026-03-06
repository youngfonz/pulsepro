const API_BASE = 'https://pulsepro.org/api/v1'

export type GetToken = () => Promise<string | null>

export async function apiFetch<T>(
  path: string,
  getToken: GetToken,
  options?: RequestInit
): Promise<T> {
  const token = await getToken()
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }

  return res.json()
}
