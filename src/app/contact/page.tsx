import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Pulse Pro',
  description: 'Get in touch with the Pulse Pro team. We\'d love to hear from you.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-8">Contact Us</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Have a question, feature request, or just want to say hi? We&apos;d love to hear from you.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">General Inquiries</h2>
            <p>
              For general questions or feedback, reach us at{' '}
              <a href="mailto:hello@pulsepro.work" className="text-primary hover:underline">
                hello@pulsepro.work
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Support</h2>
            <p>
              Need help with your account or have a technical issue? Email us at{' '}
              <a href="mailto:support@pulsepro.work" className="text-primary hover:underline">
                support@pulsepro.work
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Privacy</h2>
            <p>
              For privacy-related questions, contact{' '}
              <a href="mailto:privacy@pulsepro.work" className="text-primary hover:underline">
                privacy@pulsepro.work
              </a>
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
