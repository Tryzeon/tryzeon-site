import Image from 'next/image';
import { ArrowUpRight, Mail, Shirt, Store, TrendingUp } from 'lucide-react';
import { AmbientGlow } from '@/components/AmbientGlow';
import { BrandBenefits } from '@/components/BrandBenefits';
import { FAQ } from '@/components/FAQ';
import { IconCardGrid } from '@/components/IconCardGrid';
import { Footer } from '@/components/Footer';
import { ListingStudio } from '@/components/ListingStudio';
import { Magnetic } from '@/components/Magnetic';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { StepsPanel } from '@/components/StepsPanel';
import { keepRanges, sentenceWrap, splitClauses } from '@/components/clauseWrap';
import { APP_IMAGES } from '@/lib/app-images';
import { getCopy, getFaq } from '@/lib/get-copy';
import type { Locale } from '@/lib/i18n';

// 順序對應 copy.business.fit.items
const FIT_ICONS = [Shirt, Store, TrendingUp] as const;

const SECONDARY =
  'focus-ring inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full border border-[#101828]/15 bg-white/70 backdrop-blur-md text-[#101828] font-semibold hover:bg-white hover:border-[#101828]/30 transition-colors duration-300';

function ContactButtons({ locale }: { locale: Locale }) {
  const { business, contact } = getCopy(locale);
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

interface BusinessPageProps {
  locale: Locale;
}

/** /business 與 /en/business 共用的頁面本體 */
export function BusinessPage({ locale }: BusinessPageProps) {
  const copy = getCopy(locale);
  const { business } = copy;
  const { brandFaqGroups } = getFaq(locale);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: brandFaqGroups.flatMap((group) => [...group.items]).map((item) => ({
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
            <ContactButtons locale={locale} />
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
          <IconCardGrid items={business.fit.items} icons={FIT_ICONS} />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title={business.steps.title} />
          <StepsPanel items={business.steps.items} />

          {/* 三種上架方式：素材 → 品牌後台實機畫面的互動示範 */}
          <div className="mt-20 md:mt-28">
            <ListingStudio />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={business.features.title} />
          <BrandBenefits locale={locale} />
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
          <ContactButtons locale={locale} />
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}
