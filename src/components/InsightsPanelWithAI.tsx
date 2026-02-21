'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (!needsRefresh) return

    fetch('/api/insights/generate', { method: 'POST' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.insights) setInsights(data.insights)
      })
      .catch(() => {
        // Keep rule-based insights on failure
      })
  }, [needsRefresh])

  return <InsightsPanel insights={insights} />
}
