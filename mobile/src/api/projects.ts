import { apiFetch, GetToken } from './client'
import { Project } from '../types/api'

interface ProjectsResponse { projects: Project[] }

export function fetchProjects(getToken: GetToken, filters?: Record<string, string>) {
  const params = new URLSearchParams(filters || {}).toString()
  return apiFetch<ProjectsResponse>(`/projects${params ? `?${params}` : ''}`, getToken)
}

export function fetchProject(getToken: GetToken, id: string) {
  return apiFetch<Project>(`/projects/${id}`, getToken)
}

export function createProject(getToken: GetToken, data: Partial<Project>) {
  return apiFetch<Project>('/projects', getToken, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateProject(getToken: GetToken, id: string, data: Partial<Project>) {
  return apiFetch<Project>(`/projects/${id}`, getToken, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteProject(getToken: GetToken, id: string) {
  return apiFetch<{ success: boolean }>(`/projects/${id}`, getToken, { method: 'DELETE' })
}
