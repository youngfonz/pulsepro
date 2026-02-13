'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
            Ready to take control of your projects?
          </h2>

          <p className="text-base text-muted-foreground mt-4 max-w-md mx-auto">
            Join creators and freelancers who use Pulse to stay organized and ship faster.
          </p>

          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Start for free
          </Link>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
