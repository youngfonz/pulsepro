'use client'

import { useState, useEffect } from 'react'
import { ViewToggle } from './ViewToggle'
import { ProjectsList } from './ProjectsList'

interface Project {
  id: string
  name: string
  status: string
  priority: string
  dueDate: Date | null
  client: {
    id: string
    name: string
  }
  tasks: { id: string; completed: boolean }[]
  _count: {
    tasks: number
  }
}

interface Props {
  projects: Project[]
  currentSort?: string
  healthMap?: Record<string, 'healthy' | 'at_risk' | 'critical' | 'completed'>
}

type ViewMode = 'table' | 'grid'

function isProjectCompleted(p: Project): boolean {
  if (p.status === 'completed') return true
  if (p.tasks.length > 0 && p.tasks.every(t => t.completed)) return true
  return false
}

export function ProjectsView({ projects, currentSort, healthMap }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const activeCount = projects.filter(p => !isProjectCompleted(p)).length

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Projects ({activeCount})</h2>
        <ViewToggle onViewChange={setViewMode} />
      </div>
      <div className="mt-4">
        <ProjectsList projects={projects} currentSort={currentSort} viewMode={viewMode} healthMap={healthMap} />
      </div>
    </>
  )
}
