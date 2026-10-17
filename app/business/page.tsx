import type { Metadata } from 'next';
import { ArrowUpRight, BarChart3, Camera, Clapperboard, FileSpreadsheet, Mail, Mic, Network, ScanLine, Shirt, Sparkles, Store, TrendingUp } from 'lucide-react';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { PhoneFan } from '@/components/PhoneFan';
import { SectionHeader } from '@/components/SectionHeader';
import { SilkBackdrop } from '@/components/SilkBackdrop';
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

const PHONES = ['aiTagBefore', 'aiTagAfterTags', 'voiceSizeShirt'] as const;
const CARD = 'spotlight glass-panel group relative overflow-hidden p-7 md:p-9';
const ICON_BOX =
  'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-lilac/25 to-aqua/10 text-pearl transition-transform duration-500 group-hover:scale-110';

function ContactButtons() {
  const { business, contact } = copy;
  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row md:gap-4">
      <a href={business.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2">
        {business.hero.ctaPrimary}
        <ArrowUpRight className="h-5 w-5" aria-hidden />
      </a>
      <a href={`mailto:${contact.email}?subject=${encodeURIComponent(business.emailSubject)}`} className="btn-ghost gap-2">
        <Mail className="h-5 w-5" aria-hidden />
        {business.hero.ctaSecondary}
      </a>
    </div>
  );
}

export default function BusinessPage() {
  const { business } = copy;
  const heroLines = business.hero.title.split(/(?<=[，；：。])/).filter(Boolean);
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
    <div className="min-h-screen bg-night">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
          <p className="hero-enter mb-10 max-w-2xl text-balance text-base font-medium leading-relaxed text-haze [animation-delay:0.45s] md:mb-12 md:text-xl">
            {sentenceWrap(business.hero.lede)}
          </p>
          <div className="hero-enter [animation-delay:0.6s]">
            <ContactButtons />
          </div>
        </div>
      </section>

      <section className="bg-night py-24 md:py-36">
        <div className="mx-auto max-w-[1360px] px-6 md:px-12">
          <SectionHeader align="left" title={business.fit.title} />
          <ul className="grid gap-4 md:grid-cols-3">
            {business.fit.items.map((entry, i) => {
              const Icon = FIT_ICONS[i];
              return (
                <li key={entry.title} className={CARD}>
                  <Icon className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-white/[0.03]" strokeWidth={1} aria-hidden />
                  <span className={ICON_BOX}>
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-pearl md:text-xl">{entry.title}</h3>
                  <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-haze md:text-base">{entry.desc}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-night py-24 md:py-36">
        <div className="mx-auto max-w-[1360px] px-6 md:px-12">
          <SectionHeader align="left" title={business.steps.title} />

          {/* 三步驟：一整塊玻璃切成三欄，上緣一道光沿著流程走 */}
          <ol className="glass-panel relative grid overflow-hidden md:grid-cols-3">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden bg-white/10" aria-hidden>
              <span className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-lilac to-transparent motion-safe:animate-[slideX_4s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
            {business.steps.items.map((step, i) => (
              <li
                key={step.title}
                className="spotlight relative flex flex-col border-white/10 p-8 md:p-10 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0"
              >
                <span className="opal-text font-serif text-5xl font-black leading-none md:text-6xl" aria-hidden>
                  0{i + 1}
                </span>
                <h3 className="mt-8 text-lg font-semibold text-pearl md:text-xl">{step.title}</h3>
                <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-haze md:text-base">{step.desc}</p>
                {'link' in step && (
                  <div className="mt-auto pt-6">
                    <MoreLink href={step.link.href} small>
                      {step.link.label}
                    </MoreLink>
                  </div>
                )}
              </li>
            ))}
          </ol>

          {/* 上架方式（左）＋ 品牌後台實機畫面的 3D 扇形（右） */}
          <div className="mt-24 grid items-center gap-16 md:mt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <h3 className="text-sm font-semibold text-dim">{business.listing.label}</h3>
              <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {business.listing.items.map((entry, i) => {
                  const Icon = LISTING_ICONS[i];
                  return (
                    <li key={entry.title} className="group flex gap-5 py-6 md:py-7">
                      <span className={`${ICON_BOX} h-11 w-11 shrink-0`}>
                        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <div className="md:grid md:flex-1 md:grid-cols-[9rem_1fr] md:items-baseline md:gap-6 md:pt-2.5">
                        <h4 className="text-base font-semibold text-pearl md:text-lg">{entry.title}</h4>
                        <p className="mb-0 mt-1 text-balance text-sm leading-relaxed text-haze md:mt-0 md:text-base">{entry.desc}</p>
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

      <section className="bg-night py-24 md:py-36">
        <div className="mx-auto max-w-[1360px] px-6 md:px-12">
          <SectionHeader align="left" title={business.features.title} />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {business.features.items.map((entry, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <li key={entry.title} className={`${CARD} ${FEATURE_SPAN[i]}`}>
                  <Icon className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 text-white/[0.03]" strokeWidth={1} aria-hidden />
                  <span className={ICON_BOX}>
                    <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-pearl md:text-xl">{entry.title}</h3>
                  {/* 說明較長，不用 text-balance（會把行寬縮窄、斷在詞中間） */}
                  <p className="mb-0 mt-2 text-sm leading-relaxed text-haze md:text-base">{keepRanges(entry.desc)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 頁尾「品牌常見問題」連到 #faq；題目依品牌做決定的順序分組 */}
      <section id="faq" className="bg-night py-24 md:py-36">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader align="left" title={business.faq.title} spacing="mb-0" />
          </div>
          <div className="space-y-12">
            {brandFaqGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-sm font-semibold text-dim">{group.title}</h3>
                <FAQ items={group.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-night py-36 md:py-52">
        <SilkBackdrop variant="soft" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <SectionHeader title={business.cta.title} />
          <ContactButtons />
        </div>
      </section>

      <Footer />
    </div>
  );
}
