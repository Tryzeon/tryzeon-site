'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Globe, MessageCircle, QrCode, Smartphone, type LucideIcon } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap } from '@/components/clauseWrap';
import { APP_IMAGES } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { MEDIA, gsap } from '@/lib/gsap';

// 順序對應 copy.home.brands.channels
const CHANNEL_ICONS: readonly LucideIcon[] = [Smartphone, MessageCircle, Globe, QrCode];
// 四條光束的終點（viewBox 0–100），對齊右欄四張等高卡片的垂直中心
const BEAM_ENDS = [12.5, 37.5, 62.5, 87.5] as const;
const beamPath = (y: number) => `M0 50 C 45 50, 55 ${y}, 100 ${y}`;

interface ChannelSyncProps {
  copy: HomeCopy['brands'];
}

/**
 * 四通路：左邊一件商品（上架一次），四道光束隨捲動一路畫向右邊的四個通路，
 * 每到一站就點亮那張卡；之後光點沿光束持續流動。手機版直排，不畫光束。
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
        scrollTrigger: { trigger: stage, start: 'top 78%', end: 'center 48%', scrub: 0.8 },
      });
      tl.from('[data-source]', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'power2.out' });
      if (desktop) {
        tl.fromTo('[data-beam]', { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1, stagger: 0.12, ease: 'none' }, '<0.2');
      }
      tl.from(
        '[data-channel]',
        { opacity: 0, x: desktop ? 60 : 0, y: desktop ? 0 : 30, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        desktop ? '<0.55' : '<0.2',
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="brands" className="relative bg-night py-28 md:py-40">
      <div className="mx-auto max-w-[1360px] px-6 md:px-12">
        <SectionHeader align="left" title={copy.title} lede={copy.lede} />

        <div
          ref={stageRef}
          className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,0.55fr)_minmax(0,1.3fr)] lg:gap-0"
        >
          {/* 光源：一件商品，四圈脈衝光環 */}
          <div data-source className="relative mx-auto flex aspect-square w-56 items-center justify-center md:w-64 lg:w-full lg:max-w-[300px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute inset-[18%] rounded-full border border-lilac/40 motion-safe:animate-[pulseRing_3.6s_cubic-bezier(0.16,1,0.3,1)_infinite]"
                style={{ animationDelay: `${i * 1.2}s` }}
                aria-hidden
              />
            ))}
            <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(185,167,255,0.28),transparent)] blur-xl" aria-hidden />
            <div className="opal-border relative w-[46%] overflow-hidden rounded-[1.4rem] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(185,167,255,0.55)]">
              <Image
                src={APP_IMAGES.productWhiteShirt.src}
                alt={siteCopy.images.productWhiteShirt}
                width={APP_IMAGES.productWhiteShirt.width}
                height={APP_IMAGES.productWhiteShirt.height}
                sizes="140px"
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* 光束（桌機） */}
          <svg className="hidden h-full min-h-[420px] w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="channel-beam" x1="0" x2="1">
                <stop offset="0%" stopColor="#C9B8FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6EE7F0" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {BEAM_ENDS.map((y, i) => (
              <g key={y}>
                <path d={beamPath(y)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path
                  data-beam
                  d={beamPath(y)}
                  fill="none"
                  stroke="url(#channel-beam)"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  strokeDasharray="100 100"
                />
                <path
                  d={beamPath(y)}
                  fill="none"
                  stroke="#F4F0FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  strokeDasharray="5 95"
                  className="motion-safe:animate-[beamFlow_2.8s_linear_infinite]"
                  style={{ animationDelay: `${i * -0.7}s`, filter: 'drop-shadow(0 0 4px rgba(201,184,255,0.9))' }}
                />
              </g>
            ))}
          </svg>

          <ul className="grid gap-4 lg:auto-rows-fr">
            {copy.channels.map((channel, i) => {
              const Icon = CHANNEL_ICONS[i];
              return (
                <li
                  key={channel.name}
                  data-channel
                  className="spotlight glass-panel group relative flex items-start gap-5 rounded-3xl p-6 md:p-7"
                >
                  {/* 光束落點 */}
                  <span
                    className="absolute -left-[5px] top-1/2 hidden h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-aqua shadow-[0_0_12px_3px_rgba(110,231,240,0.7)] lg:block"
                    aria-hidden
                  />
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-lilac/25 to-aqua/10 text-pearl transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-pearl md:text-xl">{channel.name}</h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-aqua/30 bg-aqua/[0.08] px-2.5 py-1 text-[11px] font-semibold text-aqua">
                        <span className="relative flex h-1.5 w-1.5" aria-hidden>
                          <span className="absolute inset-0 rounded-full bg-aqua motion-safe:animate-ping" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-aqua" />
                        </span>
                        {copy.status}
                      </span>
                    </div>
                    <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-haze md:text-base">{clauseWrap(channel.desc)}</p>
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
