'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { keepRanges } from '@/components/clauseWrap';
import { LINE_OA_QR_SRC } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { EASE, fadeUpItem, inView } from '@/lib/motion';

// 桌機：光點從第一站走到最後一站的秒數；每站在光點抵達時亮起
const RUN_S = 2.4;

const node: Variants = {
  hidden: { scale: 0.55, opacity: 0.5 },
  show: (delay: number) => ({ scale: 1, opacity: 1, transition: { duration: 0.6, ease: EASE, delay } }),
};
const ripple: Variants = {
  hidden: { scale: 1, opacity: 0 },
  show: (delay: number) => ({
    scale: [1, 3.2],
    opacity: [0.5, 0],
    transition: { duration: 1.2, ease: 'easeOut', delay },
  }),
};
const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } }),
};

interface LineFlowProps {
  copy: HomeCopy['line'];
}

/**
 * LINE 試穿流程：純文字時間軸（尚無實機截圖，不放圖、不畫模擬聊天介面）。
 * 桌機：捲到時時間軸由左到右畫出，前端一顆光點，經過哪一站那一站就亮起、文字跟著浮上來（只播一次）。
 * 手機：直向時間軸，每一站進入視窗時各自亮起。
 */
export function LineFlow({ copy }: LineFlowProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const entered = useInView(listRef, { once: true, amount: 0.35 });
  // 延遲只在桌機（五站同列、一起進入視窗）才錯開；SSR 與手機都是 0，不影響初始樣式
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // 偏好減少動態：不跑光點、各站同時出現（initial 不分支，只改延遲與光點目標）
  const reduced = useReducedMotion();
  const last = copy.steps.length - 1;
  const arrival = (i: number) => (desktop && !reduced ? 0.2 + (i / last) * RUN_S : 0.1);

  return (
    <section id="line" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />
        <ol
          ref={listRef}
          className="relative mx-auto grid max-w-md gap-12 sm:max-w-xl lg:max-w-none lg:grid-cols-5 lg:gap-8"
        >
          {/* 時間軸——手機：左側直線；桌機：橫向底軌＋畫出來的亮線與光點 */}
          <span
            className="pointer-events-none absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-[#2563EB]/40 to-[#06B6D4]/40 lg:hidden"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute left-0 right-[calc((100%_-_8rem)/5_-_11px)] top-[5px] hidden h-px bg-[#101828]/[0.07] lg:block"
            aria-hidden
          >
            <motion.span
              className="absolute inset-0 origin-left bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#06B6D4]"
              initial={{ scaleX: 0 }}
              animate={entered ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: RUN_S, ease: [0.45, 0, 0.25, 1], delay: 0.2 }}
            />
            <motion.span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_2px_#2563EB,0_0_18px_6px_rgba(6,182,212,0.55)]"
              initial={{ left: '0%', opacity: 0 }}
              animate={entered && !reduced ? { left: '100%', opacity: [0, 1, 1, 0] } : { left: '0%', opacity: 0 }}
              transition={{
                left: { duration: RUN_S, ease: [0.45, 0, 0.25, 1], delay: 0.2 },
                opacity: { duration: RUN_S + 0.4, times: [0, 0.08, 0.85, 1], delay: 0.2 },
              }}
            />
          </span>

          {copy.steps.map((step, i) => (
            <Step key={step.title} step={step} index={i} delay={arrival(i)} desktopEntered={entered} desktop={desktop} />
          ))}
        </ol>

        {/* 親自試試：加入 Tryzeon 的 LINE 官方帳號走一遍流程；桌機附 QR Code（電腦上點連結無法加好友） */}
        <motion.div
          variants={fadeUpItem}
          {...inView}
          className="iridescent-hover mx-auto mt-16 md:mt-20 flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-white/60 bg-white/70 p-7 text-center shadow-[0_8px_32px_rgba(16,24,40,0.06)] backdrop-blur-xl md:p-9 lg:flex-row lg:text-left"
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

interface StepProps {
  step: HomeCopy['line']['steps'][number];
  index: number;
  delay: number;
  desktopEntered: boolean;
  desktop: boolean;
}

function Step({ step, index, delay, desktopEntered, desktop }: StepProps) {
  const ref = useRef<HTMLLIElement>(null);
  const selfInView = useInView(ref, { once: true, amount: 0.6 });
  // 桌機跟著整條時間軸的編排；手機每一站自己進入視窗才亮
  const shown = desktop ? desktopEntered : selfInView;
  const state = shown ? 'show' : 'hidden';

  return (
    <li ref={ref} className="group relative pl-10 lg:pl-0 lg:pt-10">
      {/* 節點：落在細線上的小圓點，光點抵達時亮起並漾出一圈 */}
      <motion.span
        variants={ripple}
        custom={delay}
        initial="hidden"
        animate={state}
        className="absolute left-0 top-0 h-[11px] w-[11px] rounded-full bg-[#06B6D4]"
        aria-hidden
      />
      <motion.span
        variants={node}
        custom={delay}
        initial="hidden"
        animate={state}
        className="absolute left-0 top-0 h-[11px] w-[11px] rounded-full border-2 border-white bg-gradient-to-br from-[#2563EB] to-[#06B6D4] shadow-[0_0_0_1px_rgba(37,99,235,0.25)] transition-shadow duration-500 group-hover:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_0_16px_4px_rgba(6,182,212,0.45)]"
        aria-hidden
      />
      <motion.div variants={rise} custom={delay + 0.05} initial="hidden" animate={state}>
        <span
          className="-mt-1.5 block font-serif text-4xl font-black leading-none lining-nums text-[#2563EB] transition-colors duration-500 group-hover:text-[#0891B2] lg:mt-0 lg:text-5xl"
          aria-hidden
        >
          {index + 1}
        </span>
        <h3 className="mt-4 text-lg font-semibold text-[#101828] lg:mt-5">{step.title}</h3>
        {step.quote && (
          <p className="cjk-punct mb-0 mt-3 font-serif text-xl font-semibold leading-snug text-[#101828] lg:text-base xl:text-xl">
            <span className="quote-underline">{step.quote}</span>
          </p>
        )}
        <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-[#475467] md:text-base">{keepRanges(step.desc)}</p>
      </motion.div>
    </li>
  );
}
