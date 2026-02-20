import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DashboardCalendar } from '@/components/DashboardCalendar'
import { DashboardGreeting } from '@/components/DashboardGreeting'
import { OnboardingOverlay } from '@/components/OnboardingOverlay'
import { DashboardProvider, DashboardGrid, DashboardCustomize, type DashboardSectionDef } from '@/components/DashboardLayout'
import { requireUserId } from '@/lib/auth'
import {
  getProjectsDueThisWeek,
  getTasksDueToday,
  getOverdueTasks,
  getRecentlyViewed,
  getProjectHealth,
  getSmartInsights,
  getDashboardStats,
  getTasksDueThisWeek,
  backfillUserId,
} from '@/actions/dashboard'
import { InsightsPanel } from '@/components/InsightsPanel'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { statusColors, statusLabels, priorityColors, priorityLabels, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const userId = await requireUserId()
  await backfillUserId()

  const [projectsDueThisWeek, tasksDueToday, overdueTasks, recentlyViewed, projectHealth, insights, stats, tasksDueThisWeekCount] = await Promise.all([
    getProjectsDueThisWeek(),
    getTasksDueToday(),
    getOverdueTasks(),
    getRecentlyViewed(),
    getProjectHealth(),
    getSmartInsights(),
    getDashboardStats(),
    getTasksDueThisWeek(),
  ])

  const completedTasks = stats.totalTasks - stats.pendingTasks

  const sections: DashboardSectionDef[] = [
    // Overdue — subtle rose accent, not jarring
    ...(overdueTasks.length > 0 ? [{
      id: 'overdue',
      content: (
        <Card className="h-full border-l-2 border-l-rose-500/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-rose-600 dark:text-rose-400 text-base">Overdue</CardTitle>
            <Link href="/tasks" className="text-sm text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {overdueTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="block px-4 py-3 sm:px-6 hover:bg-muted/50 transition-colors"
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
                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    Due {formatDate(task.dueDate)}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    }] : []),

    // Upcoming
    {
      id: 'upcoming',
      content: (
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming</CardTitle>
            <Link href="/tasks" className="text-sm text-primary hover:text-primary/80">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {tasksDueToday.length === 0 && projectsDueThisWeek.length === 0 ? (
              <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                <svg className="w-8 h-8 text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-muted-foreground">Nothing due this week</p>
              </div>
            ) : (
              <div>
                {tasksDueToday.length > 0 && (
                  <div>
                    <p className="px-4 sm:px-6 pt-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Due Today</p>
                    <div className="divide-y divide-border">
                      {tasksDueToday.map((task) => (
                        <Link
                          key={task.id}
                          href={`/tasks/${task.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 sm:px-6 hover:bg-muted transition-colors"
                        >
                          <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground block truncate">{task.title}</span>
                            <p className="text-xs text-muted-foreground truncate">{task.project.name}</p>
                          </div>
                          <Badge className={`${priorityColors[task.priority]} flex-shrink-0`}>
                            {priorityLabels[task.priority]}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {projectsDueThisWeek.length > 0 && (
                  <div className={tasksDueToday.length > 0 ? 'border-t border-border' : ''}>
                    <p className="px-4 sm:px-6 pt-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Projects This Week</p>
                    <div className="divide-y divide-border">
                      {projectsDueThisWeek.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 sm:px-6 hover:bg-muted transition-colors"
                        >
                          <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground block truncate">{project.name}</span>
                            <p className="text-xs text-muted-foreground truncate">{project.client.name} · Due {formatDate(project.dueDate)}</p>
                          </div>
                          <Badge className={`${priorityColors[project.priority]} flex-shrink-0`}>
                            {priorityLabels[project.priority]}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },

    // Project Health
    ...(projectHealth.length > 0 ? [{
      id: 'health',
      content: (
        <Card className="h-full">
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
                      project.label === 'completed' || project.label === 'healthy'
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
                      <Badge className="border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 text-xs">
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
      ),
    }] : []),

    // Recently Viewed
    {
      id: 'recent',
      content: (
        <Card className="h-full">
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
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    </div>
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
      ),
    },

    // Calendar
    {
      id: 'calendar',
      content: (
        <Card className="h-full">
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
      ),
    },
  ]

  return (
    <DashboardProvider>
      <div className="space-y-4 md:space-y-6">
        <OnboardingOverlay userId={userId} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <DashboardGreeting />
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <DashboardCustomize />
            <Link href="/tasks">
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Add Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat Cards + Insights */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <ProgressRing value={completedTasks} max={stats.totalTasks} className="text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold text-foreground">{completedTasks}<span className="text-sm font-normal text-muted-foreground">/{stats.totalTasks}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <ProgressRing
                value={tasksDueThisWeekCount}
                max={Math.max(stats.pendingTasks, 1)}
                label={String(tasksDueThisWeekCount)}
                className={tasksDueThisWeekCount === 0 ? 'text-emerald-500' : tasksDueThisWeekCount > 5 ? 'text-amber-500' : 'text-blue-500'}
              />
              <div>
                <p className="text-xs text-muted-foreground">Due This Week</p>
                <p className="text-lg font-semibold text-foreground">{tasksDueThisWeekCount}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <ProgressRing value={stats.activeProjects} max={stats.totalProjects} className="text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Active Projects</p>
                <p className="text-lg font-semibold text-foreground">{stats.activeProjects}<span className="text-sm font-normal text-muted-foreground">/{stats.totalProjects}</span></p>
              </div>
            </div>
          </div>
          <InsightsPanel insights={insights} />
        </div>

        <DashboardGrid sections={sections} />
      </div>
    </DashboardProvider>
  )
}
