import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl font-bold text-muted-foreground/30 mb-4">404</p>
        <h2 className="text-lg font-semibold text-foreground mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
