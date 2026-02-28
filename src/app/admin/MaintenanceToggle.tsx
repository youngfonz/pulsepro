'use client'

import { useTransition } from 'react'
import { toggleMaintenanceMode } from '@/actions/admin'

export function MaintenanceToggle({ enabled }: { enabled: boolean }) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    if (enabled) {
      startTransition(async () => { await toggleMaintenanceMode() })
    } else {
      if (!confirm('Enable maintenance mode?\n\nAll non-admin users will be locked out of the platform immediately.')) return
      startTransition(async () => { await toggleMaintenanceMode() })
    }
  }

  return (
    <div className={`rounded-lg border px-4 py-4 flex items-center justify-between ${
      enabled
        ? 'border-rose-500/50 bg-rose-500/5'
        : 'border-border'
    }`}>
      <div>
        <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {enabled
            ? 'Platform is locked — only admins can access'
            : 'Platform is live for all users'
          }
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
          isPending ? 'opacity-50 cursor-wait' : 'cursor-pointer'
        } ${
          enabled
            ? 'bg-rose-500 focus:ring-rose-500'
            : 'bg-zinc-300 dark:bg-zinc-600 focus:ring-primary'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
