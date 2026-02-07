'use client'

import { useTheme } from '@/components/ThemeProvider'

export function SettingsClient() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Theme</p>
          <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
        </div>
        <button
          onClick={toggleTheme}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          style={{ backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--muted)' }}
        >
          <span
            className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
            style={{ transform: theme === 'dark' ? 'translateX(1.375rem)' : 'translateX(0.25rem)' }}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Sidebar</p>
          <p className="text-xs text-muted-foreground">Collapse the sidebar by default</p>
        </div>
        <button
          onClick={() => {
            const current = localStorage.getItem('sidebar-collapsed') === 'true'
            localStorage.setItem('sidebar-collapsed', String(!current))
            window.location.reload()
          }}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          style={{
            backgroundColor: typeof window !== 'undefined' && localStorage.getItem('sidebar-collapsed') === 'true'
              ? 'var(--primary)'
              : 'var(--muted)',
          }}
        >
          <span
            className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
            style={{
              transform: typeof window !== 'undefined' && localStorage.getItem('sidebar-collapsed') === 'true'
                ? 'translateX(1.375rem)'
                : 'translateX(0.25rem)',
            }}
          />
        </button>
      </div>
    </div>
  )
}
