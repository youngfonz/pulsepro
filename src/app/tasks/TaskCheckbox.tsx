'use client'

import { useTransition } from 'react'
import { toggleTask } from '@/actions/tasks'

interface TaskCheckboxProps {
  taskId: string
  completed: boolean
}

export function TaskCheckbox({ taskId, completed }: TaskCheckboxProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTask(taskId)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
        completed
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-gray-300 hover:border-gray-400'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      {completed && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}
