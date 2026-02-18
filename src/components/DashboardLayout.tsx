'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
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
  editing: boolean
  toggleHidden: (id: string) => void
  setEditing: (editing: boolean) => void
}

const DashboardContext = createContext<DashboardContextType>({
  hidden: [],
  editing: false,
  toggleHidden: () => {},
  setEditing: () => {},
})

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
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
    <DashboardContext.Provider value={{ hidden: mounted ? hidden : [], editing, toggleHidden, setEditing }}>
      {children}
    </DashboardContext.Provider>
  )
}

// --- Sortable card wrapper ---

function SortableCard({ id, children }: { id: string; children: ReactNode }) {
  const { editing, toggleHidden } = useContext(DashboardContext)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !editing })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-10 opacity-60 scale-[1.02]' : ''} ${editing ? 'ring-1 ring-border ring-dashed rounded-lg' : ''}`}
    >
      {editing && (
        <>
          {/* Drag handle — visible in edit mode */}
          <button
            {...attributes}
            {...listeners}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 cursor-grab active:cursor-grabbing px-5 py-1.5 rounded-b-md bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            title="Drag to reorder"
          >
            <svg className="w-5 h-1.5" viewBox="0 0 20 6" fill="currentColor">
              <rect x="0" y="0" width="20" height="2" rx="1" />
              <rect x="0" y="4" width="20" height="2" rx="1" />
            </svg>
          </button>
          {/* Hide button */}
          <button
            onClick={() => toggleHidden(id)}
            className="absolute top-2 right-2 z-10 p-1 rounded-md bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={`Hide ${SECTION_LABELS[id] || id}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      )}
      {children}
    </div>
  )
}

// --- Hidden section placeholder ---

function HiddenSectionCard({ id }: { id: string }) {
  const { toggleHidden } = useContext(DashboardContext)
  const label = SECTION_LABELS[id] || id

  return (
    <button
      onClick={() => toggleHidden(id)}
      className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Show {label}
    </button>
  )
}

// --- Dashboard grid with drag-and-drop ---

export interface DashboardSectionDef {
  id: string
  content: ReactNode
}

export function DashboardGrid({ sections }: { sections: DashboardSectionDef[] }) {
  const { hidden, editing } = useContext(DashboardContext)
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

  // IDs of sections that are hidden but exist in the data
  const hiddenSectionIds = sections.filter(s => hidden.includes(s.id)).map(s => s.id)

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
          {editing && hiddenSectionIds.map(id => (
            <HiddenSectionCard key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

// --- Customize toggle ---

export function DashboardCustomize() {
  const { editing, setEditing, hidden } = useContext(DashboardContext)

  return (
    <button
      onClick={() => setEditing(!editing)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
        editing
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {editing ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Done
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Customize
          {hidden.length > 0 && (
            <span className="ml-0.5 text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 leading-none">
              {hidden.length}
            </span>
          )}
        </>
      )}
    </button>
  )
}
