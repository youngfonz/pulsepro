import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/expo'
import { searchAll } from '../api/search'

export function useSearch(query: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAll(getToken, query),
    enabled: query.length >= 2,
  })
}
