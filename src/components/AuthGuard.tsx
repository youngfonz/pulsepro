'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const publicPaths = ['/sign-in', '/sign-up', '/about', '/contact', '/privacy', '/terms', '/kb', '/invoice/', '/maintenance', '/suspended']
  const isPublicPath = pathname === '/' || publicPaths.some(path => pathname.startsWith(path))

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isPublicPath) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, isPublicPath, router])

  // Public pages render immediately — no auth gate, no SSR blocking
  if (isPublicPath) {
    return <>{children}</>
  }

  // Show loading while Clerk initializes (non-public pages only)
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <div className="w-10 h-10 bg-primary/20 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
