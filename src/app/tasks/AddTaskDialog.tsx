'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { VoiceInput } from '@/components/ui/VoiceInput'
import { createTask } from '@/actions/tasks'
import { parseTaskFromVoice } from '@/lib/voice'

interface Project {
  id: string
  name: string
  client: {
    name: string
  } | null
}

interface AddTaskDialogProps {
  projects: Project[]
}

export function AddTaskDialog({ projects }: AddTaskDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Controlled form state for voice input
  const [projectId, setProjectId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  const handleVoiceInput = (transcript: string) => {
    const parsed = parseTaskFromVoice(transcript)

    // Auto-populate form fields
    if (parsed.title) setTitle(parsed.title)
    if (parsed.description) setDescription(parsed.description)
    if (parsed.priority) setPriority(parsed.priority)
    if (parsed.dueDate) setDueDate(parsed.dueDate)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!projectId) return

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      await createTask(projectId, formData)
      setIsOpen(false)
      // Reset form
      setProjectId('')
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      router.refresh()
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Task
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background  shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Add New Task</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  id="project"
                  name="project"
                  label="Project *"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                  options={[
                    { value: '', label: 'Select a project' },
                    ...projects.map((project) => ({
                      value: project.id,
                      label: `${project.name}${project.client ? ` - ${project.client.name}` : ''}`,
                    })),
                  ]}
                />

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                    Task Title *
                  </label>
                  <div className="flex items-start gap-2">
                    <Input
                      id="title"
                      name="title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter task title"
                      className="flex-1"
                    />
                    <VoiceInput
                      onTranscript={handleVoiceInput}
                      placeholder="Speak to create task"
                    />
                  </div>
                </div>

                <Textarea
                  id="description"
                  name="description"
                  label="Description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description..."
                />

                <Select
                  id="priority"
                  name="priority"
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ]}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    label="Start Date"
                  />
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    label="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending || !projectId} className="w-full sm:w-auto">
                    {isPending ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
