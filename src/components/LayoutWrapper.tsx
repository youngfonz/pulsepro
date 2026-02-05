'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'

interface LayoutWrapperProps {
  children: React.ReactNode
  clientCount: number
}

export function LayoutWrapper({ children, clientCount }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar clientCount={clientCount} />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
