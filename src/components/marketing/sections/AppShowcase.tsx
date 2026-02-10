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
    <section className="relative overflow-hidden bg-[#0f172a] py-20 md:py-28" ref={ref}>
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
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full border border-white/10" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        <ScrollReveal delay={0}>
          <span className="block text-sm font-semibold tracking-widest uppercase text-[#58a6ff] text-center">
            See it in action
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mt-3">
            Everything you need, one clean view.
          </h2>
          <p className="text-lg text-white/60 mt-4 text-center max-w-2xl mx-auto">
            From project dashboards to task lists and bookmarks — explore the workspace that keeps freelancers organized.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200} direction="none">
          <div className="flex flex-col items-center mt-12">
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
                      ? 'bg-[#58a6ff] text-white'
                      : 'bg-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.12] border border-white/[0.08]'
                  }`}
                >
                  {screen.label}
                </button>
              ))}
            </div>

            {/* Browser frame */}
            <div
              className="bg-[#1e293b] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden w-full"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Browser title bar */}
              <div className="h-10 bg-white/[0.05] border-b border-white/[0.08] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-white/40">{screens[active].label}</span>
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
                    i === active ? 'w-6 bg-[#58a6ff]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`View ${screen.label}`}
                />
              ))}
            </div>

            <p className="text-sm text-white/40 text-center mt-3">
              Your workspace, organized.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
