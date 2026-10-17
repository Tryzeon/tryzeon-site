import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { EngineFlywheel } from '@/components/EngineFlywheel';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { ScrubText } from '@/components/ScrubText';
import { SectionHeader } from '@/components/SectionHeader';
import { SilkBackdrop } from '@/components/SilkBackdrop';
import { clauseWrap } from '@/components/clauseWrap';
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
  const heroLines = about.hero.title.split(/(?<=[，；：。])/).filter(Boolean);

  return (
    <div className="min-h-screen bg-night">
      <Navigation />

      <section className="relative overflow-hidden">
        <SilkBackdrop />
        <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-5xl flex-col items-center justify-center px-6 pb-24 pt-36 text-center">
          <h1
            className="cjk-punct mb-8 font-serif font-black leading-[1.08] tracking-[-0.02em] text-pearl"
            style={{ fontSize: 'clamp(2.75rem, 1.3rem + 5.4vw, 6.4rem)' }}
          >
            {heroLines.map((line, i) => (
              <span key={line} className="line-mask">
                <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-enter mx-auto mb-10 max-w-3xl text-balance text-base font-medium leading-relaxed text-haze [animation-delay:0.45s] md:text-xl">
            {clauseWrap(about.hero.lede)}
          </p>
          <Link
            href="/"
            className="hero-enter focus-ring group inline-flex items-center rounded-full text-base font-medium text-lilac transition-colors [animation-delay:0.6s] hover:text-pearl md:text-lg"
          >
            {about.hero.cta}
            <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </section>

      {/* 起源：一段長文，捲動經過時一道「閱讀光」由段首掃到段尾 */}
      <section className="bg-night py-24 md:py-40">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeader align="left" title={about.origin.title} />
          <ScrubText
            text={about.origin.body}
            className="mb-0 font-serif text-xl font-semibold leading-[1.85] text-pearl md:text-[1.7rem]"
          />
        </div>
      </section>

      {/* AI 引擎：頁尾「共用 AI 引擎」與首頁那一句連到這裡 */}
      <EngineFlywheel copy={about.engine} />

      {/* 願景：頁尾「願景」連到這裡 */}
      <section id="vision" className="relative overflow-hidden bg-night py-28 md:py-44">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(185,167,255,0.12),transparent)] blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <SectionHeader title={about.vision.title} spacing="mb-10 md:mb-14" />
          {/* font-semibold 明確化：Noto Serif TC 沒有 400 */}
          <figure className="relative mx-auto max-w-3xl">
            <p
              className="mb-0 text-balance font-serif font-semibold leading-[1.75] text-pearl/90"
              style={{ fontSize: 'clamp(1.2rem, 1.7vw, 1.6rem)' }}
            >
              「{about.vision.quote}」
            </p>
          </figure>
        </div>
      </section>

      <section className="bg-night pb-28 pt-8 text-center md:pb-40">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/business" className="btn-primary gap-2 px-11 py-5 text-lg">
            {about.cta}
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
