'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200/80 via-blue-200/60 to-emerald-200/70 dark:from-rose-500/20 dark:via-blue-500/15 dark:to-emerald-500/20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-200/40 via-transparent to-amber-100/50 dark:from-violet-500/10 dark:via-transparent dark:to-amber-500/10" />

            <div className="relative px-8 py-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                Stop losing work to tab overload.
              </h2>

              <p className="text-base text-muted-foreground mt-4 max-w-md mx-auto">
                Every client, project, and deadline in one place.
                Set up in 5 minutes. Free forever.
              </p>

              <Link
                href="/sign-up"
                className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg"
              >
                Get started — it&apos;s free
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <p className="mt-4 text-sm text-muted-foreground/70">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
