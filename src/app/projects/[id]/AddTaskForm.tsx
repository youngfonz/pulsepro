'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { createTask } from '@/actions/tasks'

export function AddTaskForm({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await createTask(projectId, formData)
      setIsOpen(false)
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="secondary" className="w-full">
        + Add Task
      </Button>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
      <Input
        id="title"
        name="title"
        placeholder="Task title..."
        required
        autoFocus
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          id="priority"
          name="priority"
          defaultValue="medium"
          options={[
            { value: 'low', label: 'Low Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'high', label: 'High Priority' },
          ]}
          className="w-full sm:flex-1"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="w-full sm:flex-1">
          <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            className="w-full"
          />
        </div>
        <div className="w-full sm:flex-1">
          <label className="block text-xs text-muted-foreground mb-1">Due Date</label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            className="w-full"
          />
        </div>
      </div>
      <Textarea
        id="notes"
        name="notes"
        placeholder="Add notes (optional)..."
        rows={2}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Task'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
