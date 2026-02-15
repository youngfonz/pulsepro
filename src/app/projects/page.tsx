import Link from 'next/link'
import { getProjects, getClientsForSelect } from '@/actions/projects'
import { getProjectHealth } from '@/actions/dashboard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ProjectsFilter } from './ProjectsFilter'
import { ProjectsView } from './ProjectsView'

interface Props {
  searchParams: Promise<{ search?: string; status?: string; priority?: string; clientId?: string; sort?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams
  const [projects, clients, health] = await Promise.all([
    getProjects(params),
    getClientsForSelect(),
    getProjectHealth(),
  ])

  const healthMap: Record<string, 'healthy' | 'at_risk' | 'critical' | 'completed'> = {}
  for (const h of health) {
    healthMap[h.projectId] = h.label
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard"
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
          <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </Button>
        </Link>
      </div>

      <ProjectsFilter clients={clients} />

      <Card>
        <CardContent className="p-6">
          {projects.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No projects found. Create your first project to get started.
            </div>
          ) : (
            <ProjectsView projects={projects} currentSort={params.sort} healthMap={healthMap} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
