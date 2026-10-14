'use client';

import { motion } from 'framer-motion';
import { Globe, MessageCircle, QrCode, Smartphone, type LucideIcon } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap } from '@/components/clauseWrap';
import type { HomeCopy } from '@/lib/copy';
import { fadeUpItem as item, inView, staggerList as list } from '@/lib/motion';

// 順序對應 copy.home.brands.channels
const CHANNEL_ICONS: readonly LucideIcon[] = [Smartphone, MessageCircle, Globe, QrCode];

interface ChannelSyncProps {
  copy: HomeCopy['brands'];
}

/**
 * 四通路總覽：上架一次，同步到四個已上線的通路。
 * 品牌端怎麼上架（三種方式＋後台畫面）只在 /business 說明。
 */
export function ChannelSync({ copy }: ChannelSyncProps) {
  return (
    <section id="brands" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />

        <motion.ul variants={list} {...inView} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.channels.map((channel, i) => {
            const Icon = CHANNEL_ICONS[i];
            return (
              <motion.li
                key={channel.name}
                variants={item}
                className="flex flex-col rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 md:p-7 shadow-[0_8px_32px_rgba(16,24,40,0.10)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101828] text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4]" aria-hidden />
                    {copy.status}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-[#101828]">{channel.name}</h3>
                <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{clauseWrap(channel.desc)}</p>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mt-12 text-center">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
