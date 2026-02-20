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
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Never miss another deadline',
    description: 'Create tasks, set priorities, and get daily reminders about what\u2019s due. Stop carrying your to-do list in your head.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Keep every client organized',
    description: 'Client details, project history, and active work \u2014 all in one place. Know exactly where things stand before every call.',
  },
];

const secondaryFeatures = [
  { title: 'Find anything in 2 keystrokes', description: 'Projects, tasks, clients \u2014 instantly with \u2318K' },
  { title: 'See your month at a glance', description: 'Every deadline on one calendar' },
  { title: 'Save anything to a project', description: 'Bookmark links, articles, and resources' },
  { title: 'Wake up knowing what\u2019s due', description: 'Daily email with your priorities for the day' },
  { title: 'Manage tasks without opening a browser', description: 'Check off tasks and add new ones from Telegram' },
  { title: 'Invite your team', description: 'Shared workspaces with project-level access control' },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/50">
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
            {primaryFeatures.map((feature) => (
              <div
                key={feature.title}
                className="border border-border border-t-highlight border-t-2 rounded-xl p-6 bg-card hover:shadow-lg transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-highlight/10 text-highlight flex items-center justify-center">
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
              <div key={feature.title} className="p-4 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-highlight mt-1.5 flex-shrink-0" />
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
