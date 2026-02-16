'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  getTelegramSettings,
  generateTelegramLink,
  unlinkTelegram,
  toggleTelegramReminders,
} from '@/actions/telegram'

type TelegramState = Awaited<ReturnType<typeof getTelegramSettings>>

export function TelegramCard() {
  const [state, setState] = useState<TelegramState | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [linkUrl, setLinkUrl] = useState<string | null>(null)

  useEffect(() => {
    getTelegramSettings()
      .then(setState)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TelegramIcon />
            Telegram Bot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!state || state.plan !== 'pro') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TelegramIcon />
            Telegram Bot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Manage tasks from Telegram — check your task list, mark things done, and get daily reminders.
          </p>
          <a
            href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID || ''}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Upgrade to Pro
          </a>
        </CardContent>
      </Card>
    )
  }

  async function handleGenerateLink() {
    setActionLoading(true)
    const result = await generateTelegramLink()
    if ('link' in result && result.link) {
      setLinkUrl(result.link)
    }
    setActionLoading(false)
  }

  async function handleUnlink() {
    setActionLoading(true)
    await unlinkTelegram()
    setState((s) => (s ? { ...s, linked: false, remindersEnabled: false } : s))
    setLinkUrl(null)
    setActionLoading(false)
  }

  async function handleToggleReminders() {
    if (!state) return
    const newVal = !state.remindersEnabled
    setActionLoading(true)
    await toggleTelegramReminders(newVal)
    setState((s) => (s ? { ...s, remindersEnabled: newVal } : s))
    setActionLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TelegramIcon />
          Telegram Bot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.linked ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-foreground">Telegram linked</span>
            </div>

            {/* Reminders toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Daily reminders</p>
                <p className="text-xs text-muted-foreground">
                  Get a morning summary of overdue and due-today tasks
                </p>
              </div>
              <button
                onClick={handleToggleReminders}
                disabled={actionLoading}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  state.remindersEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
                    state.remindersEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleUnlink}
              disabled={actionLoading}
              className="text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              Unlink Telegram
            </button>
          </>
        ) : linkUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Click the link below to open Telegram and link your account. The link expires in 10 minutes.
            </p>
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[#2AABEE] text-white px-4 py-2 text-sm font-medium hover:bg-[#2AABEE]/90 transition-colors"
            >
              Open in Telegram
            </a>
            <button
              onClick={() => setLinkUrl(null)}
              className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Manage tasks from Telegram — check your task list, mark things done, and get daily reminders.
            </p>
            <button
              onClick={handleGenerateLink}
              disabled={actionLoading}
              className="inline-flex items-center justify-center rounded-lg bg-[#2AABEE] text-white px-4 py-2 text-sm font-medium hover:bg-[#2AABEE]/90 transition-colors"
            >
              {actionLoading ? 'Generating...' : 'Link Telegram'}
            </button>
          </div>
        )}

        {/* Command reference */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Commands
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div><code className="text-foreground">tasks</code> — List pending tasks</div>
            <div><code className="text-foreground">today</code> — Tasks due today</div>
            <div><code className="text-foreground">overdue</code> — Overdue tasks</div>
            <div><code className="text-foreground">done N</code> — Mark task #N complete</div>
            <div><code className="text-foreground">add Project: Title</code> — Create a task</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TelegramIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#2AABEE]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}
