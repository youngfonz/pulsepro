'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying it out.',
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
    description: 'Never miss a deadline again.',
    features: [
      'Unlimited projects',
      'Unlimited tasks',
      'Unlimited clients',
      'Quick Search (\u2318K)',
      'File attachments',
      'Daily email reminders',
      'Priority support'
    ],
    highlighted: true,
    cta: 'Get Started',
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-semibold text-foreground text-center tracking-tight">
          Simple pricing
        </h2>
        <p className="text-base text-muted-foreground mt-3 text-center">
          No per-seat fees. No annual contracts. Start free, upgrade when you&apos;re ready.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${
                plan.highlighted
                  ? 'border-2 border-foreground shadow-lg'
                  : 'border border-border'
              } rounded-xl p-8`}
            >
              <div className="text-sm font-medium text-muted-foreground">
                {plan.name}
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-foreground tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-muted-foreground flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`mt-6 block rounded-full px-5 py-2.5 w-full text-center text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border hover:bg-muted'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Free plan included. No credit card required.
        </p>
      </div>
    </section>
  )
}
