import { ScrollReveal } from '@/components/marketing/ScrollReveal';

export function SocialProof() {
  return (
    <section className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <ScrollReveal>
          <p className="text-sm text-muted-foreground text-center">
            Used by 50+ freelancers and creators in beta.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
