import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, Camera, FileSpreadsheet, Mail, Mic, Shirt, Store, TrendingUp } from 'lucide-react';
import { AmbientGlow } from '@/components/AmbientGlow';
import { BrandBenefits } from '@/components/BrandBenefits';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { Magnetic } from '@/components/Magnetic';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { keepRanges, sentenceWrap, splitClauses } from '@/components/clauseWrap';
import { APP_IMAGES } from '@/lib/app-images';
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

const SECONDARY =
  'focus-ring inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-[#101828]/15 bg-white/70 backdrop-blur-md text-[#101828] font-semibold hover:bg-white hover:border-[#101828]/30 transition-colors duration-300';
const PHONES = ['aiTagBefore', 'aiTagAfterTags', 'voiceSizeShirt'] as const;
// 「適合這樣的品牌」的卡片：右下角壓一枚放大的淡色圖示當浮水印，左上是漸層底的圖示框
const FIT_CARD = 'glass-panel relative overflow-hidden p-7 md:p-9';
const FIT_ICON_BOX =
  'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-[#2563EB]/15 to-[#06B6D4]/10 text-[#1D4ED8]';

function ContactButtons() {
  const { business, contact } = copy;
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
      {/* 與首頁 CTA 同一個磁吸互動；flex-col 讓按鈕在手機直排時撐滿寬度 */}
      <Magnetic className="flex flex-col">
        <a href={business.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2">
          {business.hero.ctaPrimary}
          <ArrowUpRight className="h-5 w-5" aria-hidden />
        </a>
      </Magnetic>
      <Magnetic className="flex flex-col">
        <a href={`mailto:${contact.email}?subject=${encodeURIComponent(business.emailSubject)}`} className={SECONDARY}>
          <Mail className="h-5 w-5" aria-hidden />
          {business.hero.ctaSecondary}
        </a>
      </Magnetic>
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
          {/* 三步驟：一整塊玻璃切成三欄 */}
          <ol className="glass-panel relative grid overflow-hidden lg:grid-cols-3">
            {business.steps.items.map((step, i) => (
              <li
                key={step.title}
                className="relative flex flex-col border-[#101828]/10 p-8 md:p-10 [&:not(:first-child)]:border-t lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0"
              >
                <span className="bg-gradient-to-br from-[#2563EB] to-[#06B6D4] bg-clip-text font-serif text-5xl font-black leading-none text-transparent md:text-6xl" aria-hidden>
                  0{i + 1}
                </span>
                <h3 className="mt-8 text-lg md:text-xl font-semibold text-[#101828]">{step.title}</h3>
                <p className="mb-0 mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{step.desc}</p>
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

            {/* 桌機的畫面偏小：滑過哪一支就放大到可以看清楚上面的字，其他兩支退後變淡。
                最右邊那支往左放大，不推出版心造成橫向捲動 */}
            <div className="group/phones flex justify-center gap-3 md:gap-4">
              {PHONES.map((name, i) => (
                <div
                  key={name}
                  className={`relative transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hover:z-10 lg:hover:scale-[1.75] lg:group-hover/phones:opacity-40 lg:hover:!opacity-100 ${
                    i === PHONES.length - 1 ? 'origin-right' : 'origin-center'
                  }`}
                >
                  {/* 細框：PhoneFrame 的 7px 白邊與大圓角放大後會壓到截圖的邊角，這裡收成 3px、小圓角 */}
                  <div className="w-[28vw] max-w-[200px] rounded-[1.4rem] border border-[#101828]/10 bg-white p-[3px] shadow-[0_24px_60px_rgba(16,24,40,0.14),0_6px_18px_rgba(16,24,40,0.08)] lg:w-[168px]">
                    <Image
                      src={APP_IMAGES[name].src}
                      alt={copy.images[name]}
                      width={APP_IMAGES[name].width}
                      height={APP_IMAGES[name].height}
                      sizes="(min-width: 1024px) 300px, (min-width: 768px) 200px, 28vw"
                      className="aspect-[900/1957] w-full rounded-[1.2rem] object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={business.features.title} />
          <BrandBenefits />
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
