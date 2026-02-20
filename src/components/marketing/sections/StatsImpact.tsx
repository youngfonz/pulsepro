'use client'

import { ScrollReveal } from '../ScrollReveal'

const stats = [
  {
    number: '400%',
    label: 'more done per week',
    context: 'when every deadline, client, and task is in one place.',
  },
  {
    number: '8 hrs',
    label: 'saved every week',
    context: 'no more jumping between Notion, Trello, email, and Slack.',
  },
  {
    number: '0',
    label: 'missed deadlines',
    context: 'daily reminders, calendar view, and Telegram pings.',
  },
]

export function StatsImpact() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <ScrollReveal delay={0}>
          <div className="rounded-2xl bg-[#0a0a0a] border border-white/[0.08] p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center md:text-left">
                  <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {stat.number}
                  </p>
                  <p className="text-sm font-medium text-white/70 mt-2">
                    {stat.label}
                  </p>
                  <p className="text-xs text-white/30 mt-1.5 leading-relaxed max-w-[220px] mx-auto md:mx-0">
                    {stat.context}
                  </p>
                  {i < stats.length - 1 && (
                    <div className="md:hidden w-12 h-px bg-white/[0.08] mx-auto mt-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
