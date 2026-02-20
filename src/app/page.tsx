import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { Hero } from '@/components/marketing/sections/Hero'
import { SocialProof } from '@/components/marketing/sections/SocialProof'
import { Features } from '@/components/marketing/sections/Features'
import { AppShowcase } from '@/components/marketing/sections/AppShowcase'
import { Testimonials } from '@/components/marketing/sections/Testimonials'
import { Pricing } from '@/components/marketing/sections/Pricing'
import { FAQ } from '@/components/marketing/sections/FAQ'
import { TelegramFeature } from '@/components/marketing/sections/TelegramFeature'
import { WhySwitch } from '@/components/marketing/sections/WhySwitch'
import { FinalCTA } from '@/components/marketing/sections/FinalCTA'

export default async function MarketingPage() {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (clerkEnabled) {
    const { userId } = await auth()
    if (userId) {
      redirect('/dashboard')
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <AppShowcase />
        <TelegramFeature />
        <Testimonials />
        <WhySwitch />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <MarketingFooter />
    </div>
  )
}
