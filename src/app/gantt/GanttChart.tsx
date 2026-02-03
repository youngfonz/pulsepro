'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { statusColors, statusLabels } from '@/lib/utils'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: string
  startDate: Date | null
  dueDate: Date | null
}

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
  tasks: Task[]
}

interface GanttChartProps {
  projects: Project[]
}

export function GanttChart({ projects }: GanttChartProps) {
  const [viewWeeks, setViewWeeks] = useState(8)
  const [startOffset, setStartOffset] = useState(0)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const startDate = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() - 7 + startOffset * 7)
    return d
  }, [today, startOffset])

  const endDate = useMemo(() => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + viewWeeks * 7)
    return d
  }, [startDate, viewWeeks])

  const days = useMemo(() => {
    const result = []
    const current = new Date(startDate)
    while (current <= endDate) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [startDate, endDate])

  // Generate week markers for the header
  const weekMarkers = useMemo(() => {
    const result: { date: Date; position: number }[] = []
    days.forEach((day, index) => {
      if (day.getDay() === 1 || index === 0) { // Monday or first day
        result.push({ date: day, position: (index / days.length) * 100 })
      }
    })
    return result
  }, [days])

  const getBarStyle = (start: Date | null, end: Date | null) => {
    if (!start && !end) return null

    const effectiveStart = start ? new Date(start) : end ? new Date(end) : null
    const effectiveEnd = end ? new Date(end) : start ? new Date(start) : null

    if (!effectiveStart || !effectiveEnd) return null

    effectiveStart.setHours(0, 0, 0, 0)
    effectiveEnd.setHours(0, 0, 0, 0)

    const totalDays = days.length
    const dayWidth = 100 / totalDays

    const startDiff = Math.floor((effectiveStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const endDiff = Math.floor((effectiveEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const left = Math.max(0, startDiff * dayWidth)
    const right = Math.min(100, (endDiff + 1) * dayWidth)
    const width = Math.max(dayWidth, right - left)

    if (left >= 100 || right <= 0) return null

    return {
      left: `${left}%`,
      width: `${width}%`,
    }
  }

  const formatWeekDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const todayPosition = useMemo(() => {
    const todayOffset = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    const percentage = (todayOffset / days.length) * 100
    if (percentage < 0 || percentage > 100) return null
    return percentage
  }, [today, startDate, days.length])

  const getPriorityBarColor = (priority: string, completed: boolean) => {
    if (completed) return 'bg-emerald-600'
    switch (priority) {
      case 'high': return 'bg-rose-600'
      case 'medium': return 'bg-blue-600'
      default: return 'bg-slate-500'
    }
  }

  if (projects.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-muted-foreground">
        No projects found. Create a project to see the timeline.
      </div>
    )
  }

  return (
    <div className="min-w-[800px] relative">
      {/* Controls */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStartOffset(startOffset - 4)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Earlier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStartOffset(0)}
            className="text-muted-foreground hover:text-foreground"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStartOffset(startOffset + 4)}
            className="text-muted-foreground hover:text-foreground"
          >
            Later →
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          {[4, 8, 12].map((w) => (
            <Button
              key={w}
              variant={viewWeeks === w ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewWeeks(w)}
              className={viewWeeks !== w ? 'text-muted-foreground hover:text-foreground' : ''}
            >
              {w}w
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex">
          <div className="w-56 flex-shrink-0 border-r border-border px-4 py-3">
            <span className="text-sm font-medium text-foreground">Project / Task</span>
          </div>
          <div className="flex-1 relative h-12">
            {/* Week labels */}
            {weekMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute top-0 h-full flex items-center"
                style={{ left: `${marker.position}%` }}
              >
                <div className="pl-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {formatWeekDate(marker.date)}
                </div>
              </div>
            ))}

            {/* Today marker in header */}
            {todayPosition !== null && (
              <div
                className="absolute top-0 h-full flex flex-col items-center"
                style={{ left: `${todayPosition}%` }}
              >
                <div className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-b">
                  Today
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project rows */}
      <div>
        {projects.map((project, projectIndex) => (
          <div key={project.id} className={projectIndex > 0 ? 'border-t border-border' : ''}>
            {/* Project header row */}
            <div className="flex group hover:bg-muted/30 transition-colors">
              <div className="w-56 flex-shrink-0 border-r border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge className={`${statusColors[project.status]} text-xs`}>
                    {statusLabels[project.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground truncate">{project.client.name}</span>
                </div>
              </div>
              <div className="flex-1 relative py-3 bg-muted/5">
                {/* Subtle week dividers */}
                {weekMarkers.map((marker, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 w-px bg-border/50"
                    style={{ left: `${marker.position}%` }}
                  />
                ))}

                {/* Today line */}
                {todayPosition !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                    style={{ left: `${todayPosition}%` }}
                  />
                )}
              </div>
            </div>

            {/* Task rows */}
            {project.tasks.map((task) => {
              const barStyle = getBarStyle(task.startDate, task.dueDate)
              return (
                <div key={task.id} className="flex group hover:bg-muted/30 transition-colors">
                  <div className="w-56 flex-shrink-0 border-r border-border px-4 py-2.5 pl-6">
                    <Link
                      href={`/projects/${project.id}`}
                      className={`text-sm truncate block hover:text-link transition-colors ${
                        task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </Link>
                  </div>
                  <div className="flex-1 relative py-2.5">
                    {/* Subtle week dividers */}
                    {weekMarkers.map((marker, index) => (
                      <div
                        key={index}
                        className="absolute top-0 bottom-0 w-px bg-border/30"
                        style={{ left: `${marker.position}%` }}
                      />
                    ))}

                    {/* Today line */}
                    {todayPosition !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary/50 z-10"
                        style={{ left: `${todayPosition}%` }}
                      />
                    )}

                    {/* Task bar */}
                    {barStyle && (
                      <div className="relative h-6 mx-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className={`absolute h-full rounded-md shadow-sm cursor-pointer
                            hover:brightness-110 hover:shadow-md transition-all
                            ${getPriorityBarColor(task.priority, task.completed)}`}
                          style={barStyle}
                          title={`${task.title}${task.startDate ? ` | Start: ${formatWeekDate(new Date(task.startDate))}` : ''}${task.dueDate ? ` | Due: ${formatWeekDate(new Date(task.dueDate))}` : ''}`}
                        >
                          <span className="absolute inset-0 flex items-center px-2 text-xs text-white font-medium truncate">
                            {task.title}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-4 py-3 border-t border-border bg-card">
        <span className="text-xs text-muted-foreground">Priority:</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-600" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-600" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-500" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-600" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
