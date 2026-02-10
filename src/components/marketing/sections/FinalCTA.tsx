'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] py-20 md:py-28">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.07]" viewBox="0 0 400 400">
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <g key={`${row}-${col}`} transform={`translate(${col * 40 + 20}, ${row * 40 + 20})`}>
                <line x1="-5" y1="0" x2="5" y2="0" stroke="white" strokeWidth="1" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="white" strokeWidth="1" />
              </g>
            ))
          )}
        </svg>
        {/* Large accent circle */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full border border-white/10" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 md:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to take control of your projects?
          </h2>

          <p className="text-lg text-white/70 mt-4 max-w-xl mx-auto">
            Join creators and freelancers who use Pulse to stay organized and ship faster.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-[#0f172a] font-semibold text-lg hover:bg-white/90 hover:shadow-xl hover:shadow-black/10 transition-all duration-200"
            >
              Start for free
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-white/25 text-white font-medium text-lg hover:bg-white/10 transition-all duration-200"
            >
              View pricing
            </a>
          </div>

          <p className="mt-6 text-sm text-white/50">
            No credit card required
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
