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

export function ProjectsView({ projects, currentSort, healthMap }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Projects ({projects.length})</h2>
        <ViewToggle onViewChange={setViewMode} />
      </div>
      <div className="mt-4">
        <ProjectsList projects={projects} currentSort={currentSort} viewMode={viewMode} healthMap={healthMap} />
      </div>
    </>
  )
}
