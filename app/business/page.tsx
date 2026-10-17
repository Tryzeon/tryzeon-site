import type { Metadata } from 'next';
import { ArrowUpRight, BarChart3, Camera, Clapperboard, FileSpreadsheet, Mail, Mic, Network, ScanLine, Shirt, Sparkles, Store, TrendingUp } from 'lucide-react';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { PhoneFan } from '@/components/PhoneFan';
import { RevealItem, RevealList } from '@/components/RevealList';
import { SectionHeader } from '@/components/SectionHeader';
import { StepsTrack } from '@/components/StepsTrack';
import { HeroTitleLines, SubpageBackdrop } from '@/components/SubpageHero';
import { TiltCard } from '@/components/TiltCard';
import { keepRanges, sentenceWrap } from '@/components/clauseWrap';
import { copy } from '@/lib/copy';
import { brandFaqGroups } from '@/lib/faq-data';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/business',
  title: '品牌合作 — 上架一次，四個通路同步',
  description:
    'Tryzeon 為中小型時尚品牌整合 Tryzeon App、LINE 官方帳號、品牌官網與門市 QR Code，提供 AI 虛擬試穿與專業推薦。',
  shareTitle: '品牌合作 — Tryzeon',
  shareDescription: '上架一次，四個通路同步。AI 虛擬試穿與專業推薦，接上你的品牌。',
});

export const revalidate = 3600;

// 順序對應 copy.business.listing.items
const LISTING_ICONS = [FileSpreadsheet, Mic, Camera] as const;
// 順序對應 copy.business.fit.items
const FIT_ICONS = [Shirt, Store, TrendingUp] as const;
// 順序對應 copy.business.features.items
const FEATURE_ICONS = [Sparkles, ScanLine, BarChart3, Clapperboard, Network] as const;
// 五張效益卡：桌機上排三張、下排兩張等寬；平板兩欄，最後一張跨滿
const FEATURE_SPAN = ['lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-3', 'md:col-span-2 lg:col-span-3'] as const;

const SECONDARY =
  'focus-ring inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-[#101828]/15 bg-white/70 backdrop-blur-md text-[#101828] font-semibold hover:bg-white hover:border-[#101828]/30 transition-colors duration-300';
const PHONES = ['aiTagBefore', 'aiTagAfterTags', 'voiceSizeShirt'] as const;
// TiltCard 的卡片本體；外層 li 負責進場與 grid 版位
const CARD = 'glass-panel p-7 md:p-9';

function ContactButtons() {
  const { business, contact } = copy;
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
      <a href={business.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2">
        {business.hero.ctaPrimary}
        <ArrowUpRight className="h-5 w-5" aria-hidden />
      </a>
      <a href={`mailto:${contact.email}?subject=${encodeURIComponent(business.emailSubject)}`} className={SECONDARY}>
        <Mail className="h-5 w-5" aria-hidden />
        {business.hero.ctaSecondary}
      </a>
    </div>
  );
}

export default function BusinessPage() {
  const { business } = copy;
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: brandFaqGroups.flatMap((group) => group.items).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navigation />

      <section className="relative overflow-hidden pt-36 md:pt-44 pb-24 md:pb-36 text-center">
        <SubpageBackdrop />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1
            className="max-w-3xl mx-auto cjk-punct text-balance font-serif font-black tracking-[-0.02em] leading-[1.1] text-[#101828] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 1.6rem + 4vw, 5rem)' }}
          >
            <HeroTitleLines text={business.hero.title} />
          </h1>
          <p className="hero-enter [animation-delay:0.3s] text-base md:text-xl text-[#475467] font-medium leading-relaxed mb-10 md:mb-12 text-balance">
            {sentenceWrap(business.hero.lede)}
          </p>
          <div className="hero-enter [animation-delay:0.45s]">
            <ContactButtons />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={business.fit.title} />
          <RevealList className="grid gap-4 md:grid-cols-3">
            {business.fit.items.map((entry, i) => {
              const Icon = FIT_ICONS[i];
              return (
                <RevealItem key={entry.title}>
                  <TiltCard className={CARD} wrapperClassName="h-full">
                    <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                    <h3 className="mt-5 text-lg md:text-xl font-semibold text-[#101828]">{entry.title}</h3>
                    <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{entry.desc}</p>
                  </TiltCard>
                </RevealItem>
              );
            })}
          </RevealList>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title={business.steps.title} />
          <StepsTrack>
            {business.steps.items.map((step, i) => (
              <RevealItem key={step.title}>
                <TiltCard className={`${CARD} flex flex-col`} wrapperClassName="h-full">
                  <span className="font-mono text-sm font-semibold text-[#1D4ED8]" aria-hidden>
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-lg md:text-xl font-semibold text-[#101828]">{step.title}</h3>
                  <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{step.desc}</p>
                  {'link' in step && (
                    <div className="mt-auto pt-4">
                      <MoreLink href={step.link.href} small>
                        {step.link.label}
                      </MoreLink>
                    </div>
                  )}
                </TiltCard>
              </RevealItem>
            ))}
          </StepsTrack>

          {/* 上架方式（左）＋ 品牌後台實機畫面（右）；手機版畫面排在清單下方 */}
          <div className="mt-20 md:mt-28 grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <h3 className="text-sm font-semibold text-[#475467]">{business.listing.label}</h3>
              <ul className="mt-4 divide-y divide-[#101828]/10 border-y border-[#101828]/10">
                {business.listing.items.map((entry, i) => {
                  const Icon = LISTING_ICONS[i];
                  return (
                    <li key={entry.title} className="flex gap-5 py-6 md:py-7">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10">
                        <Icon className="h-5 w-5 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                      </span>
                      <div className="md:grid md:flex-1 md:grid-cols-[9rem_1fr] md:items-baseline md:gap-6 md:pt-2.5">
                        <h4 className="text-base md:text-lg font-semibold text-[#101828]">{entry.title}</h4>
                        <p className="mb-0 mt-1 text-balance text-sm md:mt-0 md:text-base leading-relaxed text-[#475467]">
                          {entry.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <PhoneFan names={PHONES} />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={business.features.title} />
          <RevealList className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {business.features.items.map((entry, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <RevealItem key={entry.title} className={FEATURE_SPAN[i]}>
                  <TiltCard className={CARD} wrapperClassName="h-full" max={6}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10">
                      <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                    </span>
                    <h3 className="mt-6 text-lg md:text-xl font-semibold text-[#101828]">{entry.title}</h3>
                    {/* 說明較長，不用 text-balance（會把行寬縮窄、斷在詞中間） */}
                    <p className="mt-2 text-sm md:text-base leading-relaxed text-[#475467]">{keepRanges(entry.desc)}</p>
                  </TiltCard>
                </RevealItem>
              );
            })}
          </RevealList>
        </div>
      </section>

      {/* 頁尾「品牌常見問題」連到 #faq；題目依品牌做決定的順序分組 */}
      <section id="faq" className="py-24 md:py-36 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader title={business.faq.title} />
          <div className="glass-card rounded-3xl p-6 md:p-12 space-y-10 md:space-y-12">
            {brandFaqGroups.map((group) => (
              <div key={group.title}>
                <h3 className="max-w-3xl mx-auto mb-4 text-sm font-semibold text-[#475467]">{group.title}</h3>
                <FAQ items={group.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-28 md:py-44 bg-[#FAFAFA]">
        <SubpageBackdrop glow="center" intensity={0.8} fadeTop />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <SectionHeader title={business.cta.title} />
          <ContactButtons />
        </div>
      </section>

      <Footer />
    </div>
  );
}
