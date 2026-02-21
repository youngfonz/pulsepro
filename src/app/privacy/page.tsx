import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground font-medium">Last updated: February 17, 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you create an account, we collect your name and email address through our authentication provider (Clerk). When you use Pulse Pro, we store the projects, tasks, clients, and bookmarks you create.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information solely to provide the Pulse Pro service — managing your projects, tasks, and clients. We do not sell your data to third parties. We may send you transactional emails (e.g., daily task reminders) if you opt in.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage</h2>
            <p>Your data is stored securely on servers provided by Vercel and Neon (PostgreSQL). File uploads are stored via Vercel Blob. All data is encrypted in transit using TLS.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Clerk — authentication</li>
              <li>Vercel — hosting and file storage</li>
              <li>Neon — database</li>
              <li>Polar — payment processing</li>
              <li>Telegram — optional bot integration (Pro plan)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>You can export or delete your data at any time by contacting us. You can delete your account through your account settings, which will remove all associated data.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
            <p>For privacy-related questions, contact us at privacy@pulsepro.app.</p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
