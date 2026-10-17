import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BlurReveal } from '@/components/BlurReveal';
import { EngineFlywheel } from '@/components/EngineFlywheel';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { HeroTitleLines, SubpageBackdrop } from '@/components/SubpageHero';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { copy } from '@/lib/copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/about',
  title: '關於我們 — 創然科技 Tryzeon',
  absoluteTitle: true,
  description:
    'Tryzeon（創然科技有限公司）是專注時尚產業的 AI 新創，打造連結消費者與時尚品牌的時尚 AI 生態系。',
  shareTitle: '關於 Tryzeon',
  shareDescription: '為時尚產業而生的 AI——連結消費者與時尚品牌。',
});

export const revalidate = 3600;

export default function AboutPage() {
  const { about } = copy;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <section className="relative overflow-hidden pt-36 md:pt-44 pb-24 md:pb-36 text-center">
        <SubpageBackdrop />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1
            className="max-w-3xl mx-auto cjk-punct text-balance font-serif font-black tracking-[-0.02em] leading-[1.1] text-[#101828] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 1.6rem + 4vw, 5rem)' }}
          >
            <HeroTitleLines text={about.hero.title} />
          </h1>
          <p className="hero-enter [animation-delay:0.3s] max-w-3xl mx-auto text-base md:text-xl text-[#475467] font-medium leading-relaxed mb-8 md:mb-10 text-balance">
            {clauseWrap(about.hero.lede)}
          </p>
          <div className="hero-enter [animation-delay:0.45s]">
            <Link
              href="/"
              className="focus-ring rounded-full text-base md:text-lg font-medium text-[#1D4ED8] hover:text-[#2563EB] transition-colors"
            >
              {about.hero.cta}
              <ChevronRight className="ml-1 inline h-5 w-5 align-[-0.2em]" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader align="left" title={about.origin.title} />
          <BlurReveal className="mb-0 text-base md:text-lg leading-[1.9] text-[#475467]" delay={0.15}>
            {keepRanges(about.origin.body)}
          </BlurReveal>
        </div>
      </section>

      {/* AI 引擎：頁尾「共用 AI 引擎」與首頁那一句連到這裡 */}
      <EngineFlywheel copy={about.engine} />

      {/* 願景：頁尾「願景」連到這裡 */}
      <section id="vision" className="bg-[#FAFAFA] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <SectionHeader title={about.vision.title} spacing="mb-8 md:mb-10" />
          {/* font-semibold 明確化：Noto Serif TC 沒有 400 */}
          <BlurReveal
            className="mb-0 mx-auto max-w-3xl text-balance font-serif font-semibold leading-[1.65] text-[#475467] text-[clamp(1.3rem,0.95rem+1.5vw,2rem)]"
            delay={0.2}
          >
            「{about.vision.quote}」
          </BlurReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#FAFAFA] py-24 md:py-36 text-center">
        <SubpageBackdrop glow="center" intensity={0.6} fadeTop />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Link href="/business" className="btn-primary gap-2">
            {about.cta}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
