import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Pulse Pro',
  description: 'Pulse Pro was built by an entrepreneur, for entrepreneurs. A simple project management tool for freelancers and small teams.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-8">About Pulse Pro</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg text-foreground font-medium">
            Built by an entrepreneur, for entrepreneurs.
          </p>

          <p>
            Pulse Pro started from a real problem. Juggling multiple clients, deadlines slipping through the cracks, and project management tools that felt like they were built for 500-person companies — not solo operators.
          </p>

          <p>
            So we built something different. A tool that&apos;s fast to set up, simple to use, and designed for the way freelancers and small teams actually work. No enterprise bloat. No 30-minute onboarding. Just the features you need to stay on top of your work.
          </p>

          <p>
            Projects. Tasks. Clients. Deadlines. All in one place, visible at a glance.
          </p>

          <p>
            We&apos;re a small, independent team and we plan to keep it that way. Every feature we ship is something we&apos;d use ourselves.
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
