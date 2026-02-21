'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '../ScrollReveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

const announcements = [
  'Now with AI-powered insights',
  'Now with team workspaces',
  'Telegram bot is live',
  'Voice input — speak your tasks',
  'Get 400% more done',
  'Daily email reminders',
];

const screens = [
  { src: '/screenshots/dashboard.png', label: 'Dashboard', alt: 'Pulse Pro dashboard with project overview and stats', description: 'Activity rings, overdue alerts, and your calendar — everything you need in one glance.' },
  { src: '/screenshots/projects.png', label: 'Projects', alt: 'Pulse Pro projects view with task management', description: 'Every client project with status, priority, and deadlines — no more digging through emails.' },
  { src: '/screenshots/tasks.png', label: 'Tasks', alt: 'Pulse Pro task list with status tracking', description: 'Filter by project, status, or priority. See what\u2019s overdue and what\u2019s next.' },
  { src: '/screenshots/bookmarks.jpg', label: 'Bookmarks', alt: 'Pulse Pro bookmarks for saving important items', description: 'Save articles, videos, and links to any project. Your research, organized.' },
];

function RotatingBadge() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const cycle = useCallback(() => {
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
      setVisible(true);
    }, 300);
  }, []);

  useEffect(() => {
    const timer = setInterval(cycle, 3500);
    return () => {
      clearInterval(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [cycle]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      <span
        className="text-sm font-medium text-foreground transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {announcements[index]}
      </span>
    </div>
  );
}

function ScreenshotCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.2);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % screens.length);
  }, []);

  useEffect(() => {
    if (!isVisible || paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isVisible, paused, next]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* Tab buttons */}
      <div className="inline-flex gap-1 bg-muted/50 rounded-full p-1 overflow-x-auto max-w-full">
        {screens.map((screen, i) => (
          <button
            key={screen.label}
            onClick={() => { setActive(i); setPaused(true); }}
            className={cn(
              'px-3 py-1.5 text-xs sm:text-sm sm:px-4 font-medium rounded-full transition-all duration-200 whitespace-nowrap',
              i === active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {screen.label}
          </button>
        ))}
      </div>

      {/* Screenshot container */}
      <div
        className="mt-6 rounded-2xl overflow-hidden w-full bg-primary/5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="p-4 md:p-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-black/5">
            {/* Browser chrome */}
            <div className="h-9 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <div className="ml-3 flex-1 h-4 bg-gray-200/60 rounded max-w-[180px]" />
            </div>

            <div className="relative aspect-[16/10.5]">
              {screens.map((screen, i) => (
                <Image
                  key={screen.src}
                  src={screen.src}
                  alt={screen.alt}
                  width={1920}
                  height={1200}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500',
                    i === active ? 'opacity-100' : 'opacity-0'
                  )}
                  priority={i <= 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <section className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 w-full">
        {/* Centered text */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal delay={0}>
            <RotatingBadge />
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mt-6">
              Your clients noticed the{' '}
              <span className="text-primary">missed deadline</span>.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              5 clients. 12 deadlines. Zero visibility.
              Pulse Pro shows you what&apos;s overdue, what&apos;s next, and who needs what — in under a minute.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-10 flex gap-4 flex-wrap justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              >
                Get started — it&apos;s free
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                See how it works
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Free forever
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Setup in 5 minutes
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No credit card
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Screenshot carousel */}
        <ScrollReveal delay={300}>
          <div className="mt-16 pt-10 border-t border-border/40">
            <p className="text-sm font-medium text-muted-foreground text-center mb-8 tracking-wide uppercase">
              See it in action
            </p>
            <ScreenshotCarousel />
          </div>
        </ScrollReveal>

        {/* Social proof */}
        <ScrollReveal delay={500}>
          <div className="mt-16 pt-10 border-t border-border/40">
            <p className="text-sm text-muted-foreground text-center mb-8 tracking-wide uppercase">
              Trusted by freelancers, consultants, and small teams
            </p>
            <LogoMarks />

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
              <div>
                <p className="text-2xl font-semibold text-foreground">1,200+</p>
                <p className="text-xs text-muted-foreground mt-0.5">freelancers &amp; teams</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-muted-foreground/15" />
              <div>
                <p className="text-2xl font-semibold text-foreground">45,000+</p>
                <p className="text-xs text-muted-foreground mt-0.5">deadlines tracked</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-muted-foreground/15" />
              <div>
                <p className="text-2xl font-semibold text-foreground">4.9/5</p>
                <p className="text-xs text-muted-foreground mt-0.5">rated by freelancers who switched</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
