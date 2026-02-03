import Link from 'next/link'
import { getProjects, getClientsForSelect } from '@/actions/projects'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SortableHeader } from '@/components/ui/SortableHeader'
import { statusColors, statusLabels, priorityColors, priorityLabels, formatDate, isOverdue } from '@/lib/utils'
import { ProjectsFilter } from './ProjectsFilter'

interface Props {
  searchParams: Promise<{ search?: string; status?: string; priority?: string; clientId?: string; sort?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams
  const [projects, clients] = await Promise.all([
    getProjects(params),
    getClientsForSelect(),
  ])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="mt-2 text-xl md:text-2xl font-bold text-foreground">Projects</h1>
        </div>
        <Link href="/projects/new">
          <Button className="w-full sm:w-auto">Add Project</Button>
        </Link>
      </div>

      <ProjectsFilter clients={clients} />

      <Card>
        <CardHeader>
          <CardTitle>All Projects ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              No projects found. Create your first project to get started.
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                      <th className="px-6 py-3">
                        <SortableHeader label="Project" sortKey="name" currentSort={params.sort} basePath="/projects" />
                      </th>
                      <th className="px-6 py-3">
                        <SortableHeader label="Client" sortKey="client" currentSort={params.sort} basePath="/projects" />
                      </th>
                      <th className="px-6 py-3 min-w-[120px]">Status</th>
                      <th className="px-6 py-3">
                        <SortableHeader label="Priority" sortKey="priority_high" currentSort={params.sort} basePath="/projects" />
                      </th>
                      <th className="px-6 py-3">
                        <SortableHeader label="Due Date" sortKey="due_date" currentSort={params.sort} basePath="/projects" />
                      </th>
                      <th className="px-6 py-3">Tasks</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projects.map((project) => {
                      const overdue = isOverdue(project.dueDate) && project.status !== 'completed'
                      return (
                        <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4">
                            <Link
                              href={`/projects/${project.id}`}
                              className="font-medium text-link hover:text-link/80"
                            >
                              {project.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/clients/${project.client.id}`}
                              className="text-muted-foreground hover:text-link"
                            >
                              {project.client.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={statusColors[project.status]}>
                              {statusLabels[project.status]}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={priorityColors[project.priority]}>
                              {priorityLabels[project.priority]}
                            </Badge>
                          </td>
                          <td className={`px-6 py-4 ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                            {formatDate(project.dueDate)}
                            {overdue && ' (Overdue)'}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {project._count.tasks}
                          </td>
                          <td className="px-6 py-4 text-right">
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
                          {project._count.tasks} task{project._count.tasks !== 1 ? 's' : ''}
                        </span>
                      </div>
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
        </CardContent>
      </Card>
    </div>
  )
}
