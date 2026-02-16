'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ScrollReveal } from '../ScrollReveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

const screens = [
  { src: '/screenshots/dashboard.png', label: 'Dashboard', alt: 'Pulse Pro dashboard with project overview and stats' },
  { src: '/screenshots/projects.png', label: 'Projects', alt: 'Pulse Pro projects view with task management' },
  { src: '/screenshots/tasks.png', label: 'Tasks', alt: 'Pulse Pro task list with status tracking' },
  { src: '/screenshots/bookmarks.png', label: 'Bookmarks', alt: 'Pulse Pro bookmarks for saving important items' },
];

export function AppShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.2);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % screens.length);
  }, []);

  // Auto-rotate every 4 seconds when visible and not paused
  useEffect(() => {
    if (!isVisible || paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isVisible, paused, next]);

  return (
    <section className="py-20 md:py-28 bg-[#0f172a]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <ScrollReveal delay={0}>
          <h2 className="text-3xl font-semibold text-white tracking-tight text-center">
            See it in action
          </h2>
          <p className="text-base text-white/60 mt-3 text-center max-w-xl mx-auto">
            From project dashboards to task lists and bookmarks — explore the workspace that keeps freelancers organized.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200} direction="none">
          <div className="flex flex-col items-center mt-10">
            {/* Tab buttons */}
            <div className="inline-flex gap-1 rounded-lg bg-white/5 p-1">
              {screens.map((screen, i) => (
                <button
                  key={screen.label}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    i === active
                      ? 'bg-[#58a6ff] text-white shadow-sm'
                      : 'text-white/50 hover:text-white/80'
                  )}
                >
                  {screen.label}
                </button>
              ))}
            </div>

            {/* Auto-rotate progress bar */}
            {!paused && (
              <div className="mt-4 flex gap-2">
                {screens.map((_, i) => (
                  <div key={i} className="h-0.5 w-8 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full bg-[#58a6ff] transition-all',
                        i === active ? 'animate-progress' : i < active ? 'w-full' : 'w-0'
                      )}
                      style={i === active ? { animation: 'progress 4s linear' } : undefined}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Browser frame */}
            <div
              className="mt-6 w-full max-w-4xl"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                {/* Browser title bar */}
                <div className="h-10 bg-[#1e293b] border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <div className="ml-3 flex-1 flex justify-center">
                    <div className="h-5 bg-white/5 rounded-md px-3 flex items-center max-w-[280px] w-full">
                      <svg className="w-3 h-3 text-white/30 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-[11px] text-white/30 truncate">app.pulsepro.work</span>
                    </div>
                  </div>
                  <div className="w-[62px]" />
                </div>

                {/* Screenshot */}
                <div className="relative aspect-[16/10] bg-[#0f172a]">
                  {screens.map((screen, i) => (
                    <Image
                      key={screen.src}
                      src={screen.src}
                      alt={screen.alt}
                      width={1920}
                      height={1200}
                      className={cn(
                        'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                        i === active ? 'opacity-100' : 'opacity-0'
                      )}
                      priority={i === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
