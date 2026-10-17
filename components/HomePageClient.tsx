'use client';

import { ChannelSync } from '@/components/ChannelSync';
import { EngineStatement } from '@/components/EngineStatement';
import { ExperienceShowcase } from '@/components/ExperienceShowcase';
import { FAQ } from '@/components/FAQ';
import { FinaleCTA } from '@/components/FinaleCTA';
import { Footer } from '@/components/Footer';
import { HeroCinema } from '@/components/HeroCinema';
import { LineFlow } from '@/components/LineFlow';
import { Navigation } from '@/components/Navigation';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { copy } from '@/lib/copy';
import { faqItems } from '@/lib/faq-data';

export default function HomePageClient() {
  const { engine, faq, cta } = copy.home;

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA]">
      <Navigation />

      <header className="relative">
        <HeroCinema copy={copy.home.hero} />
      </header>

      <ChannelSync copy={copy.home.brands} />
      <LineFlow copy={copy.home.line} />
      <ExperienceShowcase copy={copy.home.experience} />

      {/* AI 引擎：首頁只留一句，完整的說明與飛輪在 /about */}
      <EngineStatement copy={engine} />

      {/* 常見問題 */}
      <Section id="faq" className="bg-[#FAFAFA] py-24 md:py-36">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeader title={faq.title} lede={faq.lede} />
          <ScrollReveal delay={0.15}>
            <FAQ items={faqItems} />
          </ScrollReveal>
        </div>
      </Section>

      {/* 結尾 CTA：首屏的絲綢再出現一次 */}
      <FinaleCTA copy={cta} />

      <Footer />
    </div>
  );
}
