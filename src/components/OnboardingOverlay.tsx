'use client'

import { useState, useEffect } from 'react'

const ONBOARDING_KEY_PREFIX = 'pulse-onboarding-complete'

const steps = [
  {
    title: 'Your project command center',
    description:
      'Pulse Pro keeps every client, project, and task organized in one place. No more scattered spreadsheets or forgotten deadlines.',
    visual: 'dashboard',
  },
  {
    title: 'Built to keep you on track',
    description:
      'Set priorities, track deadlines, and get daily email reminders. See project health scores so you always know where things stand.',
    visual: 'tasks',
  },
  {
    title: 'AI-powered insights',
    description:
      'Pulse Pro analyzes your projects and deadlines to surface what needs attention. Color-coded priorities help you focus on what matters most.',
    visual: 'insights',
  },
  {
    title: 'Manage tasks from Telegram',
    description:
      'Check your task list, mark things done, and create new tasks — all from a Telegram bot. Perfect for when you\u2019re on the go.',
    visual: 'telegram',
  },
]

export function OnboardingOverlay({ userId }: { userId: string }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [visible, setVisible] = useState(false)

  const storageKey = `${ONBOARDING_KEY_PREFIX}-${userId}`

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(storageKey)) {
      setVisible(true)
    }
  }, [storageKey])

  if (!visible) return null

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const step = steps[currentStep]

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem(storageKey, 'true')
      setVisible(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    localStorage.setItem(storageKey, 'true')
    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Visual preview area */}
        <div className="relative h-[220px] overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-200/80 via-blue-200/60 to-emerald-200/70" />
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-200/40 via-transparent to-amber-100/50" />

          {/* Visual content */}
          <div className="relative h-full flex items-center justify-center p-6">
            {step.visual === 'dashboard' && <DashboardVisual />}
            {step.visual === 'tasks' && <TasksVisual />}
            {step.visual === 'insights' && <InsightsVisual />}
            {step.visual === 'telegram' && <TelegramVisual />}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-6 pb-2 text-center">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            {step.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Footer: dots + navigation */}
        <div className="px-6 pt-4 pb-5 flex items-center justify-between">
          {/* Back button or spacer */}
          {isFirstStep ? (
            <div className="w-16" />
          ) : (
            <button
              onClick={handleBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Back
            </button>
          )}

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'w-2 bg-primary'
                    : 'w-2 bg-muted-foreground/25'
                }`}
              />
            ))}
          </div>

          {/* Continue/Done button */}
          <button
            onClick={handleNext}
            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {isLastStep ? 'Done' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Visual Components for each step ─── */

function DashboardVisual() {
  return (
    <div className="w-full max-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden border border-black/5">
      {/* Mini nav */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <div className="w-5 h-5 rounded bg-[#171717] flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">P</span>
        </div>
        <span className="text-[10px] font-semibold text-gray-800">Dashboard</span>
        <div className="ml-auto flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-100" />
          <div className="w-4 h-4 rounded bg-gray-100" />
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          { label: 'Active', value: '7', color: 'bg-blue-500' },
          { label: 'Due soon', value: '3', color: 'bg-amber-500' },
          { label: 'Clients', value: '4', color: 'bg-violet-500' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-md p-2">
            <div className="text-[15px] font-bold text-gray-900">{s.value}</div>
            <div className="text-[8px] text-gray-500 mt-0.5">{s.label}</div>
            <div className={`h-0.5 w-6 ${s.color} rounded-full mt-1.5 opacity-60`} />
          </div>
        ))}
      </div>
      {/* Project rows */}
      <div className="px-3 pb-3 space-y-1.5">
        {[
          { name: 'Acme Rebrand', status: 'In progress', dot: 'bg-blue-500' },
          { name: 'SaaS Dashboard', status: '2 tasks due', dot: 'bg-amber-500' },
          { name: 'Morris Design Co', status: 'On track', dot: 'bg-emerald-500' },
        ].map((p) => (
          <div key={p.name} className="flex items-center gap-2 py-1.5 px-2 bg-gray-50/80 rounded">
            <div className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
            <span className="text-[10px] font-medium text-gray-800 flex-1">{p.name}</span>
            <span className="text-[9px] text-gray-400">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TasksVisual() {
  return (
    <div className="w-full max-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden border border-black/5">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100">
        <span className="text-[10px] font-semibold text-gray-800">Tasks</span>
        <span className="text-[9px] text-gray-400 ml-2">Acme Rebrand</span>
      </div>
      {/* Task list */}
      <div className="p-3 space-y-1.5">
        {[
          { title: 'Finalize homepage copy', priority: 'High', done: true, color: 'text-red-500 bg-red-50' },
          { title: 'Send invoice to client', priority: 'Med', done: false, color: 'text-amber-600 bg-amber-50' },
          { title: 'Review wireframes', priority: 'High', done: false, color: 'text-red-500 bg-red-50' },
          { title: 'Set up staging site', priority: 'Low', done: false, color: 'text-gray-500 bg-gray-50' },
        ].map((t) => (
          <div key={t.title} className="flex items-center gap-2 py-1.5 px-2 bg-gray-50/80 rounded">
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
              t.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
            }`}>
              {t.done && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-[10px] flex-1 ${t.done ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
              {t.title}
            </span>
            <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${t.color}`}>
              {t.priority}
            </span>
          </div>
        ))}
      </div>
      {/* Health bar */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[25%] bg-emerald-500 rounded-full" />
          </div>
          <span className="text-[9px] text-gray-400">1/4 done</span>
        </div>
      </div>
    </div>
  )
}

function InsightsVisual() {
  return (
    <div className="w-full max-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden border border-black/5">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <span className="text-[10px] font-semibold text-gray-800">Insights</span>
        <span className="text-[9px] text-gray-400 ml-auto">AI-powered</span>
      </div>
      {/* Insight rows */}
      <div className="p-3 space-y-1.5">
        {[
          { dot: 'bg-rose-500', text: 'Acme Rebrand has 3 overdue tasks' },
          { dot: 'bg-amber-500', text: 'Invoice pending for Morris Design Co' },
          { dot: 'bg-blue-500', text: '2 tasks due tomorrow — start early' },
        ].map((insight) => (
          <div key={insight.text} className="flex items-center gap-2 py-1.5 px-2 bg-gray-50/80 rounded">
            <div className={`w-1.5 h-1.5 rounded-full ${insight.dot} flex-shrink-0`} />
            <span className="text-[10px] text-gray-800 flex-1">{insight.text}</span>
            <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="px-3 pb-3">
        <div className="text-[9px] text-gray-400 text-center">Updated 2 min ago</div>
      </div>
    </div>
  )
}

function TelegramVisual() {
  return (
    <div className="w-full max-w-[280px] bg-white rounded-lg shadow-lg overflow-hidden border border-black/5">
      {/* Chat header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <div className="w-6 h-6 rounded-full bg-[#2AABEE] flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold text-gray-800">Pulse Pro Bot</span>
      </div>
      {/* Messages */}
      <div className="p-3 space-y-2">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-[#2AABEE] text-white text-[10px] px-2.5 py-1.5 rounded-lg rounded-br-sm max-w-[70%]">
            tasks
          </div>
        </div>
        {/* Bot reply */}
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 text-[10px] px-2.5 py-1.5 rounded-lg rounded-bl-sm max-w-[85%] leading-relaxed">
            <span className="font-semibold">Pending Tasks</span><br />
            1. Finalize homepage copy<br />
            <span className="text-gray-400">  Acme Rebrand</span><br />
            2. Send invoice<br />
            <span className="text-gray-400">  Morris Design Co</span>
          </div>
        </div>
        {/* User done */}
        <div className="flex justify-end">
          <div className="bg-[#2AABEE] text-white text-[10px] px-2.5 py-1.5 rounded-lg rounded-br-sm">
            done 1
          </div>
        </div>
        {/* Bot confirm */}
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 text-[10px] px-2.5 py-1.5 rounded-lg rounded-bl-sm">
            Done! &quot;Finalize homepage copy&quot; marked complete.
          </div>
        </div>
      </div>
    </div>
  )
}
