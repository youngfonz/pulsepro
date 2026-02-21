import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Pulse Pro — Built for Freelancers and Small Teams',
  description: 'A fast, simple project management tool built for freelancers, consultants, and small teams who need to stay organized without enterprise complexity.',
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
            Pulse Pro started from a real problem. Juggling multiple clients, deadlines slipping through the cracks, and project management tools that felt like they were built for 500-person companies — not solo operators. The tools that existed were either too simple to be useful or so complex that setting them up took longer than the actual work.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Why we built Pulse Pro</h2>
            <p>
              We wanted something different. A tool that&apos;s fast to set up, simple to use, and designed for the way freelancers and small teams actually work. No enterprise bloat. No 30-minute onboarding. No features that only make sense if you have a project management office.
            </p>
            <p>
              Projects. Tasks. Clients. Deadlines. All in one place, visible at a glance. That&apos;s the core of Pulse Pro, and it&apos;s where we focus our energy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">What makes us different</h2>
            <p>
              Most project management tools are built to sell to companies with hundreds of employees. They optimize for admin controls, complex permission systems, and features that look good in enterprise sales demos. Pulse Pro optimizes for speed and clarity. You can create a project, add tasks, and assign a deadline in under a minute.
            </p>
            <p>
              We also believe your workflow tools should work the way you do. That&apos;s why we built integrations with Telegram for on-the-go task updates, voice input for capturing ideas quickly, and a calendar view that actually helps you plan your week.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Our team</h2>
            <p>
              We&apos;re a small, independent team and we plan to keep it that way. Every feature we ship is something we&apos;d use ourselves. We listen to feedback from our users and prioritize the changes that make the biggest difference for the people who rely on Pulse Pro every day.
            </p>
            <p>
              No investors dictating our roadmap. No pressure to chase enterprise deals. We stay focused on the people we built this for — independent workers who need a tool that respects their time and works the way they do.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
