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
    <section className="py-20 md:py-28 border-t border-border" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <ScrollReveal delay={0}>
          <h2 className="text-3xl font-semibold text-foreground tracking-tight text-center">
            See it in action
          </h2>
          <p className="text-base text-muted-foreground mt-3 text-center max-w-xl mx-auto">
            From project dashboards to task lists and bookmarks — explore the workspace that keeps freelancers organized.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200} direction="none">
          <div className="flex flex-col items-center mt-10">
            {/* Tab buttons */}
            <div className="flex justify-center gap-1">
              {screens.map((screen, i) => (
                <button
                  key={screen.label}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    i === active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {screen.label}
                </button>
              ))}
            </div>

            {/* Screenshot container */}
            <div
              className="mt-6 border border-border rounded-lg overflow-hidden w-full"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative aspect-[16/10]">
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
        </ScrollReveal>
      </div>
    </section>
  );
}
