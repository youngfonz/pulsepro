import { apiFetch, GetToken } from './client'
import { MeResponse } from '../types/api'

export function fetchMe(getToken: GetToken) {
  return apiFetch<MeResponse>('/auth/me', getToken)
}
