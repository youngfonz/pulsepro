'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { CommandBar } from './CommandBar'

interface LayoutWrapperProps {
  children: React.ReactNode
  clientCount: number
  clerkEnabled?: boolean
}

export function LayoutWrapper({ children, clientCount, clerkEnabled = false }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')
  const isMarketingPage = pathname === '/'

  if (isAuthPage || isMarketingPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background overflow-x-clip overflow-y-hidden w-full max-w-[100vw]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground">
        Skip to main content
      </a>
      <Sidebar clientCount={clientCount} clerkEnabled={clerkEnabled} />
      <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto pt-14 md:pt-0">
        <div className="p-4 md:p-6">{children}</div>
      </main>
      <CommandBar />
    </div>
  )
}
