'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'

const SECTION_LABELS: Record<string, string> = {
  overdue: 'Overdue Tasks',
  upcoming: 'Upcoming',
  health: 'Project Health',
  recent: 'Recently Viewed',
  calendar: 'Calendar',
}

interface DashboardContextType {
  hiddenSections: string[]
  toggleSection: (id: string) => void
}

const DashboardContext = createContext<DashboardContextType>({
  hiddenSections: [],
  toggleSection: () => {},
})

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [hiddenSections, setHiddenSections] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboard-hidden')
      if (saved) setHiddenSections(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  const toggleSection = (id: string) => {
    setHiddenSections(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      localStorage.setItem('dashboard-hidden', JSON.stringify(next))
      return next
    })
  }

  return (
    <DashboardContext.Provider value={{ hiddenSections: mounted ? hiddenSections : [], toggleSection }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function DashboardSection({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  const { hiddenSections } = useContext(DashboardContext)
  if (hiddenSections.includes(id)) return null
  return <div className={className}>{children}</div>
}

export function DashboardCustomize() {
  const { hiddenSections, toggleSection } = useContext(DashboardContext)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Customize dashboard"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-52 rounded-lg border border-border bg-background shadow-lg z-20 py-1">
          <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Show sections</p>
          {Object.entries(SECTION_LABELS).map(([id, label]) => {
            const visible = !hiddenSections.includes(id)
            return (
              <button
                key={id}
                onClick={() => toggleSection(id)}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  visible ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                }`}>
                  {visible && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={visible ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
