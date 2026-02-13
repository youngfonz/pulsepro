'use client';

import { ScrollReveal } from '../ScrollReveal';

const primaryFeatures = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    title: 'Project Tracking',
    description: 'Organize projects by client, set deadlines, and track progress from start to finish.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Task Management',
    description: 'Create tasks, set priorities, and check them off. Never miss a deadline again.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Client Organization',
    description: 'Keep client details, project history, and communication all in one place.',
  },
];

const secondaryFeatures = [
  {
    title: 'Calendar view',
    description: 'See all deadlines at a glance',
  },
  {
    title: 'Bookmarks',
    description: 'Save important tasks and projects',
  },
  {
    title: 'Due date alerts',
    description: 'Never miss a deadline',
  },
  {
    title: 'Activity dashboard',
    description: 'Track your productivity',
  },
  {
    title: 'Dark mode',
    description: 'Easy on the eyes',
  },
  {
    title: 'File attachments',
    description: 'Keep everything organized',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Everything you need, nothing you don&apos;t.
          </h2>
          <p className="text-base text-muted-foreground mt-3 max-w-xl mx-auto">
            Manage your entire workflow in one place.
          </p>
        </div>

        {/* Primary feature cards */}
        <ScrollReveal delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {primaryFeatures.map((feature) => (
              <div key={feature.title} className="border border-border rounded-lg p-6">
                <div className="w-10 h-10 rounded-md bg-muted text-foreground flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mt-4">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Secondary features */}
        <ScrollReveal delay={0}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {secondaryFeatures.map((feature) => (
              <div key={feature.title} className="p-4">
                <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
