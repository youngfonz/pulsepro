import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DashboardCalendar } from '@/components/DashboardCalendar'
import { DashboardGreeting } from '@/components/DashboardGreeting'
import { OnboardingOverlay } from '@/components/OnboardingOverlay'
import { requireUserId } from '@/lib/auth'
import {
  getDashboardStats,
  getProjectsDueThisWeek,
  getTasksDueToday,
  getOverdueTasks,
  getRecentlyViewed,
  getTasksDueThisWeek,
  getProjectHealth,
  getSmartInsights,
  backfillUserId,
} from '@/actions/dashboard'
import { InsightsPanel } from '@/components/InsightsPanel'
import { statusColors, statusLabels, priorityColors, priorityLabels, formatDate } from '@/lib/utils'

function ProgressRing({ value, max, size = 48, label, className = '' }: { value: number; max: number; size?: number; label?: string; className?: string }) {
  const strokeWidth = 3.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = max > 0 ? Math.min(value / max, 1) : 0
  const offset = circumference - percentage * circumference

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" className="stroke-muted" />
        {max > 0 && (
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="stroke-current" />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold">{label ?? `${Math.round(percentage * 100)}%`}</span>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const userId = await requireUserId()
  // Assign any orphaned records to the current user
  await backfillUserId()

  const [stats, projectsDueThisWeek, tasksDueToday, overdueTasks, recentlyViewed, tasksDueThisWeekCount, projectHealth, insights] = await Promise.all([
    getDashboardStats(),
    getProjectsDueThisWeek(),
    getTasksDueToday(),
    getOverdueTasks(),
    getRecentlyViewed(),
    getTasksDueThisWeek(),
    getProjectHealth(),
    getSmartInsights(),
  ])

  return (
    <div className="space-y-4 md:space-y-6">
      <OnboardingOverlay userId={userId} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardGreeting />
        <div className="flex gap-2 sm:gap-3">
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

      {/* Pulse Check — Smart Insights */}
      <InsightsPanel insights={insights} />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/projects">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stats.activeProjects}<span className="text-sm font-normal text-muted-foreground">/{stats.totalProjects}</span></p>
              </div>
              <ProgressRing value={stats.activeProjects} max={stats.totalProjects} className="text-blue-500" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/tasks">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stats.totalTasks - stats.pendingTasks}<span className="text-sm font-normal text-muted-foreground">/{stats.totalTasks}</span></p>
              </div>
              <ProgressRing value={stats.totalTasks - stats.pendingTasks} max={stats.totalTasks} className="text-emerald-500" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/tasks">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due This Week</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{tasksDueThisWeekCount}</p>
              </div>
              <ProgressRing
                value={tasksDueThisWeekCount}
                max={Math.max(stats.pendingTasks, 1)}
                label={String(tasksDueThisWeekCount)}
                className={tasksDueThisWeekCount === 0 ? 'text-emerald-500' : tasksDueThisWeekCount > 5 ? 'text-amber-500' : 'text-blue-500'}
              />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <Card className="border-destructive/30 bg-destructive/5 md:col-span-2 lg:col-span-1">
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

        {/* Project Health */}
        {projectHealth.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Health</CardTitle>
              <Link href="/projects" className="text-sm text-primary hover:text-primary/80">
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {projectHealth.slice(0, 6).map((project) => (
                  <Link
                    key={project.projectId}
                    href={project.href}
                    className="flex items-center gap-3 px-4 py-3 sm:px-6 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        project.label === 'completed'
                          ? 'bg-emerald-500'
                          : project.label === 'healthy'
                          ? 'bg-emerald-500'
                          : project.label === 'at_risk'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      title={
                        project.label === 'completed'
                          ? 'Completed'
                          : project.label === 'healthy'
                          ? 'Healthy'
                          : project.label === 'at_risk'
                          ? 'At Risk'
                          : 'Critical'
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{project.projectName}</p>
                      <p className="text-xs text-muted-foreground truncate">{project.clientName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {project.label === 'completed' ? (
                        <Badge className="border border-emerald-500/50 text-emerald-600 bg-emerald-500/5 text-xs">
                          Done
                        </Badge>
                      ) : project.overdueTasks > 0 ? (
                        <span className="text-xs text-rose-500 font-medium">
                          {project.overdueTasks} overdue
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {project.completedTasks}/{project.totalTasks} tasks
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recently Viewed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recently Viewed</CardTitle>
            <Link href="/projects" className="text-sm text-primary hover:text-primary/80">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentlyViewed.length === 0 ? (
              <Link
                href="/projects/new"
                className="block px-4 py-8 text-center text-muted-foreground hover:bg-muted transition-colors"
              >
                No activity yet. Create your first project to get started.
              </Link>
            ) : (
              <div className="divide-y divide-border">
                {recentlyViewed.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors active:bg-muted"
                  >
                    {/* Type Icon */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted text-muted-foreground">
                      {item.type === 'project' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      ) : item.type === 'task' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    </div>
                    {/* Badge */}
                    {item.status && (
                      <Badge className={`${statusColors[item.status]} flex-shrink-0 text-xs`}>
                        {statusLabels[item.status]}
                      </Badge>
                    )}
                    {item.priority && (
                      <Badge className={`${priorityColors[item.priority]} flex-shrink-0 text-xs`}>
                        {priorityLabels[item.priority]}
                      </Badge>
                    )}
                    {item.type === 'bookmark' && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">Bookmark</span>
                    )}
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
