'use client'

import { useState } from 'react'

interface CompletedSectionProps {
  count: number
  children: React.ReactNode
}

export function CompletedSection({ count, children }: CompletedSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>{count} completed {count === 1 ? 'task' : 'tasks'}</span>
      </button>
      {isOpen && children}
    </div>
  )
}
