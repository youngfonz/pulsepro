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
      .then(res => {
        if (!res.ok) {
          console.error('[AI Insights] API returned', res.status)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data?.insights) setInsights(data.insights)
      })
      .catch(err => {
        console.error('[AI Insights] Fetch failed:', err)
      })
  }, [needsRefresh])

  return <InsightsPanel insights={insights} />
}
