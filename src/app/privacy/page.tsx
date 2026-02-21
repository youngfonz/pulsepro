import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — How Pulse Pro Protects Your Data',
  description: 'Learn how Pulse Pro collects, uses, and protects your data. We store only what we need and never sell your information to third parties.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground font-medium">Last updated: February 17, 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>When an account is created, we collect a name and email address through our authentication provider (Clerk). As the service is used, we store the projects, tasks, clients, and bookmarks that are created. We also collect basic usage analytics to improve the service, such as which features are used most frequently.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use collected information solely to provide the Pulse Pro service — managing projects, tasks, and clients. We do not sell or share personal information with third parties for marketing purposes. We may send transactional emails (e.g., daily task reminders) if opted in through account settings.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage and Security</h2>
            <p>All information is stored securely on servers provided by Vercel and Neon (PostgreSQL). File uploads are stored via Vercel Blob. Communication between the browser and our servers is encrypted in transit using TLS. We implement industry-standard security measures to protect against unauthorized access, alteration, or destruction of personal information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We use the following third-party services to operate Pulse Pro:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Clerk — authentication and account management</li>
              <li>Vercel — application hosting and file storage</li>
              <li>Neon — PostgreSQL database hosting</li>
              <li>Polar — subscription and payment processing</li>
              <li>Telegram — optional bot integration for task reminders (Pro plan)</li>
            </ul>
            <p>Each of these services has their own privacy policy governing how they handle the information they process on our behalf.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Cookies and Tracking</h2>
            <p>Pulse Pro uses essential cookies required for authentication and session management. We use Vercel Analytics to collect anonymous, aggregated usage statistics. We do not use advertising trackers, and we do not build user profiles for targeting purposes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
            <p>Users have the right to access, correct, or delete personal information we hold. Project and task data can be exported at any time. Accounts can be deleted through account settings, which permanently removes all associated content and personal information from our systems.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify registered users of material changes via email. Your continued use of Pulse Pro after any changes constitutes acceptance of the updated policy.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
            <p>For privacy-related questions or to exercise any of the rights described above, contact us at privacy@pulsepro.work.</p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
