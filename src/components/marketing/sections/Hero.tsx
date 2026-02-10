'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '../ScrollReveal';

export function Hero() {
  return (
    <section
      className="min-h-[calc(100vh-64px)] flex items-center"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.05), transparent)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Text content */}
          <div>
            <ScrollReveal delay={0}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                Stay on top of every project, every deadline.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl">
                Project & task management built for freelancers and solo
                creators. Track clients, manage tasks, and hit every deadline.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-8 flex gap-4 flex-wrap">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Start for free
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  See how it works
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column: Screenshot placeholder */}
          <ScrollReveal delay={400} direction="right">
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Browser title bar */}
              <div className="h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              {/* Content area */}
              <Image
                src="/screenshots/dashboard.png"
                alt="Pulse dashboard showing project overview"
                width={1920}
                height={1200}
                className="w-full h-auto"
                priority
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll down indicator */}
        <div className="flex justify-center mt-20">
          <svg
            className="w-6 h-6 text-muted-foreground animate-bounce"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
