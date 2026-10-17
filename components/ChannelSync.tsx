'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Globe, MessageCircle, QrCode, Smartphone, type LucideIcon } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { TiltStage } from '@/components/TiltStage';
import { clauseWrap } from '@/components/clauseWrap';
import type { HomeCopy } from '@/lib/copy';
import { fadeUpItem as item, inView, staggerList as list } from '@/lib/motion';

// 順序對應 copy.home.brands.channels
const CHANNEL_ICONS: readonly LucideIcon[] = [Smartphone, MessageCircle, Globe, QrCode];

// 桌機四欄的欄中心（viewBox 0–1000 的比例；gap 只有 16px，各寬度下都落在這幾個點附近）
const WIRE_X = [120, 373, 627, 880] as const;
const wirePath = (x: number) => `M500 0 C500 46 ${x} 34 ${x} 80`;

interface ChannelSyncProps {
  copy: HomeCopy['brands'];
}

/**
 * 四通路總覽：上架一次，同步到四個已上線的通路。
 * 「同步」畫成實際發生的事：桌機上一個來源（Tryzeon）分出四條線，
 * 區塊在畫面內時，一道光同時沿四條線送到四張通路卡，卡緣亮起、「上線」燈號閃一下。
 * 節奏與光的路徑都在 globals.css（.sync-*），離開畫面就暫停。
 * 品牌端怎麼上架（三種方式＋後台畫面）只在 /business 說明。
 */
export function ChannelSync({ copy }: ChannelSyncProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const syncing = useInView(sceneRef, { amount: 0.35 });

  return (
    <section id="brands" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} spacing="mb-14 md:mb-20 lg:mb-10" />

        <div ref={sceneRef} className={syncing ? 'is-syncing' : undefined}>
          <motion.div variants={item} {...inView} className="hidden lg:block" aria-hidden>
            <div className="flex justify-center">
              <span className="sync-hub relative flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-white bg-white shadow-[0_10px_30px_rgba(37,99,235,0.16)]">
                <Image src="/images/logo/tryzeon_logomark.png" alt="" width={843} height={661} sizes="36px" className="h-7 w-auto" />
              </span>
            </div>
            <svg viewBox="0 0 1000 80" preserveAspectRatio="none" className="block h-20 w-full overflow-visible">
              <defs>
                <linearGradient id="sync-wire-gradient" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#2563EB" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              {WIRE_X.map((x) => (
                <path key={`wire-${x}`} d={wirePath(x)} className="sync-wire" />
              ))}
              {WIRE_X.map((x) => (
                <path key={`pulse-${x}`} d={wirePath(x)} pathLength={1} className="sync-pulse" stroke="url(#sync-wire-gradient)" />
              ))}
            </svg>
          </motion.div>

          <motion.ul variants={list} {...inView} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.channels.map((channel, i) => {
              const Icon = CHANNEL_ICONS[i];
              return (
                <motion.li key={channel.name} variants={item} className="flex">
                  <TiltStage max={6} className="group relative flex w-full">
                    <div className="relative flex w-full flex-col rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_8px_32px_rgba(16,24,40,0.10)] transition-shadow duration-500 [transform-style:preserve-3d] group-hover:shadow-[0_24px_60px_rgba(37,99,235,0.16)] md:p-7">
                      <span className="sync-edge pointer-events-none absolute inset-0 rounded-3xl" aria-hidden />
                      <span className="tilt-sheen pointer-events-none absolute inset-0 rounded-3xl" aria-hidden />
                      <div className="flex items-center justify-between [transform:translateZ(36px)]">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101828] text-white">
                          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]">
                          <span className="sync-ping relative h-1.5 w-1.5 rounded-full bg-[#06B6D4]" aria-hidden />
                          {copy.status}
                        </span>
                      </div>
                      <div className="[transform:translateZ(18px)]">
                        <h3 className="mt-6 text-lg font-semibold text-[#101828]">{channel.name}</h3>
                        <p className="mt-2 text-balance text-sm leading-relaxed text-[#475467] md:text-base">{clauseWrap(channel.desc)}</p>
                      </div>
                    </div>
                  </TiltStage>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        <div className="mt-12 text-center">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
