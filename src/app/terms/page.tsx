import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground font-medium">Last updated: February 17, 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using Pulse Pro, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>Pulse Pro is a project and task management tool for freelancers, consultants, and small teams. We offer a free tier with limited usage and a paid Pro tier with unlimited access.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the security of your account credentials. You must provide accurate information when creating an account. You may not use the service for any illegal purpose.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Payment Terms</h2>
            <p>Pro subscriptions are billed monthly at $9/month. You can cancel at any time — your access continues until the end of the billing period. Refunds are handled on a case-by-case basis.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Data Ownership</h2>
            <p>You retain full ownership of all content you create in Pulse Pro. We do not claim any rights to your projects, tasks, or files. You can export or delete your data at any time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Service Availability</h2>
            <p>We strive for high availability but do not guarantee uninterrupted service. We may perform maintenance that temporarily affects access. We will notify users of planned downtime when possible.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
            <p>Pulse Pro is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from use of the service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Changes to Terms</h2>
            <p>We may update these terms from time to time. We will notify registered users of material changes via email. Continued use after changes constitutes acceptance.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
            <p>For questions about these terms, contact us at support@pulsepro.work.</p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
