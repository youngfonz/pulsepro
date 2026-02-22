'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  getIntegrationSettings,
  generateApiToken,
  revokeApiToken,
  regenerateApiToken,
} from '@/actions/integrations'

export function ApiAccessCard() {
  const [plan, setPlan] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showToken, setShowToken] = useState(false)

  useEffect(() => {
    getIntegrationSettings()
      .then((s) => {
        setPlan(s.plan)
        setToken(s.apiToken)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApiIcon />
            Siri &amp; Shortcuts
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

  if (plan !== 'pro') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApiIcon />
            Siri &amp; Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Create tasks from Siri, Apple Shortcuts, or any tool that can make HTTP requests.
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

  async function handleGenerate() {
    setActionLoading(true)
    const result = await generateApiToken()
    if ('token' in result && result.token) {
      setToken(result.token)
      setShowToken(true)
    }
    setActionLoading(false)
  }

  async function handleRevoke() {
    if (!confirm('Revoking will immediately disable API access. Continue?')) return
    setActionLoading(true)
    await revokeApiToken()
    setToken(null)
    setShowToken(false)
    setActionLoading(false)
  }

  async function handleRegenerate() {
    if (!confirm('Regenerating will invalidate your current token. Continue?')) return
    setActionLoading(true)
    const result = await regenerateApiToken()
    if ('token' in result && result.token) {
      setToken(result.token)
      setShowToken(true)
    }
    setActionLoading(false)
  }

  function handleCopy() {
    if (!token) return
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskedToken = token ? `${token.slice(0, 6)}${'*'.repeat(20)}` : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApiIcon />
          Siri &amp; Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {token ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-foreground">API access enabled</span>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Your API token</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono text-foreground truncate">
                  {showToken ? token : maskedToken}
                </code>
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy token"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Siri Shortcut setup */}
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Apple Shortcuts Setup
              </p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div>1. Open the <b>Shortcuts</b> app on iPhone, iPad, or Mac</div>
                <div>2. Create a new shortcut with <b>Ask for Input</b> (task title)</div>
                <div>3. Add <b>Get Contents of URL</b> action:</div>
                <div className="pl-4 space-y-0.5">
                  <div>URL: <code className="text-foreground">https://pulsepro.work/api/v1/tasks</code></div>
                  <div>Method: <code className="text-foreground">POST</code></div>
                  <div>Header: <code className="text-foreground">Authorization: Bearer YOUR_TOKEN</code></div>
                  <div>Body (JSON): <code className="text-foreground">{'{"title": "Provided Input"}'}</code></div>
                </div>
                <div>4. Add to Siri: &quot;Hey Siri, add a Pulse task&quot;</div>
              </div>
            </div>

            {/* curl example */}
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                API Example
              </p>
              <code className="block px-3 py-2 bg-muted rounded-lg text-[11px] font-mono text-muted-foreground whitespace-pre-wrap break-all">
{`curl -X POST https://pulsepro.work/api/v1/tasks \\
  -H "Authorization: Bearer ${showToken ? token : 'YOUR_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Buy groceries", "priority": "high"}'`}
              </code>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={handleRegenerate}
                disabled={actionLoading}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Regenerate token
              </button>
              <button
                onClick={handleRevoke}
                disabled={actionLoading}
                className="text-sm text-red-500 hover:text-red-400 transition-colors"
              >
                Revoke access
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Generate an API token to create tasks from Siri, Apple Shortcuts, Zapier, or any HTTP client. Works on iPhone, iPad, Mac, and Apple Watch.
            </p>
            <button
              onClick={handleGenerate}
              disabled={actionLoading}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {actionLoading ? 'Generating...' : 'Generate API Token'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ApiIcon() {
  return (
    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
}
