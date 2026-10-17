import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight, Camera, Lock, Shirt, ShieldCheck, Sparkles, Trash2, type LucideIcon } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { SilkBackdrop } from '@/components/SilkBackdrop';
import { StoreBadges } from '@/components/StoreBadges';
import { TiltPhone } from '@/components/TiltPhone';
import { clauseWrap, keepRanges, sentenceWrap } from '@/components/clauseWrap';
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

const ICON_BOX =
  'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-lilac/25 to-aqua/10 text-pearl transition-transform duration-500 group-hover:scale-110';

export default function DownloadPage() {
  const { download, contact } = copy;

  return (
    <div className="min-h-screen bg-night">
      <Navigation />

      <section className="relative overflow-hidden">
        <SilkBackdrop variant="hero" focus="left" />
        <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-[1360px] items-center gap-16 px-6 pb-24 pt-36 text-center md:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:text-left">
          <div>
            <h1
              className="hero-enter cjk-punct mb-6 text-balance font-serif font-black leading-[1.1] tracking-[-0.02em] text-pearl"
              style={{ fontSize: 'clamp(2.2rem, 1.2rem + 3vw, 4.2rem)' }}
            >
              {clauseWrap(download.title)}
            </h1>
            <p className="hero-enter mb-10 text-balance text-base font-medium leading-relaxed text-haze [animation-delay:0.15s] md:mb-12 md:text-xl">
              {sentenceWrap(download.lede)}
            </p>
            <div className="hero-enter [animation-delay:0.3s]">
              <StoreBadges className="lg:justify-start" />
            </div>
            <p className="hero-enter mb-0 mt-6 text-sm text-haze [animation-delay:0.4s] md:text-base">
              {download.lineOa.text}{' '}
              <a
                href={contact.lineOa.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-0.5 rounded-sm font-semibold text-lilac transition-colors hover:text-pearl"
              >
                {download.lineOa.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </p>
            {/* 桌機掃碼：App 下載與 LINE 官方帳號各一張 */}
            <div className="hero-enter mt-8 hidden flex-wrap gap-4 [animation-delay:0.5s] lg:flex">
              {[
                { src: GET_QR_SRC, alt: download.qr.alt, caption: download.qr.caption },
                { src: LINE_OA_QR_SRC, alt: download.lineOa.qrAlt, caption: download.lineOa.qrCaption },
              ].map((qr) => (
                <div key={qr.src} className="opal-border flex items-center gap-4 rounded-2xl bg-night/70 p-3 pr-5 backdrop-blur-xl">
                  <span className="rounded-xl bg-white p-1.5">
                    <Image src={qr.src} width={84} height={84} alt={qr.alt} unoptimized />
                  </span>
                  <p className="mb-0 max-w-[9rem] text-sm leading-relaxed text-haze">{qr.caption}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-enter flex justify-center [animation-delay:0.2s]">
            <TiltPhone
              name="tryonOutfit"
              sizes="(min-width: 484px) 300px, 62vw"
              priority
              className="w-[62vw] max-w-[300px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-night py-24 md:py-36">
        <div className="mx-auto max-w-[1360px] px-6 md:px-12">
          <SectionHeader align="left" title={download.steps.title} />
          <ol className="glass-panel relative grid overflow-hidden md:grid-cols-3">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden bg-white/10" aria-hidden>
              <span className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-lilac to-transparent motion-safe:animate-[slideX_4s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
            {download.steps.items.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li
                  key={step.title}
                  className="spotlight group relative border-white/10 p-8 md:p-10 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0"
                >
                  <div className="flex items-center justify-between">
                    <span className={ICON_BOX}>
                      <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="opal-text font-serif text-4xl font-black leading-none" aria-hidden>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold text-pearl md:text-xl">{step.title}</h3>
                  <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-haze md:text-base">{keepRanges(step.desc)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-night pb-28 pt-12 md:pb-40 md:pt-20">
        <div className="mx-auto max-w-[1360px] px-6 md:px-12">
          <SectionHeader align="left" title={download.privacy.title} />
          <ul className="grid gap-4 md:grid-cols-3">
            {download.privacy.items.map((point, i) => {
              const Icon = PRIVACY_ICONS[i];
              return (
                <li key={point.title} className="spotlight glass-panel group relative overflow-hidden p-7 md:p-9">
                  <Icon className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-white/[0.03]" strokeWidth={1} aria-hidden />
                  <span className={ICON_BOX}>
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-pearl">{point.title}</h3>
                  <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-haze md:text-base">{point.desc}</p>
                </li>
              );
            })}
          </ul>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
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
