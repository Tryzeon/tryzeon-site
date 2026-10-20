'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AppScreen } from '@/components/AppScreen';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { keepRanges } from '@/components/clauseWrap';
import { LINE_OA_QR_SRC, type AppImageName } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { fadeUpItem, inView, staggerList } from '@/lib/motion';

interface LineFlowProps {
  copy: HomeCopy['line'];
}

// 五步驟各配一張 LINE 實機截圖，順序對應 copy.home.line.steps
const STEP_SCREENS = ['line1Ask', 'line2Recommend', 'line3FittingRoom', 'line4Result', 'line5Product'] as const satisfies readonly AppImageName[];

/** LINE 試穿流程：五個步驟，每一步配 Tryzeon LINE 官方帳號的實機截圖（不畫模擬聊天介面） */
export function LineFlow({ copy }: LineFlowProps) {
  return (
    <section id="line" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />
        {/* 桌機：五支手機並排；手機與平板：橫向滑動（容器內捲動，不讓整頁橫向捲） */}
        <motion.ol
          variants={staggerList}
          {...inView}
          className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:-mx-12 md:px-12 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {copy.steps.map((item, i) => (
            <motion.li
              key={item.title}
              variants={fadeUpItem}
              className="w-[62vw] max-w-[240px] shrink-0 snap-center lg:w-auto lg:max-w-none"
            >
              <AppScreen name={STEP_SCREENS[i]} sizes="(min-width: 1280px) 224px, (min-width: 1024px) 18vw, 62vw" />
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-black leading-none lining-nums text-[#2563EB]" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-[#101828]">{item.title}</h3>
              </div>
              {item.quote && (
                <p className="cjk-punct mb-0 mt-3 font-serif text-lg font-semibold leading-snug text-[#101828]">
                  {item.quote}
                </p>
              )}
              <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-[#475467] md:text-base">{keepRanges(item.desc)}</p>
            </motion.li>
          ))}
        </motion.ol>

        {/* 親自試試：加入 Tryzeon 的 LINE 官方帳號走一遍流程；桌機附 QR Code（電腦上點連結無法加好友） */}
        <motion.div
          variants={fadeUpItem}
          {...inView}
          className="mx-auto mt-16 md:mt-20 flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-white/60 bg-white/70 p-7 text-center shadow-[0_8px_32px_rgba(16,24,40,0.06)] backdrop-blur-xl md:p-9 lg:flex-row lg:text-left"
        >
          <figure className="hidden shrink-0 lg:block">
            <Image src={LINE_OA_QR_SRC} width={112} height={112} alt={copy.tryIt.qrAlt} unoptimized />
            <figcaption className="mt-2 text-center text-xs text-[#475467]">{copy.tryIt.qrCaption}</figcaption>
          </figure>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-[#101828]">{copy.tryIt.title}</h3>
            <p className="mt-2 mb-0 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{copy.tryIt.desc}</p>
            <a
              href={siteCopy.contact.lineOa.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 gap-2 text-base"
            >
              {copy.tryIt.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </motion.div>

        {/* 從 /business 的導入步驟點過來的人，看完流程一鍵回到方案 */}
        <div className="mt-10 md:mt-12 text-center">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
