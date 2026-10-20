'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap } from '@/components/clauseWrap';
import { APP_IMAGES, type AppImageName } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { fadeUpItem as item, inView, staggerList as list } from '@/lib/motion';

// 每個通路的畫面，順序對應 copy.home.brands.channels：前三個是螢幕畫面（放手機框），門市是店內照片（白邊相框，不假裝是螢幕）
const CHANNEL_VISUALS = ['storePage', 'lineChatEntry', 'embedMobile', 'storeQr'] as const satisfies readonly AppImageName[];
const VISUAL_W = 'w-[200px]';

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

        {/* 桌機四欄；手機與平板橫向滑動（容器內捲動，不讓整頁橫向捲）。不加卡片底，畫面直接放在畫布上 */}
        <motion.ul
          variants={list}
          {...inView}
          className="-mx-6 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:-mx-12 md:px-12 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-10 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {copy.channels.map((channel, i) => (
            <motion.li key={channel.name} variants={item} className="w-[64vw] max-w-[260px] shrink-0 snap-center lg:w-auto lg:max-w-none">
              <div className="flex justify-center">
                {CHANNEL_VISUALS[i] === 'storeQr' ? (
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
                  <AppScreen name={CHANNEL_VISUALS[i]} sizes="200px" className={VISUAL_W} />
                )}
              </div>
              <div className="mt-10 border-t border-[#101828]/10 pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="flex items-baseline gap-2.5 text-lg font-semibold text-[#101828]">
                    <span className="font-mono text-xs font-semibold text-[#1D4ED8]" aria-hidden>
                      0{i + 1}
                    </span>
                    {channel.name}
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#0E7490]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4]" aria-hidden />
                    {copy.status}
                  </span>
                </div>
                <p className="mb-0 mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{clauseWrap(channel.desc)}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-14 text-center">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
