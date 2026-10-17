'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ChannelSync } from '@/components/ChannelSync';
import { EngineStatement } from '@/components/EngineStatement';
import { ExperienceShowcase } from '@/components/ExperienceShowcase';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { HeroCinema } from '@/components/HeroCinema';
import { LineFlow } from '@/components/LineFlow';
import { Magnetic } from '@/components/Magnetic';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { trackCTA } from '@/lib/analytics';
import { copy } from '@/lib/copy';
import { faqItems } from '@/lib/faq-data';
import { EASE } from '@/lib/motion';

const SilkCanvas = dynamic(() => import('@/components/three/SilkCanvas').then((m) => m.SilkCanvas), { ssr: false });

export default function HomePageClient() {
  const { faq, cta } = copy.home;
  const ctaClauses = cta.title.split(/(?<=[，；：。])/).filter(Boolean);

  return (
    <div className="relative min-h-screen w-full bg-night">
      <Navigation />

      <header className="relative">
        <HeroCinema copy={copy.home.hero} />
      </header>

      <ChannelSync copy={copy.home.brands} />
      <LineFlow copy={copy.home.line} />
      <ExperienceShowcase copy={copy.home.experience} />

      {/* AI 引擎：首頁只留一句，完整的說明與飛輪在 /about */}
      <EngineStatement copy={copy.home.engine} />

      {/* 常見問題：桌機左欄標題黏住、右欄問答 */}
      <section id="faq" className="relative bg-night py-28 md:py-40">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader align="left" title={faq.title} lede={faq.lede} spacing="mb-0" />
          </div>
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* 結尾 CTA：第二塊絲綢，和首屏前後呼應 */}
      <section id="contact" className="relative overflow-hidden bg-night py-40 md:py-56">
        <SilkCanvas variant="soft" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-night to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_50%,rgba(8,9,15,0.75),transparent)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05060A] to-transparent" aria-hidden />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {/* 觸發掛在 h2：子句本身被遮罩裁掉，IntersectionObserver 看它永遠是 0% 可見 */}
          <motion.h2
            className="cjk-punct mx-auto mb-12 font-serif font-black leading-[1.1] tracking-[-0.015em] text-pearl md:mb-14"
            style={{ fontSize: 'clamp(2.6rem, 1.2rem + 5vw, 6rem)' }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {ctaClauses.map((clause) => (
              <span key={clause} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{ hidden: { y: '105%' }, show: { y: 0, transition: { duration: 1.1, ease: EASE } } }}
                >
                  {clause}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          <div className="flex justify-center">
            <Magnetic className="w-full md:w-auto">
              <Link
                href="/business"
                onClick={() => trackCTA('cta_business')}
                className="btn-primary group w-full px-11 py-5 text-lg md:w-auto"
              >
                {cta.primary}
                <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
