'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface SortableHeaderProps {
  label: string
  sortKey: string
  currentSort?: string
  basePath: string
}

export function SortableHeader({ label, sortKey, currentSort, basePath }: SortableHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isActive = currentSort === sortKey || currentSort === `${sortKey}_desc`
  const isDesc = currentSort === `${sortKey}_desc`

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (currentSort === sortKey) {
      // Currently ascending, switch to descending
      params.set('sort', `${sortKey}_desc`)
    } else if (currentSort === `${sortKey}_desc`) {
      // Currently descending, remove sort
      params.delete('sort')
    } else {
      // Not sorted by this column, sort ascending
      params.set('sort', sortKey)
    }

    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        {isDesc ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
      </span>
    </button>
  )
}
