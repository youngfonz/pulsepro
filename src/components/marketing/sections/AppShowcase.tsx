'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ScrollReveal } from '../ScrollReveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const screens = [
  { src: '/screenshots/dashboard.png', label: 'Dashboard', alt: 'Pulse dashboard with project overview and stats' },
  { src: '/screenshots/projects.png', label: 'Projects', alt: 'Pulse projects view with task management' },
  { src: '/screenshots/tasks.png', label: 'Tasks', alt: 'Pulse task list with status tracking' },
  { src: '/screenshots/bookmarks.png', label: 'Bookmarks', alt: 'Pulse bookmarks for saving important items' },
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
    <section className="bg-muted py-20 md:py-28" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <ScrollReveal delay={0} direction="none">
          <div className="flex flex-col items-center">
            {/* Tab buttons */}
            <div className="flex gap-2 mb-6">
              {screens.map((screen, i) => (
                <button
                  key={screen.label}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    i === active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {screen.label}
                </button>
              ))}
            </div>

            {/* Browser frame */}
            <div
              className="bg-card border border-border rounded-xl shadow-xl overflow-hidden w-full"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Browser title bar */}
              <div className="h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-muted-foreground">{screens[active].label}</span>
              </div>

              {/* Screenshot with crossfade */}
              <div className="relative aspect-[16/10] bg-background">
                {screens.map((screen, i) => (
                  <Image
                    key={screen.src}
                    src={screen.src}
                    alt={screen.alt}
                    width={1920}
                    height={1200}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      i === active ? 'opacity-100' : 'opacity-0'
                    }`}
                    priority={i === 0}
                  />
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-4">
              {screens.map((screen, i) => (
                <button
                  key={screen.label}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground'
                  }`}
                  aria-label={`View ${screen.label}`}
                />
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center mt-3">
              Your workspace, organized.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
