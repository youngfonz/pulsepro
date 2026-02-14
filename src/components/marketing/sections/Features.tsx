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
    color: 'blue' as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Task Management',
    description: 'Create tasks, set priorities, and check them off. Never miss a deadline again.',
    color: 'emerald' as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Client Organization',
    description: 'Keep client details, project history, and communication all in one place.',
    color: 'violet' as const,
  },
];

const colorMap = {
  blue: {
    iconBg: 'bg-blue-500/10',
    iconText: 'text-blue-500',
    border: 'border-t-blue-500',
    dot: 'bg-blue-500',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-500',
    border: 'border-t-emerald-500',
    dot: 'bg-emerald-500',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    iconText: 'text-violet-500',
    border: 'border-t-violet-500',
    dot: 'bg-violet-500',
  },
} as const;

const secondaryFeatures = [
  {
    title: 'Calendar view',
    description: 'See all deadlines at a glance',
    dot: 'bg-blue-500',
  },
  {
    title: 'Bookmarks',
    description: 'Save important tasks and projects',
    dot: 'bg-emerald-500',
  },
  {
    title: 'Daily email reminders',
    description: 'Get notified about upcoming and overdue tasks',
    dot: 'bg-violet-500',
  },
  {
    title: 'Mobile-friendly',
    description: 'Fully responsive — manage everything from your phone',
    dot: 'bg-blue-500',
  },
  {
    title: 'Dark mode',
    description: 'Easy on the eyes',
    dot: 'bg-emerald-500',
  },
  {
    title: 'File attachments',
    description: 'Keep everything organized',
    dot: 'bg-violet-500',
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
            No 200-page docs. No week-long setup. Open it, use it, done.
          </p>
        </div>

        {/* App preview illustration */}
        <ScrollReveal delay={0}>
          <div className="mt-14 rounded-xl bg-[#0f172a] border border-white/10 p-4 md:p-6 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="ml-3 h-6 w-48 rounded bg-white/5" />
            </div>

            <div className="grid grid-cols-12 gap-3 md:gap-4">
              {/* Sidebar */}
              <div className="col-span-3 space-y-2 hidden md:block">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5">
                  <div className="w-4 h-4 rounded bg-blue-500/30" />
                  <div className="h-3 w-16 rounded bg-white/20" />
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded">
                  <div className="w-4 h-4 rounded bg-white/10" />
                  <div className="h-3 w-12 rounded bg-white/10" />
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded">
                  <div className="w-4 h-4 rounded bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/10" />
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="h-2.5 w-20 rounded bg-white/10" />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="h-2.5 w-16 rounded bg-white/10" />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <div className="h-2.5 w-24 rounded bg-white/10" />
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="col-span-12 md:col-span-9 space-y-3">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="h-2 w-12 rounded bg-white/10 mb-2" />
                    <div className="text-lg md:text-xl font-bold text-white">12</div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 mt-2">
                      <div className="h-1.5 w-3/4 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="h-2 w-10 rounded bg-white/10 mb-2" />
                    <div className="text-lg md:text-xl font-bold text-white">47</div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 mt-2">
                      <div className="h-1.5 w-2/3 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="h-2 w-14 rounded bg-white/10 mb-2" />
                    <div className="text-lg md:text-xl font-bold text-white">5</div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 mt-2">
                      <div className="h-1.5 w-1/2 rounded-full bg-violet-500" />
                    </div>
                  </div>
                </div>

                {/* Task list */}
                <div className="rounded-lg bg-white/5 divide-y divide-white/5">
                  <div className="flex items-center gap-3 px-3 py-2.5 md:px-4">
                    <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="h-2.5 w-32 md:w-40 rounded bg-white/20" />
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">Done</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 md:px-4 bg-blue-500/5">
                    <div className="w-4 h-4 rounded border-2 border-blue-500" />
                    <div className="h-2.5 w-36 md:w-48 rounded bg-white/20" />
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">In Progress</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 md:px-4">
                    <div className="w-4 h-4 rounded border-2 border-white/20" />
                    <div className="h-2.5 w-28 md:w-36 rounded bg-white/10" />
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 font-medium">High</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 md:px-4">
                    <div className="w-4 h-4 rounded border-2 border-white/20" />
                    <div className="h-2.5 w-24 md:w-32 rounded bg-white/10" />
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-medium">Todo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Primary feature cards */}
        <ScrollReveal delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {primaryFeatures.map((feature) => {
              const colors = colorMap[feature.color];
              return (
                <div
                  key={feature.title}
                  className={`border border-border ${colors.border} border-t-2 rounded-lg p-6 hover:shadow-md transition-shadow`}
                >
                  <div className={`w-10 h-10 rounded-md ${colors.iconBg} ${colors.iconText} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold mt-4">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Secondary features */}
        <ScrollReveal delay={0}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {secondaryFeatures.map((feature) => (
              <div key={feature.title} className="p-4 flex gap-3">
                <div className={`w-2 h-2 rounded-full ${feature.dot} mt-1.5 flex-shrink-0`} />
                <div>
                  <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
