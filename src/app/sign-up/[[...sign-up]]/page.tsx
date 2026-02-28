'use client'

import { SignUp } from '@clerk/nextjs'
import { PulseLogo } from '@/components/PulseLogo'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <PulseLogo size={40} />
            <span className="text-2xl font-bold text-foreground">Pulse Pro</span>
          </div>
          <p className="text-muted-foreground">Create your account to get started</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Free plan — no credit card required</p>
        </div>
        <SignUp
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none border border-border",
            }
          }}
        />
      </div>
    </div>
  )
}
