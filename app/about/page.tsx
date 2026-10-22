import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AmbientGlow } from '@/components/AmbientGlow';
import { EngineFlywheel } from '@/components/EngineFlywheel';
import { Footer } from '@/components/Footer';
import { Magnetic } from '@/components/Magnetic';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { copy } from '@/lib/copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/about',
  absoluteTitle: true,
  ...copy.meta.about,
});

export const revalidate = 3600;

export default function AboutPage() {
  const { about } = copy;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28 text-center">
        <AmbientGlow variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1
            className="max-w-3xl mx-auto cjk-punct text-balance font-serif font-black tracking-[-0.02em] leading-[1.1] text-[#101828] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 1.6rem + 4vw, 5rem)' }}
          >
            {clauseWrap(about.hero.title)}
          </h1>
          <p className="max-w-3xl mx-auto text-base md:text-xl text-[#475467] font-medium leading-relaxed mb-8 md:mb-10 text-balance">
            {clauseWrap(about.hero.lede)}
          </p>
          <Link
            href="/"
            className="focus-ring rounded-full text-base md:text-lg font-medium text-[#1D4ED8] hover:text-[#2563EB] transition-colors"
          >
            {about.hero.cta}
            <ChevronRight className="ml-1 inline h-5 w-5 align-[-0.2em]" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="bg-[#FAFAFA] py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader align="left" title={about.origin.title} />
          <p className="mb-0 text-base md:text-lg leading-[1.9] text-[#475467]">{keepRanges(about.origin.body)}</p>
        </div>
      </section>

      {/* AI 引擎：頁尾「共用 AI 引擎」與首頁那一句連到這裡 */}
      <EngineFlywheel copy={about.engine} />

      {/* 願景：頁尾「願景」連到這裡 */}
      <section id="vision" className="bg-[#FAFAFA] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeader title={about.vision.title} spacing="mb-8 md:mb-10" />
          {/* font-semibold 明確化：Noto Serif TC 沒有 400 */}
          <p
            className="mb-0 mx-auto max-w-3xl text-balance font-serif font-semibold leading-[1.7] text-[#475467]"
            style={{ fontSize: 'clamp(1.125rem, 1.6vw, 1.45rem)' }}
          >
            {about.vision.quote}
          </p>
        </div>
      </section>

      <section className="bg-[#FAFAFA] py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Magnetic className="inline-block">
            <Link href="/business" className="btn-primary gap-2">
              {about.cta}
            </Link>
          </Magnetic>
        </div>
      </section>

      <Footer />
    </div>
  );
}
