'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { useTheme } from './ThemeProvider'

const getNavigation = (clientCount?: number) => [
  {
    name: 'Dashboard',
    href: '/',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Gantt Chart',
    href: '/gantt',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Clients',
    href: '/clients',
    count: clientCount,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  clientCount?: number
}

export function Sidebar({ clientCount }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigation = getNavigation(clientCount)

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored) setIsCollapsed(stored === 'true')
  }, [])

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7  bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Pulse</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className=" p-2 text-sidebar-foreground hover:bg-secondary"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className=" p-2 text-sidebar-foreground hover:bg-secondary"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'md:w-16' : 'w-64'
        )}
      >
        <div className={cn(
          "flex h-14 md:h-16 items-center border-b border-sidebar-border",
          isCollapsed ? "justify-center px-3" : "justify-between px-4"
        )}>
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-2 text-sidebar-foreground hover:bg-secondary rounded"
              title="Collapse sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2">
            {isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="hidden md:flex p-1 text-sidebar-foreground hover:bg-secondary rounded"
                title="Expand sidebar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            {!isCollapsed && (
              <>
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Pulse</h1>
              </>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2 text-sidebar-foreground hover:bg-secondary rounded"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded',
                  isActive
                    ? 'bg-sidebar-accent text-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-secondary hover:text-secondary-foreground',
                  isCollapsed && 'justify-center'
                )}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {'count' in item && item.count !== undefined && (
                      <span className="text-xs text-muted-foreground">({item.count})</span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Auth Section */}
        <div className="border-t border-sidebar-border p-3">
          <SignedOut>
            {!isCollapsed ? (
              <div className="space-y-2">
                <SignInButton mode="modal">
                  <button className="w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full px-3 py-2 text-sm font-medium border border-border rounded hover:bg-secondary transition-colors text-sidebar-foreground">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full p-2 rounded hover:bg-secondary transition-colors" title="Sign In">
                  <svg className="h-5 w-5 text-sidebar-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </SignInButton>
            )}
          </SignedOut>
          <SignedIn>
            <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </>
  )
}
