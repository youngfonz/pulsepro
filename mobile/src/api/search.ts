import { apiFetch, GetToken } from './client'
import { SearchResult } from '../types/api'

interface SearchResponse { results: SearchResult[] }

export function searchAll(getToken: GetToken, query: string) {
  return apiFetch<SearchResponse>(`/search?q=${encodeURIComponent(query)}`, getToken)
}
