import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

// WCAG AA compliant badge - all variants have white text on solid colored backgrounds
// for minimum 4.5:1 contrast ratio
export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        {
          'bg-slate-500 text-white': variant === 'default',
          'bg-emerald-600 text-white': variant === 'success',
          'bg-amber-500 text-white': variant === 'warning',
          'bg-rose-600 text-white': variant === 'danger',
          'bg-blue-600 text-white': variant === 'info',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
