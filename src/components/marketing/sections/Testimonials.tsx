'use client'

import { ScrollReveal } from '@/components/marketing/ScrollReveal'

const testimonials = [
  {
    quote: "Pulse replaced three different tools I was using. Everything I need for client work is in one place.",
    name: "Sarah Kim",
    role: "Freelance Designer",
    initials: "SK",
  },
  {
    quote: "The task management is exactly what I needed. Simple, fast, and doesn't get in the way of actual work.",
    name: "Marcus Chen",
    role: "Web Developer",
    initials: "MC",
  },
  {
    quote: "I finally have a clear picture of all my projects and deadlines. Game changer for staying organized.",
    name: "Ava Rodriguez",
    role: "Content Creator",
    initials: "AR",
  }
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-semibold text-foreground tracking-tight text-center">
          Trusted by freelancers who ship.
        </h2>

        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="border border-border rounded-lg p-6">
                <p className="text-foreground leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
