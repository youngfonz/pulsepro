'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For getting started.',
    features: [
      '3 projects',
      '50 tasks',
      '1 client',
      'Basic calendar'
    ],
    highlighted: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$9',
    description: 'For serious freelancers.',
    features: [
      'Unlimited projects',
      'Unlimited tasks',
      'Unlimited clients',
      'File attachments',
      'Priority support'
    ],
    highlighted: true,
    cta: 'Start Free Trial',
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-muted py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <span className="block text-sm font-semibold tracking-widest uppercase text-primary text-center">
          Pricing
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-3">
          Simple pricing for focused work.
        </h2>
        <p className="text-lg text-muted-foreground mt-4 text-center">
          Start free, upgrade when you&apos;re ready.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12">
          {plans.map((plan, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div className={`relative rounded-xl overflow-hidden ${
                plan.highlighted
                  ? 'shadow-xl shadow-primary/10'
                  : ''
              }`}>
                {/* Solid header for Pro */}
                {plan.highlighted && (
                  <div className="bg-primary px-8 py-3 text-center">
                    <span className="text-sm font-semibold text-primary-foreground">Most Popular</span>
                  </div>
                )}

                <div className={`${
                  plan.highlighted
                    ? 'bg-card border-2 border-primary/30 border-t-0 rounded-b-xl p-8'
                    : 'bg-card border border-border rounded-xl p-8'
                }`}>
                  <div className="text-xl font-semibold">{plan.name}</div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-foreground tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground text-base">/month</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/sign-up"
                    className={`mt-8 block rounded-lg px-6 py-3.5 w-full text-center font-medium transition-all duration-200 ${
                      plan.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20'
                        : 'border border-border hover:bg-muted hover:border-primary/30'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  )
}
