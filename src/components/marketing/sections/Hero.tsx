'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="min-h-[calc(100vh-56px)] flex items-center">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-24 w-full">
        {/* Text block */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.08] tracking-tight">
            Project management for independent work.
          </h1>

          <p className="text-lg text-muted-foreground mt-6 max-w-lg leading-relaxed">
            Track clients, manage tasks, and hit every deadline. Built for freelancers who want clarity, not complexity.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/sign-up"
              className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start for free
            </Link>
            <a
              href="#features"
              className="px-5 py-2.5 rounded-md border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Screenshot */}
        <div className="mt-16 border border-border rounded-lg overflow-hidden">
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
    </section>
  );
}
