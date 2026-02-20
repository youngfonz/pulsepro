'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface SidebarAuthProps {
  isCollapsed: boolean
}

export function SidebarAuth({ isCollapsed }: SidebarAuthProps) {
  return (
    <div className="border-t border-sidebar-border p-3 space-y-2">
      <SignedOut>
        <SignInButton mode="modal">
          <button
            className={cn(
              "flex items-center gap-3 w-full rounded-lg transition-colors hover:bg-secondary/80",
              isCollapsed ? "justify-center p-2" : "px-3 py-2.5"
            )}
            title={isCollapsed ? "Sign In" : undefined}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium text-sidebar-foreground">Sign in</span>
            )}
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className={cn(
          "flex items-center w-full rounded-lg",
          isCollapsed ? "justify-center" : ""
        )}>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "shadow-lg",
                userButtonTrigger: cn(
                  "flex items-center gap-3 w-full rounded-lg transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-0",
                  isCollapsed ? "justify-center p-2" : "px-3 py-2.5"
                ),
                userButtonOuterIdentifier: "!text-sidebar-foreground text-sm font-medium",
              }
            }}
            showName={!isCollapsed}
          />
        </div>
      </SignedIn>
    </div>
  )
}
