'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AppScreen } from '@/components/AppScreen';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap } from '@/components/clauseWrap';
import { APP_IMAGES, type AppImageName } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { MEDIA, gsap } from '@/lib/gsap';

// 每個通路的畫面，順序對應 copy.home.brands.channels：前三個是螢幕畫面（放手機框），門市是店內照片（白邊相框，不假裝是螢幕）
const CHANNEL_VISUALS = ['storePage', 'lineChatEntry', 'embedMobile', 'storeQr'] as const satisfies readonly AppImageName[];
// 四道光束從頂端的商品出發，落在四欄的中心（viewBox 0–100）
const BEAM_ENDS = [12.5, 37.5, 62.5, 87.5] as const;
const beamPath = (x: number) => `M50 0 C 50 55, ${x} 45, ${x} 100`;
const VISUAL_W = 'w-[200px] lg:w-[min(200px,100%)]';

interface ChannelSyncProps {
  copy: HomeCopy['brands'];
}

/**
 * 四通路：頂端一件商品（上架一次），四道光束隨捲動一路往下畫向四個通路的實機畫面，
 * 每到一站那一欄就浮上來；之後光點沿光束持續流動。通路不加卡片底，畫面直接放在畫布上。
 * 手機與平板：商品在上、四個通路橫向滑動（容器內捲動，不讓整頁橫向捲），不畫光束。
 * 品牌端怎麼上架（三種方式＋後台畫面）只在 /business 說明。
 */
export function ChannelSync({ copy }: ChannelSyncProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mm = gsap.matchMedia(stage);
    mm.add({ any: MEDIA.any, desktop: MEDIA.desktop, reduce: MEDIA.reduce }, (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stage, start: 'top 80%', end: 'center 55%', scrub: 0.8 },
      });
      tl.from('[data-source]', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'power2.out' });
      if (desktop) {
        tl.fromTo('[data-beam]', { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1, stagger: 0.12, ease: 'none' }, '<0.2');
      }
      tl.from(
        '[data-channel]',
        { opacity: 0, y: desktop ? 60 : 30, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        desktop ? '<0.55' : '<0.2',
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="brands" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader align="left" title={copy.title} lede={copy.lede} />

        <div ref={stageRef}>
          {/* 光源：一件商品，三圈脈衝光環 */}
          <div data-source className="relative mx-auto flex aspect-square w-48 items-center justify-center md:w-56">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute inset-[18%] rounded-full border border-[#2563EB]/25 motion-safe:animate-[pulseRing_3.6s_cubic-bezier(0.16,1,0.3,1)_infinite]"
                style={{ animationDelay: `${i * 1.2}s` }}
                aria-hidden
              />
            ))}
            <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(96,165,250,0.22),transparent)] blur-xl" aria-hidden />
            <div className="relative w-[50%] overflow-hidden rounded-[1.4rem] border-[3px] border-white bg-white shadow-[0_24px_48px_-16px_rgba(16,24,40,0.25),0_0_48px_-8px_rgba(37,99,235,0.3)]">
              <Image
                src={APP_IMAGES.productHero.src}
                alt={siteCopy.images.productHero}
                width={APP_IMAGES.productHero.width}
                height={APP_IMAGES.productHero.height}
                sizes="112px"
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* 光束（桌機）：從商品往下分成四道 */}
          <svg className="-mt-6 hidden h-40 w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="channel-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            {BEAM_ENDS.map((x, i) => (
              <g key={x}>
                <path d={beamPath(x)} fill="none" stroke="rgba(16,24,40,0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path
                  data-beam
                  d={beamPath(x)}
                  fill="none"
                  stroke="url(#channel-beam)"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  strokeDasharray="100 100"
                />
                <path
                  d={beamPath(x)}
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  strokeDasharray="6 94"
                  className="motion-safe:animate-[beamFlow_2.8s_linear_infinite]"
                  style={{ animationDelay: `${i * -0.7}s`, filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.8))' }}
                />
              </g>
            ))}
          </svg>

          <ul className="-mx-6 mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:-mx-12 md:px-12 lg:mx-0 lg:mt-0 lg:grid lg:grid-cols-4 lg:gap-10 lg:overflow-visible lg:px-0 lg:pb-0">
            {copy.channels.map((channel, i) => {
              const visual = CHANNEL_VISUALS[i];
              return (
                <li
                  key={channel.name}
                  data-channel
                  className="group relative flex w-[64vw] max-w-[260px] shrink-0 snap-center flex-col pt-5 lg:w-auto lg:max-w-none"
                >
                  {/* 光束落點 */}
                  <span
                    className="absolute -top-[5px] left-1/2 hidden h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[#06B6D4] shadow-[0_0_12px_3px_rgba(6,182,212,0.45)] lg:block"
                    aria-hidden
                  />
                  <div className="flex justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                    {visual === 'storeQr' ? (
                      <div className={`${VISUAL_W} rounded-[2.6rem] border border-[#101828]/10 bg-white p-[7px] shadow-[0_32px_80px_rgba(16,24,40,0.16),0_8px_24px_rgba(16,24,40,0.08)]`}>
                        <Image
                          src={APP_IMAGES.storeQr.src}
                          alt={siteCopy.images.storeQr}
                          width={APP_IMAGES.storeQr.width}
                          height={APP_IMAGES.storeQr.height}
                          sizes="200px"
                          className="aspect-[900/1957] w-full rounded-[2.2rem] object-cover"
                        />
                      </div>
                    ) : (
                      <AppScreen name={visual} sizes="200px" className={VISUAL_W} />
                    )}
                  </div>
                  <div className="mt-10 border-t border-[#101828]/10 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-[#101828]">{channel.name}</h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]">
                        <span className="relative flex h-1.5 w-1.5" aria-hidden>
                          <span className="absolute inset-0 rounded-full bg-[#06B6D4] motion-safe:animate-ping" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-[#06B6D4]" />
                        </span>
                        {copy.status}
                      </span>
                    </div>
                    <p className="mb-0 mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{clauseWrap(channel.desc)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-14 lg:mt-16">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
