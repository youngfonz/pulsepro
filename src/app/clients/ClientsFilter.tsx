'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useTransition } from 'react'

export function ClientsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateFilter = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/clients?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search clients..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className={isPending ? 'opacity-50' : ''}
        />
      </div>
      <Select
        defaultValue={searchParams.get('status') || 'all'}
        onChange={(e) => updateFilter('status', e.target.value)}
        options={[
          { value: 'all', label: 'All Statuses' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
        className="w-full sm:w-40"
      />
    </div>
  )
}
