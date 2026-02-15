import Link from 'next/link'
import type { Insight } from '@/actions/dashboard'

const colorStyles = {
  red: {
    border: 'border-l-rose-500',
    icon: 'text-rose-500',
    bg: 'bg-rose-500/5',
  },
  amber: {
    border: 'border-l-amber-500',
    icon: 'text-amber-500',
    bg: 'bg-amber-500/5',
  },
  blue: {
    border: 'border-l-blue-500',
    icon: 'text-blue-500',
    bg: 'bg-blue-500/5',
  },
  green: {
    border: 'border-l-emerald-500',
    icon: 'text-emerald-500',
    bg: 'bg-emerald-500/5',
  },
}

function InsightIcon({ color }: { color: Insight['color'] }) {
  const cls = `w-4 h-4 ${colorStyles[color].icon}`

  switch (color) {
    case 'red':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'amber':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'blue':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'green':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight) => {
        const styles = colorStyles[insight.color]
        return (
          <Link
            key={insight.id}
            href={insight.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border border-l-[3px] ${styles.border} ${styles.bg} hover:shadow-sm transition-shadow`}
          >
            <InsightIcon color={insight.color} />
            <p className="text-sm text-foreground flex-1 min-w-0">
              {insight.message}
            </p>
            <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )
      })}
    </div>
  )
}
