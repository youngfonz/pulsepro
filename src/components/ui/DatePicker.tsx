'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  id?: string
  name?: string
  label?: string
  value?: string // yyyy-MM-dd (controlled)
  defaultValue?: string // yyyy-MM-dd (uncontrolled)
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parseDate(value: string): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function formatDisplay(value: string): string {
  const date = parseDate(value)
  if (!date) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function toValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function DatePicker({ id, name, label, value: controlledValue, defaultValue = '', onChange, className, placeholder = 'Pick a date' }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  function setValue(v: string) {
    if (!isControlled) setInternalValue(v)
    onChange?.(v)
  }

  const today = new Date()
  const selected = parseDate(value)
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth())
  const containerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Sync view when value changes externally
  useEffect(() => {
    const d = parseDate(value)
    if (d) {
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  // Position calendar above if it would overflow below
  useEffect(() => {
    if (!open || !calendarRef.current || !containerRef.current) return
    const cal = calendarRef.current
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const calHeight = cal.offsetHeight
    const spaceBelow = window.innerHeight - rect.bottom - 8
    if (spaceBelow < calHeight && rect.top > calHeight) {
      cal.style.bottom = '100%'
      cal.style.top = 'auto'
      cal.style.marginBottom = '4px'
      cal.style.marginTop = '0'
    } else {
      cal.style.top = '100%'
      cal.style.bottom = 'auto'
      cal.style.marginTop = '4px'
      cal.style.marginBottom = '0'
    }
  }, [open, viewMonth, viewYear])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  function selectDay(day: number) {
    const date = new Date(viewYear, viewMonth, day)
    setValue(toValue(date))
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    setValue('')
    setOpen(false)
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  // Build the calendar grid
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" id={id} name={name} value={value} />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:border-muted-foreground/50 transition-colors"
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              onClick={handleClear}
              className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )}
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div
          ref={calendarRef}
          className="absolute left-0 z-[60] w-[280px] rounded-lg border border-border bg-card shadow-lg"
        >
          {/* Header: month navigation */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-foreground">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-2 pt-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-2 pb-2">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} />
              }
              const date = new Date(viewYear, viewMonth, day)
              const isToday = isSameDay(date, today)
              const isSelected = selected ? isSameDay(date, selected) : false
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={cn(
                    'h-8 w-8 mx-auto rounded-md text-sm transition-colors',
                    isSelected
                      ? 'bg-primary text-primary-foreground font-medium'
                      : isToday
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Today shortcut */}
          <div className="border-t border-border px-3 py-1.5">
            <button
              type="button"
              onClick={() => {
                setViewMonth(today.getMonth())
                setViewYear(today.getFullYear())
                setValue(toValue(today))
                setOpen(false)
              }}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
