'use client';

import Link from 'next/link';
import { ScrollReveal } from '../ScrollReveal';
import { WavyBackground } from '@/components/ui/wavy-background';

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
        <div key={i} className="text-white/20 hover:text-white/40 transition-colors">
          {mark}
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
      {/* Wavy animated background */}
      <WavyBackground
        containerClassName="absolute inset-0"
        className="w-full h-full"
        colors={["#1e3a5f", "#2563eb", "#1d4ed8", "#58a6ff", "#0c4a6e"]}
        backgroundFill="#0f172a"
        blur={12}
        speed="slow"
        waveOpacity={0.4}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 py-20 w-full text-center">
        <ScrollReveal delay={0}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-white">Now in public beta</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight">
            Stop juggling clients{' '}
            <span className="text-[#58a6ff]">in your head</span>.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-lg md:text-xl text-white/70 mt-6 max-w-xl mx-auto leading-relaxed">
            You have 5 clients, 12 deadlines, and zero idea what&apos;s overdue.
            You don&apos;t need a tool built for 50-person teams — you need to know what&apos;s due today.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#58a6ff] text-white font-medium hover:bg-[#58a6ff]/90 transition-all duration-200 hover:shadow-lg hover:shadow-[#58a6ff]/20"
            >
              Start for free
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
            >
              See how it works
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="mt-8 flex items-center gap-4 text-sm text-white/60 justify-center">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Setup in 5 minutes
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              No credit card
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </div>
          </div>
        </ScrollReveal>

        {/* Logo strip */}
        <ScrollReveal delay={500}>
          <div className="mt-20 pt-12 border-t border-white/10">
            <p className="text-sm text-white/40 text-center mb-8 tracking-wide uppercase">
              Trusted by freelancers, consultants, and small teams
            </p>
            <LogoMarks />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
