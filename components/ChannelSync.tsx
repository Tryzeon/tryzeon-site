'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Globe, MessageCircle, QrCode, Smartphone, type LucideIcon } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap } from '@/components/clauseWrap';
import type { HomeCopy } from '@/lib/copy';
import { EASE } from '@/lib/motion';

// 順序對應 copy.home.brands.channels
const CHANNEL_ICONS: readonly LucideIcon[] = [Smartphone, MessageCircle, Globe, QrCode];
// 光脈衝一輪的長度與各通路的錯開（與 globals.css 的 beamPulse / beamArrive 一致）
const PULSE_S = 3.6;
const PULSE_GAP_S = 0.9;
// 進場：光束一條條畫出來之後，脈衝才開始跑
const DRAW_S = 0.9;

interface Beam {
  d: string;
  /** 卡片在中樞左側：光脈衝的漸層要反過來（中樞端紫、卡片端青） */
  left: boolean;
}

interface ChannelSyncProps {
  copy: HomeCopy['brands'];
}

/**
 * 四通路：中間是 Tryzeon 中樞，四條光束接到四張通路卡。
 * 進場時光束依序畫出，之後光脈衝輪流從中樞送到每個通路——抵達時那張卡的圖示亮一下。
 * 桌機是「左二、中樞、右二」；窄螢幕中樞在上、卡片直排，不畫光束。
 */
export function ChannelSync({ copy }: ChannelSyncProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [beams, setBeams] = useState<Beam[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const entered = useInView(stageRef, { once: true, amount: 0.35 });

  // 量中樞與卡片的位置，畫出從中樞邊緣到卡片內側的曲線。
  // 用 offsetLeft/offsetTop 一路加到 stage：不受進場動畫的 transform（位移、縮放）影響
  useEffect(() => {
    const stage = stageRef.current;
    const hub = hubRef.current;
    if (!stage || !hub) return;
    const offsetIn = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== stage) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };
    const measure = () => {
      if (hub.offsetWidth === 0 || !window.matchMedia('(min-width: 1024px)').matches) {
        setBeams([]);
        return;
      }
      const h = offsetIn(hub);
      const r = hub.offsetWidth / 2;
      const cx = h.x + r;
      const cy = h.y + hub.offsetHeight / 2;
      const next = cardRefs.current.map((card) => {
        if (!card) return { d: '', left: true };
        const c = offsetIn(card);
        const left = c.x + card.offsetWidth / 2 < cx;
        const x1 = left ? c.x + card.offsetWidth : c.x;
        const y1 = c.y + card.offsetHeight / 2;
        const angle = Math.atan2(y1 - cy, x1 - cx);
        const x0 = cx + Math.cos(angle) * (r + 8);
        const y0 = cy + Math.sin(angle) * (r + 8);
        const mid = (x0 + x1) / 2;
        return {
          d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} C ${mid.toFixed(1)} ${y0.toFixed(1)}, ${mid.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`,
          left,
        };
      });
      setSize({ w: stage.offsetWidth, h: stage.offsetHeight });
      setBeams(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="brands" className="relative overflow-hidden bg-[#FAFAFA] py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />

        <div ref={stageRef} className="relative">
          {/* 光束（桌機）：底線＋畫出動畫＋循環的光脈衝 */}
          {beams.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 hidden lg:block"
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`}
              aria-hidden
            >
              <defs>
                <linearGradient id="beam-r" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C6AE6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="beam-l" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#7C6AE6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              {beams.map((beam, i) =>
                beam.d ? (
                  <g key={i}>
                    <motion.path
                      d={beam.d}
                      fill="none"
                      stroke="#101828"
                      strokeOpacity={0.12}
                      strokeWidth={1}
                      initial={{ pathLength: 0 }}
                      animate={entered ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: DRAW_S, ease: EASE, delay: 0.2 + i * 0.12 }}
                    />
                    {entered && (
                      <path
                        d={beam.d}
                        pathLength={100}
                        fill="none"
                        stroke={beam.left ? 'url(#beam-l)' : 'url(#beam-r)'}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        className="beam-pulse"
                        style={{ animationDelay: `${DRAW_S + 0.4 + i * PULSE_GAP_S}s`, animationDuration: `${PULSE_S}s` }}
                      />
                    )}
                  </g>
                ) : null,
              )}
            </svg>
          )}

          {/* 中樞：桌機絕對置中於兩欄卡片之間；窄螢幕排在卡片上方 */}
          <div className="mb-10 flex justify-center lg:pointer-events-none lg:absolute lg:inset-0 lg:mb-0 lg:items-center" aria-hidden>
            <motion.div
              ref={hubRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={entered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, ease: EASE }}
              className="relative h-36 w-36 lg:h-56 lg:w-56"
            >
              {/* 擴散的同步波 */}
              <span className="ripple-ring absolute inset-0 rounded-full border border-[#7C6AE6]/30" />
              <span className="ripple-ring absolute inset-0 rounded-full border border-[#22D3EE]/30 [animation-delay:1.6s]" />
              {/* 轉動的珠光環 */}
              <span className="spin-slow absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,#C4B5FD,#93C5FD,#67E8F9,#C4B5FD,#F5F3FF,#C4B5FD)] [mask:radial-gradient(farthest-side,transparent_calc(100%-3px),#000_calc(100%-2px))]" />
              <span className="absolute inset-2 rounded-full border border-white/80 bg-white/75 shadow-[0_30px_80px_-20px_rgba(91,69,214,0.45),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl" />
              <span className="absolute inset-0 flex items-center justify-center">
                <Image src="/images/logo/tryzeon_logomark.png" alt="" width={843} height={661} sizes="96px" className="w-14 lg:w-24" />
              </span>
            </motion.div>
          </div>

          <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-2 lg:gap-x-[22rem] lg:gap-y-6 xl:gap-x-[26rem]">
            {copy.channels.map((channel, i) => {
              const Icon = CHANNEL_ICONS[i];
              return (
                <motion.li
                  key={channel.name}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.5 + i * 0.12 }}
                  className="glass-panel flex flex-col p-6 md:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101828] text-white">
                      {entered && (
                        <span
                          className="beam-arrive absolute -inset-1 hidden rounded-[1.1rem] lg:block"
                          style={{ animationDelay: `${DRAW_S + 0.4 + i * PULSE_GAP_S}s`, animationDuration: `${PULSE_S}s` }}
                          aria-hidden
                        />
                      )}
                      <Icon className="relative h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06B6D4] opacity-60" aria-hidden />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#06B6D4]" aria-hidden />
                      </span>
                      {copy.status}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-[#101828]">{channel.name}</h3>
                  <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-[#475467] md:text-base">{clauseWrap(channel.desc)}</p>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="mt-14 text-center">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
