'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { addTimeEntry, deleteTimeEntry } from '@/actions/projects'
import { formatDate } from '@/lib/utils'

interface TimeEntry {
  id: string
  hours: number
  description: string | null
  date: Date
}

interface TimeTrackerProps {
  projectId: string
  timeEntries: TimeEntry[]
}

export function TimeTracker({ projectId, timeEntries }: TimeTrackerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isPending, startTransition] = useTransition()

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await addTimeEntry(projectId, formData)
      setIsAdding(false)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this time entry?')) return
    startTransition(async () => {
      await deleteTimeEntry(id)
    })
  }

  const formatHours = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">{formatHours(totalHours)}</p>
          <p className="text-sm text-muted-foreground">Total hours logged</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            + Log Time
          </Button>
        )}
      </div>

      {/* Add Time Form */}
      {isAdding && (
        <form action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="hours"
              name="hours"
              type="number"
              step="0.25"
              min="0.25"
              placeholder="Hours"
              required
              autoFocus
            />
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
          <Input
            id="description"
            name="description"
            placeholder="What did you work on? (optional)"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? 'Saving...' : 'Log Time'}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Time Entries List */}
      {timeEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Recent entries</p>
          <div className="divide-y divide-border rounded-lg border border-border">
            {timeEntries.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between px-3 py-2 ${isPending ? 'opacity-50' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{formatHours(entry.hours)}</span>
                    <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                  </div>
                  {entry.description && (
                    <p className="text-sm text-muted-foreground truncate">{entry.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete entry"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {timeEntries.length > 10 && (
            <p className="text-sm text-muted-foreground text-center">
              + {timeEntries.length - 10} more entries
            </p>
          )}
        </div>
      )}
    </div>
  )
}
