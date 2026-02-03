'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useTransition } from 'react'

interface Client {
  id: string
  name: string
}

export function ProjectsFilter({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateFilter = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/projects?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search projects..."
        defaultValue={searchParams.get('search') || ''}
        onChange={(e) => updateFilter('search', e.target.value)}
        className={isPending ? 'opacity-50' : ''}
      />
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
        <Select
          defaultValue={searchParams.get('clientId') || 'all'}
          onChange={(e) => updateFilter('clientId', e.target.value)}
          options={[
            { value: 'all', label: 'All Clients' },
            ...clients.map((c) => ({ value: c.id, label: c.name })),
          ]}
          className="w-full sm:w-36"
        />
        <Select
          defaultValue={searchParams.get('status') || 'all'}
          onChange={(e) => updateFilter('status', e.target.value)}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'not_started', label: 'Not Started' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'on_hold', label: 'On Hold' },
            { value: 'completed', label: 'Completed' },
          ]}
          className="w-full sm:w-36"
        />
        <Select
          defaultValue={searchParams.get('priority') || 'all'}
          onChange={(e) => updateFilter('priority', e.target.value)}
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          className="w-full sm:w-36"
        />
        <Select
          defaultValue={searchParams.get('sort') || 'newest'}
          onChange={(e) => updateFilter('sort', e.target.value)}
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'name', label: 'Name (A-Z)' },
            { value: 'name_desc', label: 'Name (Z-A)' },
            { value: 'client', label: 'Client (A-Z)' },
            { value: 'client_desc', label: 'Client (Z-A)' },
            { value: 'due_date', label: 'Due Date (Soonest)' },
            { value: 'due_date_desc', label: 'Due Date (Latest)' },
            { value: 'priority_high', label: 'Priority (High First)' },
            { value: 'priority_low', label: 'Priority (Low First)' },
          ]}
          className="w-full sm:w-48"
        />
      </div>
    </div>
  )
}
