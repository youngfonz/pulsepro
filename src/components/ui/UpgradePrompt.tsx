'use client'

export function UpgradePrompt({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const productId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID || ''
  const checkoutUrl = `/api/checkout?products=${productId}`

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      <p className="text-sm text-foreground font-medium">{message}</p>
      <div className="flex items-center gap-3">
        <a
          href={checkoutUrl}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Upgrade to Pro
        </a>
        <button
          onClick={onDismiss}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

export function isLimitError(error: unknown): string | null {
  if (error instanceof Error && error.message.startsWith('Free plan limit:')) {
    return error.message
  }
  return null
}
