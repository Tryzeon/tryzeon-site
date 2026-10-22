import Image from 'next/image';
import { ArrowUpRight, Lock, ShieldCheck, Trash2, type LucideIcon } from 'lucide-react';
import { AmbientGlow } from '@/components/AmbientGlow';
import { AppScreen } from '@/components/AppScreen';
import { Footer } from '@/components/Footer';
import { IconCardGrid } from '@/components/IconCardGrid';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { StepsPanel } from '@/components/StepsPanel';
import { StoreBadges } from '@/components/StoreBadges';
import { TiltStage } from '@/components/TiltStage';
import { clauseWrap, sentenceWrap } from '@/components/clauseWrap';
import { GET_QR_SRC, LINE_OA_QR_SRC } from '@/lib/app-images';
import { getCopy } from '@/lib/get-copy';
import type { Locale } from '@/lib/i18n';

// 順序對應 copy.download.privacy.items
const PRIVACY_ICONS: readonly LucideIcon[] = [Lock, ShieldCheck, Trash2];

interface DownloadPageProps {
  locale: Locale;
}

/** /download 與 /en/download 共用的頁面本體 */
export function DownloadPage({ locale }: DownloadPageProps) {
  const { download, contact } = getCopy(locale);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28 text-center lg:text-left">
        <AmbientGlow variant="hero" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
          <div>
            <h1
              className="cjk-punct text-balance font-serif font-black tracking-[-0.02em] leading-[1.1] text-[#101828] mb-6"
              style={{ fontSize: 'clamp(2rem, 1.3rem + 2.2vw, 3.2rem)' }}
            >
              {clauseWrap(download.title)}
            </h1>
            <p className="text-base md:text-xl text-[#475467] font-medium leading-relaxed text-balance mb-10 md:mb-12">
              {sentenceWrap(download.lede)}
            </p>
            <StoreBadges className="lg:justify-start" />
            <p className="mt-6 mb-0 text-sm md:text-base text-[#475467]">
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
          {/* 與首頁 hero 同一個 3D 舞台：游標在這一區移動，手機就轉向游標，螢幕上的反光點跟著走 */}
          <div className="flex flex-col items-center">
            <TiltStage trackSection max={7} className="relative mx-auto">
              {/* 落在地面的柔影：舞台轉動時留在原地，景深更明確 */}
              <span
                className="pointer-events-none absolute -bottom-8 left-1/2 h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent)] blur-xl"
                aria-hidden
              />
              <div className="relative">
                <AppScreen
                  name="tryonTweed"
                  sizes="(min-width: 484px) 300px, 62vw"
                  priority
                  className="w-[62vw] max-w-[300px]"
                />
                <span className="pointer-events-none absolute inset-[7px] overflow-hidden rounded-[2.2rem]" aria-hidden>
                  <span className="tilt-glare absolute inset-0" />
                </span>
              </div>
            </TiltStage>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={download.steps.title} />
          <StepsPanel items={download.steps.items} />
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader title={download.privacy.title} />
          <IconCardGrid items={download.privacy.items} icons={PRIVACY_ICONS} />
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

      <Footer locale={locale} />
    </div>
  );
}
