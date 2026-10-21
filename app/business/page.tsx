import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, BarChart3, Camera, Clapperboard, FileSpreadsheet, Mail, Mic, Network, ScanLine, Shirt, Sparkles, Store, TrendingUp } from 'lucide-react';
import { AmbientGlow } from '@/components/AmbientGlow';
import { AppScreen } from '@/components/AppScreen';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { TryOnVideo } from '@/components/TryOnVideo';
import { keepRanges, sentenceWrap, splitClauses } from '@/components/clauseWrap';
import { APP_IMAGES, type AppImageName, type TryOnVideoName } from '@/lib/app-images';
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
const LISTING_ICONS = [FileSpreadsheet, Camera, Mic] as const;
// 順序對應 copy.business.fit.items
const FIT_ICONS = [Shirt, Store, TrendingUp] as const;
// 順序對應 copy.business.features.items
const FEATURE_ICONS = [Sparkles, ScanLine, BarChart3, Clapperboard, Network] as const;
// 效益前四項各配實機畫面（順序對應 copy.business.features.items）；第五項「四個通路」只有文字
const FEATURE_VISUALS = [
  { kind: 'images', names: ['tryonHero', 'tryonCurvy'] },
  { kind: 'images', names: ['agentWardrobe'] },
  { kind: 'images', names: ['dashboardRanking'] },
  { kind: 'video', video: 'office' },
] as const satisfies readonly ({ kind: 'images'; names: readonly AppImageName[] } | { kind: 'video'; video: TryOnVideoName })[];
const FEATURE_PHONE = 'w-[40vw] max-w-[220px] lg:w-[240px] lg:max-w-none';
const FEATURE_PHONE_SIZES = '(min-width: 1024px) 240px, 40vw';

const SECONDARY =
  'focus-ring inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-[#101828]/15 bg-white/70 backdrop-blur-md text-[#101828] font-semibold hover:bg-white hover:border-[#101828]/30 transition-colors duration-300';
const PHONES = ['aiTagBefore', 'aiTagAfterTags', 'voiceSizeShirt'] as const;
const CARD = 'glass-panel p-7 md:p-9';
// 「適合這樣的品牌」的卡片：右下角壓一枚放大的淡色圖示當浮水印，左上是漸層底的圖示框
const FIT_CARD = 'glass-panel relative overflow-hidden p-7 md:p-9';
const FIT_ICON_BOX =
  'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-[#2563EB]/15 to-[#06B6D4]/10 text-[#1D4ED8]';

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

      <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28 text-center">
        <AmbientGlow variant="hero" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* 與首頁 hero 同一套進場（CSS-only，SSR HTML 就帶著）：大標逐子句從遮罩下升起（.line-mask），
              其餘依序淡入上移（.hero-enter）。標題在每個寬度都斷在「，」，一個子句一行 */}
          <h1
            className="max-w-3xl mx-auto cjk-punct text-balance font-serif font-black tracking-[-0.02em] leading-[1.1] text-[#101828] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 1.6rem + 4vw, 5rem)' }}
          >
            {splitClauses(business.hero.title).map((clause, i) => (
              <span key={clause} className="line-mask">
                <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{keepRanges(clause)}</span>
              </span>
            ))}
          </h1>
          <p className="hero-enter [animation-delay:0.45s] text-base md:text-xl text-[#475467] font-medium leading-relaxed mb-10 md:mb-12 text-balance">
            {sentenceWrap(business.hero.lede)}
          </p>
          <div className="hero-enter [animation-delay:0.55s]">
            <ContactButtons />
          </div>
        </div>
        {/* 品牌官網嵌入的示意畫面（瀏覽器外框只是相框，畫面是示範官網實際渲染的頁面） */}
        <figure className="hero-enter [animation-delay:0.7s] relative z-10 mx-auto mt-16 md:mt-20 max-w-5xl px-6">
          <div className="overflow-hidden rounded-2xl border border-[#101828]/10 bg-white shadow-[0_32px_80px_rgba(16,24,40,0.16),0_8px_24px_rgba(16,24,40,0.08)]">
            <div className="flex gap-1.5 border-b border-[#101828]/10 bg-[#F2F4F7] px-4 py-3" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#101828]/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#101828]/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#101828]/15" />
            </div>
            <Image
              src={APP_IMAGES.embedDesktop.src}
              alt={copy.images.embedDesktop}
              width={APP_IMAGES.embedDesktop.width}
              height={APP_IMAGES.embedDesktop.height}
              sizes="(min-width: 1072px) 1024px, calc(100vw - 48px)"
              priority
              className="h-auto w-full"
            />
          </div>
        </figure>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={business.fit.title} />
          <ul className="grid gap-4 md:grid-cols-3">
            {business.fit.items.map((entry, i) => {
              const Icon = FIT_ICONS[i];
              return (
                <li key={entry.title} className={FIT_CARD}>
                  <Icon className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-[#2563EB]/[0.06]" strokeWidth={1} aria-hidden />
                  <span className={FIT_ICON_BOX}>
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="relative mt-6 text-lg md:text-xl font-semibold text-[#101828]">{entry.title}</h3>
                  <p className="relative mb-0 mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{entry.desc}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title={business.steps.title} />
          <ol className="grid gap-4 md:grid-cols-3">
            {business.steps.items.map((step, i) => (
              <li key={step.title} className={`${CARD} flex flex-col`}>
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
              </li>
            ))}
          </ol>

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

            <div className="flex justify-center gap-3 md:gap-4">
              {PHONES.map((name) => (
                <AppScreen
                  key={name}
                  name={name}
                  sizes="(min-width: 1024px) 168px, (min-width: 768px) 200px, 28vw"
                  className="w-[28vw] max-w-[200px] lg:w-[168px]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={business.features.title} />
          {/* 前四項：左文右圖、逐列交錯；手機版文字在上、畫面在下 */}
          <ul className="space-y-4 md:space-y-6">
            {business.features.items.map((entry, i) => {
              const Icon = FEATURE_ICONS[i];
              const visual = FEATURE_VISUALS[i];
              const text = (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10">
                    <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg md:text-xl font-semibold text-[#101828]">{entry.title}</h3>
                  {/* 說明較長，不用 text-balance（會把行寬縮窄、斷在詞中間） */}
                  <p className="mb-0 mt-2 text-sm md:text-base leading-relaxed text-[#475467]">{keepRanges(entry.desc)}</p>
                </>
              );
              if (!visual) {
                return (
                  <li key={entry.title} className={CARD}>
                    {text}
                  </li>
                );
              }
              return (
                <li
                  key={entry.title}
                  className={`${CARD} grid items-center gap-10 lg:grid-cols-2 lg:gap-16 lg:py-14 lg:px-16`}
                >
                  <div className={`max-w-md ${i % 2 === 1 ? 'lg:order-2 lg:justify-self-end' : ''}`}>{text}</div>
                  <div className="flex justify-center gap-4 md:gap-6">
                    {visual.kind === 'video' ? (
                      <TryOnVideo video={visual.video} replayLabel={copy.home.experience.replay} className={FEATURE_PHONE} />
                    ) : (
                      visual.names.map((name, j) => (
                        <figure key={name} className="m-0">
                          <AppScreen name={name} sizes={FEATURE_PHONE_SIZES} className={FEATURE_PHONE} />
                          {visual.names.length > 1 && (
                            <figcaption className="mt-3 text-center text-sm font-semibold text-[#475467]">
                              {business.features.fitNotes[j]}
                            </figcaption>
                          )}
                        </figure>
                      ))
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 頁尾「品牌常見問題」連到 #faq；題目依品牌做決定的順序分組 */}
      <section id="faq" className="py-24 md:py-32 bg-[#FAFAFA]">
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

      <section className="relative overflow-hidden py-24 md:py-40 bg-[#FAFAFA]">
        <AmbientGlow />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <SectionHeader title={business.cta.title} />
          <ContactButtons />
        </div>
      </section>

      <Footer />
    </div>
  );
}
