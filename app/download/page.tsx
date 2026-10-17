import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, Camera, Lock, Shirt, ShieldCheck, Sparkles, Trash2, type LucideIcon } from 'lucide-react';
import { AppScreen } from '@/components/AppScreen';
import { Footer } from '@/components/Footer';
import { HeroTitle } from '@/components/HeroTitle';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { SilkBackdrop } from '@/components/SilkBackdrop';
import { StoreBadges } from '@/components/StoreBadges';
import { TiltStage } from '@/components/TiltStage';
import { keepRanges, sentenceWrap } from '@/components/clauseWrap';
import { GET_QR_SRC, LINE_OA_QR_SRC } from '@/lib/app-images';
import { copy } from '@/lib/copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/download',
  title: '下載 App — iOS 與 Android',
  description:
    '免費下載 Tryzeon App：上傳一張全身照，在試衣間挑選可能合身的合作品牌商品，約 15–20 秒看見試穿結果。',
  shareTitle: '下載 Tryzeon App',
  shareDescription: '一張全身照，就能看見自己穿上的樣子。iOS 與 Android 免費下載。',
});

export const revalidate = 3600;

// 順序對應 copy.download.steps.items / privacy.items
const STEP_ICONS: readonly LucideIcon[] = [Camera, Shirt, Sparkles];
const PRIVACY_ICONS: readonly LucideIcon[] = [Lock, ShieldCheck, Trash2];

const CARD = 'glass-panel p-7 md:p-9';

export default function DownloadPage() {
  const { download, contact } = copy;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28 text-center lg:text-left">
        <SilkBackdrop />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_80%_at_50%_42%,rgba(250,250,250,0.88)_0%,rgba(250,250,250,0.55)_45%,rgba(250,250,250,0)_78%)] lg:bg-[radial-gradient(ellipse_62%_85%_at_22%_50%,rgba(250,250,250,0.94)_0%,rgba(250,250,250,0.62)_48%,rgba(250,250,250,0)_80%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#FAFAFA]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
          <div>
            <HeroTitle
              text={download.title}
              className="cjk-punct text-balance font-serif font-black tracking-[-0.02em] leading-[1.1] text-[#101828] mb-6"
              style={{ fontSize: 'clamp(2rem, 1.3rem + 2.2vw, 3.2rem)' }}
            />
            <p className="hero-enter [animation-delay:0.4s] text-base md:text-xl text-[#344054] font-medium leading-relaxed text-balance mb-10 md:mb-12">
              {sentenceWrap(download.lede)}
            </p>
            <div className="hero-enter [animation-delay:0.55s]">
              <StoreBadges className="lg:justify-start" />
            </div>
            <p className="hero-enter [animation-delay:0.65s] mt-6 mb-0 text-sm md:text-base text-[#475467]">
              {download.lineOa.text}{' '}
              <a
                href={contact.lineOa.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-0.5 rounded-sm font-semibold text-[#1D4ED8] hover:text-[#2563EB] transition-colors"
              >
                {download.lineOa.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </p>
            {/* 桌機掃碼：App 下載與 LINE 官方帳號各一張 */}
            <div className="hidden lg:flex flex-wrap gap-4 mt-8">
              {[
                { src: GET_QR_SRC, alt: download.qr.alt, caption: download.qr.caption },
                { src: LINE_OA_QR_SRC, alt: download.lineOa.qrAlt, caption: download.lineOa.qrCaption },
              ].map((qr) => (
                <div key={qr.src} className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl p-4">
                  <Image src={qr.src} width={96} height={96} alt={qr.alt} unoptimized />
                  <p className="mb-0 max-w-[9rem] text-sm leading-relaxed text-[#475467]">{qr.caption}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <TiltStage className="relative">
              <div
                className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.35)_0%,rgba(96,165,250,0.18)_40%,transparent_70%)] blur-2xl [transform:translateZ(-140px)]"
                aria-hidden
              />
              <div className="hero-enter [animation-delay:0.2s]">
                <AppScreen
                  name="tryonOutfit"
                  sizes="(min-width: 484px) 300px, 62vw"
                  priority
                  className="w-[62vw] max-w-[300px] mx-auto"
                />
              </div>
            </TiltStage>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={download.steps.title} />
          <ol className="grid gap-4 md:grid-cols-3">
            {download.steps.items.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li key={step.title} className={`${CARD} group`}>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10">
                      <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="relative block font-serif text-5xl font-black leading-none lining-nums" aria-hidden>
                      <span className="text-outline">{i + 1}</span>
                      <span className="text-iris absolute left-0 top-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">{i + 1}</span>
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg md:text-xl font-semibold text-[#101828]">{step.title}</h3>
                  <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{keepRanges(step.desc)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={download.privacy.title} />
          <ul className="grid gap-4 md:grid-cols-3">
            {download.privacy.items.map((point, i) => {
              const Icon = PRIVACY_ICONS[i];
              return (
                <li key={point.title} className={CARD}>
                  <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold text-[#101828]">{point.title}</h3>
                  <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{point.desc}</p>
                </li>
              );
            })}
          </ul>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {download.privacy.links.map((link) => (
              <li key={link.href}>
                <MoreLink href={link.href} small>
                  {link.label}
                </MoreLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
