'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { getSubscriptionStatus, getUsageLimits } from '@/actions/subscription'

type SubscriptionData = Awaited<ReturnType<typeof getSubscriptionStatus>>
type UsageData = Awaited<ReturnType<typeof getUsageLimits>>

const PLAN_DISPLAY = {
  free: { label: 'Free', price: null, badge: 'bg-muted text-muted-foreground' },
  pro: { label: 'Pro', price: '$12/month', badge: 'bg-emerald-500/10 text-emerald-500' },
  team: { label: 'Team', price: '$29/month', badge: 'bg-blue-500/10 text-blue-500' },
} as const

export function BillingCard() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSubscriptionStatus(), getUsageLimits()])
      .then(([sub, usg]) => {
        setSubscription(sub)
        setUsage(usg)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const plan = (subscription?.plan ?? 'free') as keyof typeof PLAN_DISPLAY
  const display = PLAN_DISPLAY[plan]
  const isPaid = plan === 'pro' || plan === 'team'
  const isCanceling = subscription?.cancelAtPeriodEnd

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Current Plan</p>
            <p className="text-xs text-muted-foreground">
              {isPaid
                ? isCanceling
                  ? `${display.label} — cancels at period end`
                  : `${display.label} — ${display.price}`
                : 'Free'}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${display.badge}`}>
            {display.label}
          </span>
        </div>

        {/* Usage — show for free users */}
        {usage && !isPaid && (
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Usage</p>
            <UsageRow label="Clients" current={usage.clients.current} limit={usage.clients.limit} />
            <UsageRow label="Projects" current={usage.projects.current} limit={usage.projects.limit} />
            <UsageRow label="Tasks" current={usage.tasks.current} limit={usage.tasks.limit} />
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-border space-y-2">
          {isPaid ? (
            <a
              href="/api/portal"
              className="text-sm text-primary hover:underline"
            >
              Manage subscription
            </a>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID || ''}`}
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro — $12/mo
              </a>
              <a
                href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_TEAM_PRODUCT_ID || ''}`}
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Upgrade to Team — $29/mo
              </a>
            </div>
          )}
          {plan === 'pro' && (
            <p className="text-xs text-muted-foreground">
              Need more team members?{' '}
              <a
                href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_TEAM_PRODUCT_ID || ''}`}
                className="text-primary hover:underline"
              >
                Upgrade to Team ($29/mo)
              </a>
              {' '}for up to 10 members.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function UsageRow({ label, current, limit }: { label: string; current: number; limit: number }) {
  const percentage = limit === Infinity ? 0 : Math.min((current / limit) * 100, 100)
  const isNearLimit = percentage >= 80

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={isNearLimit ? 'text-amber-500 font-medium' : 'text-foreground'}>
          {current} / {limit === Infinity ? 'Unlimited' : limit}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isNearLimit ? 'bg-amber-500' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
