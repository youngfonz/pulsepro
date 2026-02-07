'use client'

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface SidebarAuthProps {
  isCollapsed: boolean
}

export function SidebarAuth({ isCollapsed }: SidebarAuthProps) {
  // Check if Clerk is configured
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerkKeys) {
    return null; // Don't show auth UI if Clerk isn't configured
  }

  return (
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
        <div className={cn("flex items-center gap-3 p-2 rounded hover:bg-secondary transition-colors", isCollapsed && "justify-center")}>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
                userButtonPopoverCard: "shadow-lg",
              }
            }}
            showName={!isCollapsed}
          />
        </div>
      </SignedIn>
    </div>
  )
}
