'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { Badge } from '@/components/ui/Badge'
import { updateTaskStatus } from '@/actions/board'
import { priorityColors, priorityLabels, formatDate, isOverdue } from '@/lib/utils'

interface Task {
  id: string
  title: string
  status: string
  sortOrder?: number
  priority: string
  dueDate: Date | null
}

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
] as const

function getTaskStatus(task: Task): string {
  return task.status || 'todo'
}

export function TaskBoard({ tasks, canEdit = true }: { tasks: Task[]; canEdit?: boolean }) {
  const [items, setItems] = useState(() => {
    const grouped: Record<string, Task[]> = { todo: [], in_progress: [], done: [] }
    tasks.forEach((t) => {
      const status = getTaskStatus(t)
      if (grouped[status]) {
        grouped[status].push(t)
      } else {
        grouped.todo.push(t)
      }
    })
    // Sort by sortOrder within each column
    Object.values(grouped).forEach((col) => col.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)))
    return grouped
  })

  const [activeId, setActiveId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
  )

  const activeTask = activeId
    ? Object.values(items).flat().find((t) => t.id === activeId)
    : null

  function findColumn(taskId: string): string | null {
    for (const [col, colTasks] of Object.entries(items)) {
      if (colTasks.some((t) => t.id === taskId)) return col
    }
    return null
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeCol = findColumn(active.id as string)
    // over.id could be a column id or a task id
    let overCol = COLUMNS.some((c) => c.id === over.id)
      ? (over.id as string)
      : findColumn(over.id as string)

    if (!activeCol || !overCol || activeCol === overCol) return

    setItems((prev) => {
      const task = prev[activeCol].find((t) => t.id === active.id)
      if (!task) return prev
      return {
        ...prev,
        [activeCol]: prev[activeCol].filter((t) => t.id !== active.id),
        [overCol]: [...prev[overCol], task],
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event
    setActiveId(null)

    const col = findColumn(active.id as string)
    if (!col) return

    const idx = items[col].findIndex((t) => t.id === active.id)
    startTransition(async () => {
      await updateTaskStatus(active.id as string, col, idx)
    })
  }

  return (
    <DndContext
      sensors={canEdit ? sensors : []}
      collisionDetection={closestCorners}
      onDragStart={canEdit ? handleDragStart : undefined}
      onDragOver={canEdit ? handleDragOver : undefined}
      onDragEnd={canEdit ? handleDragEnd : undefined}
    >
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            tasks={items[col.id]}
            count={items[col.id].length}
            canEdit={canEdit}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

function Column({ id, label, tasks, count, canEdit = true }: { id: string; label: string; tasks: Task[]; count: number; canEdit?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border border-border p-3 min-h-[200px] min-w-[220px] flex-1 transition-colors ${
        isOver ? 'bg-primary/5 border-primary/30' : 'bg-muted/30'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {count}
        </span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} canEdit={canEdit} />
        ))}
      </div>
    </div>
  )
}

function TaskCard({ task, canEdit = true }: { task: Task; canEdit?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: !canEdit,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  const overdue = isOverdue(task.dueDate) && task.status !== 'done'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-background border border-border rounded-md p-3 transition-shadow hover:shadow-sm ${
        canEdit ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'opacity-30' : ''}`}
    >
      <p className={`text-sm font-medium ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
        {task.title}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <Badge className={`${priorityColors[task.priority]} text-[10px] px-1.5 py-0`}>
          {priorityLabels[task.priority]}
        </Badge>
        {task.dueDate && (
          <span className={`text-[10px] ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  )
}

function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="bg-background border border-primary/30 rounded-md p-3 shadow-lg w-[250px]">
      <p className="text-sm font-medium text-foreground">{task.title}</p>
      <div className="flex items-center gap-2 mt-2">
        <Badge className={`${priorityColors[task.priority]} text-[10px] px-1.5 py-0`}>
          {priorityLabels[task.priority]}
        </Badge>
      </div>
    </div>
  )
}
