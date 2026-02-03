'use client'

import { Button } from '@/components/ui/Button'
import { deleteProject } from '@/actions/projects'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return
    }

    startTransition(async () => {
      await deleteProject(id)
      router.push('/projects')
    })
  }

  return (
    <Button variant="danger" onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete Project'}
    </Button>
  )
}
