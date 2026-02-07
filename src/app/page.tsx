import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DashboardCalendar } from '@/components/DashboardCalendar'
import {
  getDashboardStats,
  getProjectsDueThisWeek,
  getTasksDueToday,
  getOverdueTasks,
  getRecentProjects,
} from '@/actions/dashboard'
import { statusColors, statusLabels, priorityColors, priorityLabels, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const [stats, projectsDueThisWeek, tasksDueToday, overdueTasks, recentProjects] = await Promise.all([
    getDashboardStats(),
    getProjectsDueThisWeek(),
    getTasksDueToday(),
    getOverdueTasks(),
    getRecentProjects(),
  ])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link href="/clients/new" className="flex-1 sm:flex-none">
            <Button variant="secondary" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Client
            </Button>
          </Link>
          <Link href="/tasks" className="flex-1 sm:flex-none">
            <Button variant="secondary" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Button>
          </Link>
          <Link href="/projects/new" className="flex-1 sm:flex-none">
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview - Graph Style */}
      <Card className="border-border/50">
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            {/* Projects Progress Bar */}
            <Link href="/projects" className="block group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Active Projects</span>
                <span className="text-sm text-muted-foreground">{stats.activeProjects} / {stats.totalProjects}</span>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0}%` }}
                />
              </div>
            </Link>

            {/* Tasks Progress Bar */}
            <Link href="/tasks" className="block group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Tasks Completed</span>
                <span className="text-sm text-muted-foreground">{stats.totalTasks - stats.pendingTasks} / {stats.totalTasks}</span>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalTasks > 0 ? ((stats.totalTasks - stats.pendingTasks) / stats.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </Link>

            {/* Overdue Bar */}
            <Link href="/tasks" className="block group">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-medium group-hover:text-primary transition-colors ${overdueTasks.length > 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {overdueTasks.length > 0 ? 'Overdue Tasks' : 'All Caught Up'}
                </span>
                <span className={`text-sm ${overdueTasks.length > 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                  {overdueTasks.length > 0 ? overdueTasks.length : '✓'}
                </span>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${overdueTasks.length > 0 ? 'bg-destructive' : 'bg-emerald-500'}`}
                  style={{ width: overdueTasks.length > 0 ? `${Math.min((overdueTasks.length / Math.max(stats.totalTasks, 1)) * 100, 100)}%` : '100%' }}
                />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Widget */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Calendar</CardTitle>
            <Link href="/calendar" className="text-sm text-primary hover:text-primary/80">
              Full view
            </Link>
          </CardHeader>
          <CardContent>
            <DashboardCalendar />
          </CardContent>
        </Card>

        {/* Projects Due This Week */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projects Due This Week</CardTitle>
            <Link href="/projects" className="text-sm text-primary hover:text-primary/80">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {projectsDueThisWeek.length === 0 ? (
              <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">Week looks clear</p>
                <p className="text-xs text-muted-foreground mt-1">No project deadlines this week</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {projectsDueThisWeek.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block px-4 py-3 sm:px-6 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-foreground block truncate">{project.name}</span>
                        <p className="text-sm text-muted-foreground truncate">{project.client.name}</p>
                      </div>
                      <Badge className={`${priorityColors[project.priority]} flex-shrink-0`}>
                        {priorityLabels[project.priority]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Due {formatDate(project.dueDate)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Due Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tasks Due Today</CardTitle>
            <Link href="/tasks" className="text-sm text-primary hover:text-primary/80">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {tasksDueToday.length === 0 ? (
              <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">All clear!</p>
                <p className="text-xs text-muted-foreground mt-1">No tasks due today</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {tasksDueToday.map((task) => (
                  <Link
                    key={task.id}
                    href={`/projects/${task.project.id}`}
                    className="block px-4 py-3 sm:px-6 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-foreground block truncate">{task.title}</span>
                        <p className="text-sm text-muted-foreground truncate">{task.project.name}</p>
                      </div>
                      <Badge className={`${priorityColors[task.priority]} flex-shrink-0`}>
                        {priorityLabels[task.priority]}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-red-500">Overdue Tasks</CardTitle>
              <Link href="/tasks" className="text-sm text-red-500 hover:text-red-400">
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-red-500/20">
                {overdueTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/projects/${task.project.id}`}
                    className="block px-4 py-3 sm:px-6 hover:bg-red-500/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-red-500 block truncate">{task.title}</span>
                        <p className="text-sm text-red-400 truncate">{task.project.name}</p>
                      </div>
                      <Badge className={`${priorityColors[task.priority]} flex-shrink-0`}>
                        {priorityLabels[task.priority]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-red-400">
                      Due {formatDate(task.dueDate)}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Link href="/projects" className="text-sm text-primary hover:text-primary/80">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentProjects.length === 0 ? (
              <Link
                href="/projects/new"
                className="block px-6 py-8 text-center text-muted-foreground hover:bg-muted transition-colors"
              >
                No projects yet. Click to create your first project.
              </Link>
            ) : (
              <div className="divide-y divide-border">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block px-4 py-3 sm:px-6 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-foreground block truncate">{project.name}</span>
                        <p className="text-sm text-muted-foreground truncate">{project.client.name}</p>
                      </div>
                      <Badge className={`${statusColors[project.status]} flex-shrink-0`}>
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
