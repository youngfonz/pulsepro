import { apiFetch, GetToken } from './client'
import { DashboardResponse } from '../types/api'

export function fetchDashboard(getToken: GetToken) {
  return apiFetch<DashboardResponse>('/dashboard', getToken)
}
