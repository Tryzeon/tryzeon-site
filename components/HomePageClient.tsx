'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ChannelSync } from '@/components/ChannelSync';
import { EngineSphere } from '@/components/EngineSphere';
import { ExperienceShowcase } from '@/components/ExperienceShowcase';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { HeroCinema } from '@/components/HeroCinema';
import { LineFlow } from '@/components/LineFlow';
import { Magnetic } from '@/components/Magnetic';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { SilkField } from '@/components/SilkField';
import { trackCTA } from '@/lib/analytics';
import { copy } from '@/lib/copy';
import { faqItems } from '@/lib/faq-data';

export default function HomePageClient() {
  const { engine, faq, cta } = copy.home;

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] relative">
      <Navigation />

      <header className="relative">
        <HeroCinema copy={copy.home.hero} />
      </header>

      <ChannelSync copy={copy.home.brands} />
      <LineFlow copy={copy.home.line} />
      <ExperienceShowcase copy={copy.home.experience} />

      {/* AI 引擎：首頁只留一句，完整的說明與飛輪在 /about。
          句子下面是一顆數據球：散開的點隨捲動收斂，每一筆試穿化成一道光飛進球面 */}
      <Section id="engine" className="py-20 md:py-28 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <SectionHeader title={engine.title} spacing="mb-0" />
          <EngineSphere className="mx-auto h-[340px] w-full max-w-2xl md:h-[480px]" />
          <ScrollReveal delay={0.1}>
            <MoreLink href="/about#engine">{engine.link}</MoreLink>
          </ScrollReveal>
        </div>
      </Section>

      {/* 常見問題 */}
      <Section id="faq" className="py-24 md:py-36 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader title={faq.title} lede={faq.lede} />
          <ScrollReveal delay={0.2}>
            <div className="glass-card rounded-3xl p-6 md:p-12">
              <FAQ items={faqItems} />
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* 結尾 CTA — 首頁第二個、也是最後一個 atmosphere 出現點：游標劃過會起漣漪的藍青緞面 */}
      <Section id="contact" className="py-32 md:py-48 bg-[#FAFAFA] overflow-hidden">
        <SilkField />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <SectionHeader title={cta.title} />
          <ScrollReveal delay={0.1}>
            <div className="flex justify-center">
              <Magnetic className="w-full md:w-auto">
                <Link
                  href="/business"
                  onClick={() => trackCTA('cta_business')}
                  className="btn-primary group w-full md:w-auto text-base"
                >
                  {cta.primary}
                  <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </Magnetic>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
