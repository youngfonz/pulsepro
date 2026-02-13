'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { SortableHeader } from '@/components/ui/SortableHeader'
import { statusColors, statusLabels, priorityColors, priorityLabels, formatDate, isOverdue } from '@/lib/utils'

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
  viewMode: 'table' | 'grid'
}

export function ProjectsList({ projects, currentSort, viewMode }: Props) {
  return (
    <>

      {/* Table View */}
      {viewMode === 'table' && (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">
                    <SortableHeader label="Project" sortKey="name" currentSort={currentSort} basePath="/projects" />
                  </th>
                  <th className="px-4 py-3">
                    <SortableHeader label="Client" sortKey="client" currentSort={currentSort} basePath="/projects" />
                  </th>
                  <th className="px-4 py-3 min-w-[120px]">
                    <SortableHeader label="Status" sortKey="status" currentSort={currentSort} basePath="/projects" />
                  </th>
                  <th className="px-4 py-3">
                    <SortableHeader label="Priority" sortKey="priority" currentSort={currentSort} basePath="/projects" />
                  </th>
                  <th className="px-4 py-3">
                    <SortableHeader label="Due Date" sortKey="due_date" currentSort={currentSort} basePath="/projects" />
                  </th>
                  <th className="px-4 py-3">Tasks</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => {
                  const overdue = isOverdue(project.dueDate) && project.status !== 'completed'
                  return (
                    <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-link hover:text-link/80"
                        >
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/clients/${project.client.id}`}
                          className="text-muted-foreground hover:text-link"
                        >
                          {project.client.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[project.status]}>
                          {statusLabels[project.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={priorityColors[project.priority]}>
                          {priorityLabels[project.priority]}
                        </Badge>
                      </td>
                      <td className={`px-4 py-3 ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                        {formatDate(project.dueDate)}
                        {overdue && ' (Overdue)'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {project._count.tasks}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-sm text-link hover:text-link/80"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet cards */}
          <div className="divide-y divide-border lg:hidden">
            {projects.map((project) => {
              const overdue = isOverdue(project.dueDate) && project.status !== 'completed'
              const completedTasks = project.tasks.filter(t => t.completed).length
              const totalTasks = project._count.tasks
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{project.client.name}</p>
                    </div>
                    <svg className="h-5 w-5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge className={statusColors[project.status]}>
                      {statusLabels[project.status]}
                    </Badge>
                    <Badge className={priorityColors[project.priority]}>
                      {priorityLabels[project.priority]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {completedTasks}/{totalTasks} task{totalTasks !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {totalTasks > 0 && (
                    <div className="mt-2 w-full h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  {project.dueDate && (
                    <p className={`mt-2 text-sm ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      Due: {formatDate(project.dueDate)}
                      {overdue && ' (Overdue)'}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => {
            const overdue = isOverdue(project.dueDate) && project.status !== 'completed'
            const completedTasks = project.tasks.filter(t => t.completed).length
            const totalTasks = project._count.tasks
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
                  <CardContent className="p-5 space-y-4">
                    {/* Project Name */}
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-link transition-colors line-clamp-2">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {project.client.name}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={statusColors[project.status]}>
                        {statusLabels[project.status]}
                      </Badge>
                      <Badge className={priorityColors[project.priority]}>
                        {priorityLabels[project.priority]}
                      </Badge>
                    </div>

                    {/* Progress */}
                    {totalTasks > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{completedTasks}/{totalTasks} tasks</span>
                          <span className="font-medium text-foreground">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Due Date */}
                    {project.dueDate && (
                      <div className="pt-2 border-t border-border">
                        <p className={`text-sm ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                          <span className="font-medium">Due:</span> {formatDate(project.dueDate)}
                          {overdue && (
                            <span className="block mt-1 text-xs">(Overdue)</span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Tasks Count (only show if no progress bar shown) */}
                    {totalTasks === 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>No tasks yet</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
