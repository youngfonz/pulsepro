'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SECTION_LABELS: Record<string, string> = {
  overdue: 'Overdue Tasks',
  upcoming: 'Upcoming',
  health: 'Project Health',
  recent: 'Recently Viewed',
  calendar: 'Calendar',
}

interface DashboardContextType {
  hidden: string[]
  toggleHidden: (id: string) => void
}

const DashboardContext = createContext<DashboardContextType>({
  hidden: [],
  toggleHidden: () => {},
})

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboard-hidden')
      if (saved) setHidden(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  const toggleHidden = (id: string) => {
    setHidden(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      localStorage.setItem('dashboard-hidden', JSON.stringify(next))
      return next
    })
  }

  return (
    <DashboardContext.Provider value={{ hidden: mounted ? hidden : [], toggleHidden }}>
      {children}
    </DashboardContext.Provider>
  )
}

// --- Sortable card wrapper ---

function SortableCard({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group/card ${isDragging ? 'z-10 opacity-60 scale-[1.02]' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover/card:opacity-100 focus:opacity-100 cursor-grab active:cursor-grabbing px-4 py-1 rounded-b-md text-muted-foreground/40 hover:text-muted-foreground transition-opacity"
        title="Drag to reorder"
      >
        <svg className="w-5 h-1.5" viewBox="0 0 20 6" fill="currentColor">
          <rect x="0" y="0" width="20" height="2" rx="1" />
          <rect x="0" y="4" width="20" height="2" rx="1" />
        </svg>
      </button>
      {children}
    </div>
  )
}

// --- Dashboard grid with drag-and-drop ---

export interface DashboardSectionDef {
  id: string
  content: ReactNode
}

export function DashboardGrid({ sections }: { sections: DashboardSectionDef[] }) {
  const { hidden } = useContext(DashboardContext)
  const [order, setOrder] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboard-order')
      if (saved) setOrder(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  // Filter out hidden sections
  const visible = sections.filter(s => !hidden.includes(s.id))

  // Sort by stored order, append any new sections at the end
  const sorted = mounted && order.length > 0
    ? [...visible].sort((a, b) => {
        const ai = order.indexOf(a.id)
        const bi = order.indexOf(b.id)
        return (ai >= 0 ? ai : 999) - (bi >= 0 ? bi : 999)
      })
    : visible

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const ids = sorted.map(s => s.id)
      const oldIndex = ids.indexOf(active.id as string)
      const newIndex = ids.indexOf(over.id as string)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(ids, oldIndex, newIndex)
        setOrder(newOrder)
        localStorage.setItem('dashboard-order', JSON.stringify(newOrder))
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map(s => s.id)} strategy={rectSortingStrategy}>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map(section => (
            <SortableCard key={section.id} id={section.id}>
              {section.content}
            </SortableCard>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

// --- Customize dropdown ---

export function DashboardCustomize() {
  const { hidden, toggleHidden } = useContext(DashboardContext)
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
            const visible = !hidden.includes(id)
            return (
              <button
                key={id}
                onClick={() => toggleHidden(id)}
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
