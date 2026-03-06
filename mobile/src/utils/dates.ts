import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d, yyyy')
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function isOverdue(dateStr: string | null | undefined, status?: string): boolean {
  if (!dateStr || status === 'done') return false
  return isPast(new Date(dateStr))
}

export function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d')
}
