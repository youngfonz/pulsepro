'use client'

import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'pulse-onboarding-complete'

const steps = [
  {
    title: 'Add your first client',
    description: 'Start by adding the clients you work with. Every project is tied to a client, so this is step one.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Create a project',
    description: 'Projects hold your tasks, deadlines, and notes. Assign them to a client and set a due date to stay on track.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Add tasks and go',
    description: 'Break work into tasks with priorities and due dates. You\'ll get daily email reminders so nothing slips through.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function OnboardingOverlay() {
  const [currentStep, setCurrentStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(ONBOARDING_KEY)) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const isLastStep = currentStep === steps.length - 1
  const step = steps[currentStep]

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem(ONBOARDING_KEY, 'true')
      setVisible(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Step indicator */}
        <div className="flex gap-1.5 px-6 pt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            {step.icon}
          </div>
          <h2 className="text-xl font-semibold text-foreground mt-6">
            {step.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-sm mx-auto">
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {isLastStep ? "Let's go" : 'Next'}
            {!isLastStep && (
              <svg className="ml-1.5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
