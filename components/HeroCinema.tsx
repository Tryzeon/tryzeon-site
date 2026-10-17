'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Magnetic } from '@/components/Magnetic';
import { TryOnScan } from '@/components/TryOnScan';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { trackCTA } from '@/lib/analytics';
import type { HomeCopy } from '@/lib/copy';

// 純視覺的 WebGL 背景，不影響 SEO：不進 SSR，three.js 拆成獨立 chunk
const SilkCanvas = dynamic(() => import('@/components/three/SilkCanvas').then((m) => m.SilkCanvas), { ssr: false });

interface HeroCinemaProps {
  copy: HomeCopy['hero'];
}

/**
 * 首屏：滿版的夜色絲綢（跟著游標起伏）＋左側大標＋右側 3D 試穿示範。
 * 文字欄全用 CSS 進場（.line-mask / .hero-enter），SSR HTML 就帶著動畫，不等 hydration。
 */
export function HeroCinema({ copy }: HeroCinemaProps) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-night">
      {/* WebGL 載入前的底：同色系的柔光，絲綢淡入時不會有落差 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-[-10%] top-[10%] h-[70vh] w-[70vw] bg-[radial-gradient(closest-side,rgba(185,167,255,0.16),transparent)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[20%] h-[50vh] w-[50vw] bg-[radial-gradient(closest-side,rgba(110,231,240,0.10),transparent)] blur-3xl" />
      </div>
      <SilkCanvas />
      {/* 可讀性：左半壓暗給文字，底部收進下一段的夜色 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,15,0.92)_0%,rgba(8,9,15,0.7)_32%,rgba(8,9,15,0)_62%)] max-lg:bg-[linear-gradient(180deg,rgba(8,9,15,0.75)_0%,rgba(8,9,15,0.35)_45%,rgba(8,9,15,0.6)_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1360px] items-center gap-16 px-6 pb-20 pt-32 md:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:pb-16 lg:pt-28">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1
            className="cjk-punct mb-8 font-serif font-black leading-[1.04] tracking-[-0.02em] text-pearl md:mb-10"
            style={{ fontSize: 'clamp(3rem, 1.4rem + 6.6vw, 7.6rem)' }}
          >
            {copy.titleLines.map((line, i) => (
              <span key={line} className="line-mask">
                <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="hero-enter mb-0 max-w-xl text-balance text-base font-medium leading-relaxed text-pearl/90 [animation-delay:0.45s] md:text-xl">
            {clauseWrap(copy.sub)}
          </p>

          <p className="hero-enter mb-0 mt-4 max-w-xl text-balance text-sm leading-relaxed text-haze [animation-delay:0.55s] md:text-base">
            {keepRanges(copy.service)}
          </p>

          <div className="hero-enter mt-10 flex w-full flex-col gap-3 [animation-delay:0.7s] sm:w-auto sm:flex-row md:mt-12 md:gap-4">
            <Magnetic>
              <Link href="/business" onClick={() => trackCTA('hero_business')} className="btn-primary w-full text-base">
                {copy.ctaPrimary}
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/download" onClick={() => trackCTA('hero_download')} className="btn-ghost w-full text-base">
                {copy.ctaSecondary}
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end lg:pr-6">
          <TryOnScan />
        </div>
      </div>

      {/* 往下捲的提示：一條會流動的細線 */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden h-14 w-px -translate-x-1/2 overflow-hidden bg-white/10 md:block" aria-hidden>
        <span className="block h-full w-full bg-gradient-to-b from-lilac to-aqua motion-safe:animate-[scrollCue_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
      </div>
    </section>
  );
}
