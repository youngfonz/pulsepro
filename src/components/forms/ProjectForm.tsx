'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { createProject, updateProject } from '@/actions/projects'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface Project {
  id: string
  name: string
  description: string | null
  notes: string | null
  status: string
  priority: string
  dueDate: Date | null
  budget: number | null
  clientId: string
}

interface Client {
  id: string
  name: string
}

interface ProjectFormProps {
  project?: Project
  clients: Client[]
  defaultClientId?: string
  onSuccess?: () => void
}

export function ProjectForm({ project, clients, defaultClientId, onSuccess }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      if (project) {
        await updateProject(project.id, formData)
      } else {
        await createProject(formData)
      }
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/projects')
      }
    })
  }

  const formatDateForInput = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        label="Project Name *"
        required
        defaultValue={project?.name}
        placeholder="Project name"
      />
      <Textarea
        id="description"
        name="description"
        label="Description"
        rows={3}
        defaultValue={project?.description || ''}
        placeholder="Project description..."
      />
      <Textarea
        id="notes"
        name="notes"
        label="Notes"
        rows={4}
        defaultValue={project?.notes || ''}
        placeholder="Add any additional notes..."
      />
      <Select
        id="clientId"
        name="clientId"
        label="Client *"
        required
        defaultValue={project?.clientId || defaultClientId || ''}
        options={[
          { value: '', label: 'Select a client...' },
          ...clients.map((c) => ({ value: c.id, label: c.name })),
        ]}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id="status"
          name="status"
          label="Status"
          defaultValue={project?.status || 'not_started'}
          options={[
            { value: 'not_started', label: 'Not Started' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'on_hold', label: 'On Hold' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        <Select
          id="priority"
          name="priority"
          label="Priority"
          defaultValue={project?.priority || 'medium'}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          label="Due Date"
          defaultValue={formatDateForInput(project?.dueDate || null)}
        />
        <Input
          id="budget"
          name="budget"
          type="number"
          step="0.01"
          min="0"
          label="Budget ($)"
          defaultValue={project?.budget?.toString() || ''}
          placeholder="0.00"
        />
      </div>
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
