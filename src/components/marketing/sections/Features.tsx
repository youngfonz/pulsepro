'use client';

import { ScrollReveal } from '../ScrollReveal';

const primaryFeatures = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    title: 'See every project at a glance',
    description: 'No more digging through emails to find where things stand. One dashboard shows every active project, deadline, and status.',
    color: 'blue' as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Never miss another deadline',
    description: 'Create tasks, set priorities, and get daily email reminders about what\u2019s due. Stop carrying your to-do list in your head.',
    color: 'emerald' as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Keep every client organized',
    description: 'Client details, project history, and active work \u2014 all in one place. Know exactly where things stand before every call.',
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
    title: 'Quick Search (\u2318K)',
    description: 'Find any project, task, or client instantly',
    dot: 'bg-blue-500',
  },
  {
    title: 'Calendar view',
    description: 'See all deadlines at a glance',
    dot: 'bg-emerald-500',
  },
  {
    title: 'Bookmarks',
    description: 'Save links, articles, and resources to projects',
    dot: 'bg-violet-500',
  },
  {
    title: 'Daily email reminders',
    description: 'Know exactly what\u2019s due every morning',
    dot: 'bg-blue-500',
  },
  {
    title: 'Telegram bot',
    description: 'Check tasks and mark them done from Telegram',
    dot: 'bg-[#2AABEE]',
  },
  {
    title: 'Dark mode',
    description: 'Easy on the eyes',
    dot: 'bg-violet-500',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Built for how you actually work.
          </h2>
          <p className="text-base text-muted-foreground mt-3 max-w-xl mx-auto">
            No Gantt charts. No sprint planning. No 30-minute onboarding.
            Just the tools you need to stay on top of your work.
          </p>
        </div>

        {/* Primary feature cards */}
        <ScrollReveal delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {primaryFeatures.map((feature) => {
              const colors = colorMap[feature.color];
              return (
                <div
                  key={feature.title}
                  className={`border border-border ${colors.border} border-t-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200`}
                >
                  <div className={`w-10 h-10 rounded-lg ${colors.iconBg} ${colors.iconText} flex items-center justify-center`}>
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
