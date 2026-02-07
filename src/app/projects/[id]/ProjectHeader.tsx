'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateProject, deleteProject } from '@/actions/projects'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  priority: string
  dueDate: Date | null
  budget: number | null
  client: Client
}

interface ProjectHeaderProps {
  project: Project
  clients: { id: string; name: string }[]
  completedTasks: number
  totalTasks: number
  totalHours: number
}

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
}

const statusColors: Record<string, string> = {
  not_started: 'border border-zinc-400/50 text-zinc-500 dark:text-zinc-400 bg-zinc-500/5',
  in_progress: 'border border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/5',
  on_hold: 'border border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/5',
  completed: 'border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5',
}

const priorityColors: Record<string, string> = {
  low: 'border border-zinc-400/50 text-zinc-600 dark:text-zinc-300 bg-zinc-500/5',
  medium: 'border border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/5',
  high: 'border border-rose-500/50 text-rose-600 dark:text-rose-400 bg-rose-500/5',
}

export function ProjectHeader({ project, clients, completedTasks, totalTasks, totalHours }: ProjectHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description || '')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleUpdateField = (field: string, value: string) => {
    const formData = new FormData()
    formData.set('name', field === 'name' ? value : project.name)
    formData.set('description', field === 'description' ? value : project.description || '')
    formData.set('status', project.status)
    formData.set('priority', project.priority)
    formData.set('clientId', project.client.id)
    if (project.dueDate) {
      formData.set('dueDate', new Date(project.dueDate).toISOString().split('T')[0])
    }
    if (project.budget) {
      formData.set('budget', project.budget.toString())
    }

    startTransition(async () => {
      await updateProject(project.id, formData)
    })
  }

  const handleNameSave = () => {
    if (name.trim() && name !== project.name) {
      handleUpdateField('name', name)
    }
    setIsEditingName(false)
  }

  const handleDescriptionSave = () => {
    if (description !== project.description) {
      handleUpdateField('description', description)
    }
    setIsEditingDescription(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) return
    startTransition(async () => {
      await deleteProject(project.id)
      router.push('/projects')
    })
  }

  const handleStatusChange = (newStatus: string) => {
    const formData = new FormData()
    formData.set('name', project.name)
    formData.set('description', project.description || '')
    formData.set('status', newStatus)
    formData.set('priority', project.priority)
    formData.set('clientId', project.client.id)
    if (project.dueDate) {
      formData.set('dueDate', new Date(project.dueDate).toISOString().split('T')[0])
    }
    if (project.budget) {
      formData.set('budget', project.budget.toString())
    }

    startTransition(async () => {
      await updateProject(project.id, formData)
    })
  }

  return (
    <div className="pb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>

          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave()
                if (e.key === 'Escape') {
                  setName(project.name)
                  setIsEditingName(false)
                }
              }}
              autoFocus
              className="text-2xl font-bold border-b-2 border-primary bg-transparent focus:outline-none w-full"
            />
          ) : (
            <h1
              onClick={() => setIsEditingName(true)}
              className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
            >
              {project.name}
            </h1>
          )}

          {isEditingDescription ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionSave}
              rows={2}
              autoFocus
              className="mt-1 w-full text-sm text-muted-foreground border border-border rounded p-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <p
              onClick={() => setIsEditingDescription(true)}
              className="mt-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            >
              {project.description || 'Click to add description...'}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Client:</span>
              <Link
                href={`/clients/${project.client.id}`}
                className="font-medium text-primary hover:underline"
              >
                {project.client.name}
              </Link>
            </div>
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-xs px-2 py-1 rounded font-medium cursor-pointer border-0 ${statusColors[project.status]}`}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div className={`text-xs px-2 py-1 rounded font-medium ${priorityColors[project.priority]}`}>
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
            </div>

            {/* Discreet delete option */}
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Compact Stats Bar */}
      <div className="flex items-center gap-6 mt-4 py-3 border-t border-b border-border text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{totalTasks}</span>
          <span className="text-muted-foreground">tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{progress}%</span>
          <span className="text-muted-foreground">complete</span>
          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{totalHours.toFixed(1)}h</span>
          <span className="text-muted-foreground">tracked</span>
        </div>
        {project.dueDate && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Due</span>
            <span className="font-semibold">
              {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
