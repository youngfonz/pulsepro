'use client'

import { useState, useEffect } from 'react'
import { ScrollReveal } from '@/components/marketing/ScrollReveal'

const audiences = ['freelancers', 'designers', 'creatives', 'entrepreneurs', 'small teams']

const testimonials = [
  {
    quote: "I manage 6 clients at once. Before Pulse Pro, I was tracking everything in sticky notes and spreadsheets. Now I actually feel in control.",
    name: "Sarah Kim",
    role: "Freelance Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "I tried Trello, Asana, Notion — they all felt like overkill for a solo consultant. Pulse Pro was set up in 5 minutes. That's it. Done.",
    name: "Marcus Chen",
    role: "IT Consultant",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "The daily email telling me what's due today? Game changer. I used to wake up anxious about what I was forgetting. Not anymore.",
    name: "Ava Rodriguez",
    role: "Marketing Strategist",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  }
]

function RotatingText() {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % audiences.length)
        setIsVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`inline-block text-blue-500 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
      }`}
    >
      {audiences[index]}
    </span>
  )
}

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-semibold text-foreground tracking-tight text-center">
          Trusted by <RotatingText /> who ship.
        </h2>

        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <p className="text-foreground leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                    loading="lazy"
                  />
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
