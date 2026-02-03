'use client'

import { Button } from '@/components/ui/Button'
import { deleteClient } from '@/actions/clients'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function DeleteClientButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this client? This will also delete all associated projects and tasks.')) {
      return
    }

    startTransition(async () => {
      await deleteClient(id)
      router.push('/clients')
    })
  }

  return (
    <Button variant="danger" onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete Client'}
    </Button>
  )
}
