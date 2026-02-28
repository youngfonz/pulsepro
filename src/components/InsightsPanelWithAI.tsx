'use client'

import { useState, useTransition } from 'react'
import { InsightsPanel } from './InsightsPanel'
import type { Insight } from '@/actions/dashboard'

export function InsightsPanelWithAI({
  initialInsights,
  needsRefresh,
}: {
  initialInsights: Insight[]
  needsRefresh: boolean
}) {
  const [insights, setInsights] = useState(initialInsights)
  const [isPending, startTransition] = useTransition()
  const [refreshed, setRefreshed] = useState(false)

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/insights/generate', { method: 'POST' })
        if (!res.ok) {
          console.error('[AI Insights] API returned', res.status)
          return
        }
        const data = await res.json()
        if (data?.insights) {
          setInsights(data.insights)
          setRefreshed(true)
        }
      } catch (err) {
        console.error('[AI Insights] Fetch failed:', err)
      }
    })
  }

  return (
    <div>
      <InsightsPanel insights={insights} />
      {needsRefresh && !refreshed && (
        <div className="px-5 py-3 border-t border-border">
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Refreshing insights...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh AI insights
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
