'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Select } from '@/components/ui/Select'
import { useTransition } from 'react'

interface Client {
  id: string
  name: string
}

export function InvoicesFilter({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const status = searchParams.get('status')
  const clientId = searchParams.get('clientId')

  const updateFilter = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      <Select
        value={status || 'all'}
        onChange={(e) => updateFilter('status', e.target.value)}
        options={[
          { value: 'all', label: 'All Statuses' },
          { value: 'draft', label: 'Draft' },
          { value: 'sent', label: 'Sent' },
          { value: 'paid', label: 'Paid' },
          { value: 'overdue', label: 'Overdue' },
        ]}
        className="w-full sm:w-40"
      />
      <Select
        value={clientId || 'all'}
        onChange={(e) => updateFilter('clientId', e.target.value)}
        options={[
          { value: 'all', label: 'All Clients' },
          ...clients.map((c) => ({ value: c.id, label: c.name })),
        ]}
        className="w-full sm:w-48"
      />
    </div>
  )
}
