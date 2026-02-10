import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DashboardCalendar } from '@/components/DashboardCalendar'
import { DashboardGreeting } from '@/components/DashboardGreeting'
import {
  getDashboardStats,
  getProjectsDueThisWeek,
  getTasksDueToday,
  getOverdueTasks,
  getRecentlyViewed,
  getTasksDueThisWeek,
  backfillUserId,
} from '@/actions/dashboard'
import { statusColors, statusLabels, priorityColors, priorityLabels, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  // One-time backfill: assigns orphaned records (userId=null) to the current user
  await backfillUserId()

  const [stats, projectsDueThisWeek, tasksDueToday, overdueTasks, recentlyViewed, tasksDueThisWeekCount] = await Promise.all([
    getDashboardStats(),
    getProjectsDueThisWeek(),
    getTasksDueToday(),
    getOverdueTasks(),
    getRecentlyViewed(),
    getTasksDueThisWeek(),
  ])

  return (
    <div className="space-y-4 md:space-y-6">
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

      {/* Activity Rings - Apple-inspired */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Activity Rings */}
            <div className="relative w-40 h-40 flex-shrink-0">
              {/* Glow effect */}
              <div className="absolute inset-0 blur-xl opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f43f5e" strokeWidth="6" />
                  <circle cx="50" cy="50" r="32" fill="none" stroke="#3b82f6" strokeWidth="6" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="#22c55e" strokeWidth="6" />
                </svg>
              </div>

              {/* Background rings */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-rose-500/20" strokeWidth="6" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" className="text-blue-500/20" strokeWidth="6" />
                <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" className="text-emerald-500/20" strokeWidth="6" />
              </svg>

              {/* Progress rings */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                {/* Outer ring - Projects */}
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#projectGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 264 : 0} 264`}
                  className="drop-shadow-sm"
                />
                {/* Middle ring - Tasks completed */}
                <circle
                  cx="50" cy="50" r="32"
                  fill="none"
                  stroke="url(#taskGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.totalTasks > 0 ? ((stats.totalTasks - stats.pendingTasks) / stats.totalTasks) * 201 : 0} 201`}
                  className="drop-shadow-sm"
                />
                {/* Inner ring - Due this week */}
                <circle
                  cx="50" cy="50" r="22"
                  fill="none"
                  stroke="url(#dueWeekGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.pendingTasks > 0 ? Math.min((tasksDueThisWeekCount / stats.pendingTasks) * 138, 138) : 0} 138`}
                  className="drop-shadow-sm"
                />

                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="projectGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                  <linearGradient id="taskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="dueWeekGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-500">{tasksDueThisWeekCount}</span>
              </div>
            </div>

            {/* Stats Legend */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <Link href="/projects" className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 shadow-sm shadow-rose-500/50" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.activeProjects}<span className="text-sm font-normal text-muted-foreground">/{stats.totalProjects}</span></div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Active Projects</div>
                </div>
              </Link>

              <Link href="/tasks" className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm shadow-blue-500/50" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.totalTasks - stats.pendingTasks}<span className="text-sm font-normal text-muted-foreground">/{stats.totalTasks}</span></div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Tasks Done</div>
                </div>
              </Link>

              <Link href="/tasks" className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/50" />
                <div>
                  <div className="text-2xl font-bold text-emerald-500">{tasksDueThisWeekCount}</div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Due This Week</div>
                </div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <Card className="border-red-500/50 bg-red-500/10 md:col-span-2 lg:col-span-1">
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
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type === 'project'
                        ? 'bg-primary/10 text-primary'
                        : item.type === 'task'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
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
