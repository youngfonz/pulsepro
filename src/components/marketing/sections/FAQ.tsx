'use client'

import { useState } from 'react'

const faqs = [
  {
    question: "Who is Pulse Pro for?",
    answer: "Pulse Pro is built for freelancers, consultants, and small teams who manage multiple clients and projects. If you've tried Asana, Trello, or Notion and found them too complex for your workflow, Pulse Pro is for you."
  },
  {
    question: "How is this different from Trello or Asana?",
    answer: "Those tools are built for 50-person teams with sprints, boards, and complex workflows. Pulse Pro is built for people who just need to track clients, projects, and deadlines — without the overhead. You'll be up and running in under 5 minutes."
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. The free plan includes 3 projects, 50 tasks, and 1 client — enough to see if Pulse Pro fits your workflow before upgrading."
  },
  {
    question: "What do I get with the Pro plan?",
    answer: "Unlimited projects, tasks, and clients. Plus file attachments, daily email reminders so you never miss a deadline, and priority support. Everything you need to manage a full client roster."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Pulse Pro runs on Vercel with encrypted connections. Your data is never shared with third parties."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes — 30-day money-back guarantee on all paid plans. No questions asked."
  },
  {
    question: "Can my team use Pulse Pro?",
    answer: "Team workspaces with shared projects, task assignment, and manager dashboards are on our roadmap. Right now Pulse Pro is optimized for individuals and solo professionals — but team features are coming."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-semibold text-foreground text-center tracking-tight">
          Questions? Answers.
        </h2>

        <div className="mt-10 divide-y divide-border border-t border-b border-border max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-4 text-muted-foreground text-sm">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
