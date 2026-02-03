'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface TasksFilterProps {
  currentDate?: string
  currentStatus?: string
  currentPriority?: string
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function TasksFilter({ currentDate, currentStatus, currentPriority }: TasksFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/tasks?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/tasks')
  }

  const hasFilters = currentDate || currentStatus || currentPriority

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={currentStatus || 'all'}
        onChange={(e) => updateFilter('status', e.target.value)}
        options={statusOptions}
        className="w-36"
      />

      <Select
        value={currentPriority || 'all'}
        onChange={(e) => updateFilter('priority', e.target.value)}
        options={priorityOptions}
        className="w-36"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
