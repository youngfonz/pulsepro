'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '../ScrollReveal';

// Abstract geometric logomarks (original SVGs, not real brands)
function LogoMarks() {
  const marks = [
    <svg key="hex" viewBox="0 0 32 32" className="h-6 w-auto"><path d="M16 2l12 7v14l-12 7-12-7V9z" fill="currentColor" /></svg>,
    <svg key="bars" viewBox="0 0 32 32" className="h-6 w-auto"><rect x="4" y="4" width="24" height="6" rx="1" fill="currentColor" /><rect x="8" y="14" width="16" height="6" rx="1" fill="currentColor" /><rect x="12" y="24" width="8" height="6" rx="1" fill="currentColor" /></svg>,
    <svg key="diamond" viewBox="0 0 32 32" className="h-6 w-auto"><path d="M16 2l6 6-6 6-6-6zM26 12l6 6-6 6-6-6zM6 12l6 6-6 6-6-6zM16 22l6 6-6 6-6-6z" fill="currentColor" /></svg>,
    <svg key="rings" viewBox="0 0 40 32" className="h-6 w-auto"><circle cx="12" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="28" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="3" /></svg>,
    <svg key="angle" viewBox="0 0 32 32" className="h-6 w-auto"><path d="M8 4l16 12L8 28" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    <svg key="grid" viewBox="0 0 32 32" className="h-6 w-auto"><circle cx="6" cy="6" r="3" fill="currentColor" /><circle cx="16" cy="6" r="3" fill="currentColor" /><circle cx="26" cy="6" r="3" fill="currentColor" /><circle cx="6" cy="16" r="3" fill="currentColor" /><circle cx="16" cy="16" r="3" fill="currentColor" /><circle cx="26" cy="16" r="3" fill="currentColor" /><circle cx="6" cy="26" r="3" fill="currentColor" /><circle cx="16" cy="26" r="3" fill="currentColor" /><circle cx="26" cy="26" r="3" fill="currentColor" /></svg>,
  ];

  return (
    <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center">
      {marks.map((mark, i) => (
        <div key={i} className="text-foreground/20 hover:text-foreground/40 transition-colors">
          {mark}
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
      {/* Network constellation background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {/* Connection lines */}
          <g stroke="currentColor" className="text-primary/[0.07]" strokeWidth="1" fill="none">
            <line x1="850" y1="80" x2="1050" y2="200" />
            <line x1="1050" y1="200" x2="950" y2="350" />
            <line x1="950" y1="350" x2="1100" y2="450" />
            <line x1="1100" y1="450" x2="1000" y2="600" />
            <line x1="850" y1="80" x2="700" y2="180" />
            <line x1="700" y1="180" x2="950" y2="350" />
            <line x1="700" y1="180" x2="600" y2="350" />
            <line x1="600" y1="350" x2="750" y2="500" />
            <line x1="750" y1="500" x2="1000" y2="600" />
            <line x1="1050" y1="200" x2="1150" y2="100" />
            <line x1="1100" y1="450" x2="1180" y2="350" />
            <line x1="600" y1="350" x2="500" y2="250" />
            <line x1="750" y1="500" x2="650" y2="650" />
            <line x1="1000" y1="600" x2="900" y2="720" />
            <line x1="500" y1="250" x2="400" y2="150" />
            <line x1="400" y1="150" x2="300" y2="250" />
            <line x1="300" y1="250" x2="200" y2="180" />
            <line x1="650" y1="650" x2="500" y2="700" />
          </g>
          {/* Nodes — larger ones at intersections */}
          <g className="text-primary/[0.12]" fill="currentColor">
            <circle cx="850" cy="80" r="4" />
            <circle cx="1050" cy="200" r="5" />
            <circle cx="950" cy="350" r="6" />
            <circle cx="1100" cy="450" r="4" />
            <circle cx="1000" cy="600" r="5" />
            <circle cx="700" cy="180" r="4" />
            <circle cx="600" cy="350" r="5" />
            <circle cx="750" cy="500" r="4" />
            <circle cx="1150" cy="100" r="3" />
            <circle cx="1180" cy="350" r="3" />
            <circle cx="500" cy="250" r="4" />
            <circle cx="650" cy="650" r="3" />
            <circle cx="900" cy="720" r="3" />
            <circle cx="400" cy="150" r="3" />
            <circle cx="300" cy="250" r="3" />
            <circle cx="200" cy="180" r="2" />
            <circle cx="500" cy="700" r="2" />
          </g>
          {/* Accent rings on key nodes */}
          <g className="text-primary/[0.06]" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="950" cy="350" r="16" />
            <circle cx="1050" cy="200" r="12" />
            <circle cx="600" cy="350" r="12" />
            <circle cx="1000" cy="600" r="14" />
          </g>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column: Text content */}
          <div>
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-foreground">Now in public beta</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.1] tracking-tight">
                Project management,{' '}
                <span className="text-primary">minus the complexity</span>.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl leading-relaxed">
                No steep learning curve. No features you&apos;ll never use.
                Just clients, projects, and tasks — organized in seconds.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-8 flex gap-4 flex-wrap">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                >
                  Start for free
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  See how it works
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free to start
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column: Screenshot */}
          <ScrollReveal delay={300} direction="right">
            <div className="relative">
              <div className="absolute -top-3 -right-3 w-full h-full rounded-xl border border-primary/15 bg-primary/[0.03]" />
              <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Browser title bar */}
                <div className="h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-3 flex-1 h-5 bg-background/60 rounded-md max-w-[200px]" />
                </div>

                <Image
                  src="/screenshots/dashboard.png"
                  alt="Pulse dashboard showing project overview"
                  width={1920}
                  height={1200}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Logo strip */}
        <ScrollReveal delay={500}>
          <div className="mt-20 pt-12 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center mb-8 tracking-wide uppercase">
              Used by founders and creatives all over the world
            </p>
            <LogoMarks />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
