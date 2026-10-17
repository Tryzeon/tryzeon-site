import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, Camera, Lock, Shirt, ShieldCheck, Sparkles, Trash2, type LucideIcon } from 'lucide-react';
import { AppScreen } from '@/components/AppScreen';
import { Footer } from '@/components/Footer';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { PhoneFrame } from '@/components/PhoneFrame';
import { RevealItem, RevealList } from '@/components/RevealList';
import { ScanReveal } from '@/components/ScanReveal';
import { SectionHeader } from '@/components/SectionHeader';
import { StoreBadges } from '@/components/StoreBadges';
import { HeroTitleLines, SubpageBackdrop } from '@/components/SubpageHero';
import { TiltCard } from '@/components/TiltCard';
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

      <section className="relative overflow-hidden pt-36 md:pt-44 pb-24 md:pb-32 text-center lg:text-left">
        <SubpageBackdrop mask="left" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
          <div>
            <h1
              className="cjk-punct text-balance font-serif font-black tracking-[-0.02em] leading-[1.1] text-[#101828] mb-6"
              style={{ fontSize: 'clamp(2rem, 1.3rem + 2.2vw, 3.2rem)' }}
            >
              <HeroTitleLines text={download.title} />
            </h1>
            <p className="hero-enter [animation-delay:0.3s] text-base md:text-xl text-[#475467] font-medium leading-relaxed text-balance mb-10 md:mb-12">
              {sentenceWrap(download.lede)}
            </p>
            <div className="hero-enter [animation-delay:0.42s]">
              <StoreBadges className="lg:justify-start" />
            </div>
            <p className="hero-enter [animation-delay:0.5s] mt-6 mb-0 text-sm md:text-base text-[#475467]">
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
            <div className="hero-enter [animation-delay:0.58s] hidden lg:flex flex-wrap gap-4 mt-8">
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
          {/* 3D 舞台：手機跟著游標微傾（桌機精準指標），載入時掃描顯影一次 */}
          <div className="flex flex-col items-center">
            <TiltStage className="w-[62vw] max-w-[300px] mx-auto">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[150%] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_60%)] [transform:translate(-50%,-50%)_translateZ(-120px)]"
                aria-hidden
              />
              <div className="lg:motion-safe:animate-float-y">
                <PhoneFrame>
                  <ScanReveal delay={0.45}>
                    <AppScreen name="tryonOutfit" framed={false} sizes="(min-width: 484px) 300px, 62vw" priority />
                  </ScanReveal>
                </PhoneFrame>
              </div>
            </TiltStage>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={download.steps.title} />
          <RevealList as="ol" className="grid gap-4 md:grid-cols-3">
            {download.steps.items.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <RevealItem key={step.title}>
                  <TiltCard className={CARD} wrapperClassName="h-full">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10">
                        <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="font-mono text-sm font-semibold text-[#1D4ED8]" aria-hidden>
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg md:text-xl font-semibold text-[#101828]">{step.title}</h3>
                    <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{keepRanges(step.desc)}</p>
                  </TiltCard>
                </RevealItem>
              );
            })}
          </RevealList>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={download.privacy.title} />
          <RevealList className="grid gap-4 md:grid-cols-3">
            {download.privacy.items.map((point, i) => {
              const Icon = PRIVACY_ICONS[i];
              return (
                <RevealItem key={point.title}>
                  <TiltCard className={CARD} wrapperClassName="h-full">
                    <Icon className="h-6 w-6 text-[#2563EB]" strokeWidth={1.5} aria-hidden />
                    <h3 className="mt-5 text-lg font-semibold text-[#101828]">{point.title}</h3>
                    <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{point.desc}</p>
                  </TiltCard>
                </RevealItem>
              );
            })}
          </RevealList>
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
