import { generateObject } from 'ai'
import { z } from 'zod'
import { createHash } from 'crypto'
import { insightModel } from '@/lib/ai'
import type { Insight } from '@/actions/dashboard'

const InsightSchema = z.object({
  insights: z.array(z.object({
    color: z.enum(['red', 'amber', 'blue', 'green']),
    message: z.string(),
    href: z.string(),
  })),
})

export interface InsightContext {
  stats: {
    totalProjects: number
    activeProjects: number
    totalTasks: number
    pendingTasks: number
  }
  projectHealth: Array<{
    projectName: string
    clientName: string
    label: string
    score: number
    overdueTasks: number
    totalTasks: number
    completedTasks: number
    href: string
  }>
  overdueTasks: Array<{
    title: string
    projectName: string
    dueDate: string
    priority: string
  }>
  tasksDueToday: Array<{
    title: string
    projectName: string
    priority: string
  }>
  tasksDueThisWeek: number
}

function buildPrompt(ctx: InsightContext): string {
  return `You are an AI assistant for a freelancer's project management tool. Analyze their workspace data and generate 1–3 actionable insights.

Rules:
- Each insight is a single sentence, max 120 characters
- Each insight must include an href linking to a relevant page: /tasks, /projects, or /projects/{projectId}
- Color mapping: red = critical/overdue, amber = warning/at-risk, blue = informational tip, green = positive progress
- Be specific: reference project names and real numbers
- Focus on patterns: pace problems, workload imbalance, deadlines clustering, completion momentum
- If everything looks healthy, return one green insight acknowledging progress
- Return at most 3 insights, prioritized by urgency
- Do NOT return generic advice — every insight must reference the user's actual data

Workspace data:
${JSON.stringify(ctx)}`
}

export async function generateAIInsights(ctx: InsightContext): Promise<Insight[] | null> {
  try {
    const result = await generateObject({
      model: insightModel,
      schema: InsightSchema,
      prompt: buildPrompt(ctx),
      maxOutputTokens: 300,
    })

    return result.object.insights.slice(0, 3).map((insight, i) => ({
      ...insight,
      id: `ai-insight-${i}`,
    }))
  } catch (error) {
    console.error('AI insight generation failed:', error)
    return null
  }
}

export function hashInsightContext(ctx: InsightContext): string {
  const key = JSON.stringify({
    overdue: ctx.overdueTasks.length,
    critical: ctx.projectHealth.filter(p => p.label === 'critical').length,
    atRisk: ctx.projectHealth.filter(p => p.label === 'at_risk').length,
    pending: ctx.stats.pendingTasks,
    dueToday: ctx.tasksDueToday.length,
    dueThisWeek: ctx.tasksDueThisWeek,
  })
  return createHash('md5').update(key).digest('hex').slice(0, 12)
}
