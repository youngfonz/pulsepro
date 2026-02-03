import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProject, getClientsForSelect } from '@/actions/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProjectForm } from '@/components/forms/ProjectForm'
import { DeleteProjectButton } from './DeleteProjectButton'
import { TaskList } from './TaskList'
import { AddTaskForm } from './AddTaskForm'
import { ProjectImages } from './ProjectImages'
import { TimeTracker } from './TimeTracker'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const [project, clients] = await Promise.all([
    getProject(id),
    getClientsForSelect(),
  ])

  if (!project) {
    notFound()
  }

  const completedTasks = project.tasks.filter((t) => t.completed).length
  const totalTasks = project.tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h1 className="mt-2 text-xl md:text-2xl font-bold text-foreground">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Client:{' '}
            <Link
              href={`/clients/${project.client.id}`}
              className="text-link hover:text-link/80"
            >
              {project.client.name}
            </Link>
          </p>
        </div>
        <div className="flex gap-3">
          <DeleteProjectButton id={project.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm project={project} clients={clients} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <span className="font-medium text-foreground">{completedTasks} / {totalTasks}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-right text-sm font-medium text-foreground">{progress}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeTracker projectId={project.id} timeEntries={project.timeEntries} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectImages projectId={project.id} images={project.images} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tasks ({totalTasks})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AddTaskForm projectId={project.id} />
              <TaskList tasks={project.tasks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
