'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { keepRanges } from '@/components/clauseWrap';
import { LINE_OA_QR_SRC } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { fadeUpItem, inView, staggerList } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LineFlowProps {
  copy: HomeCopy['line'];
}

/**
 * LINE 試穿流程：純文字時間軸（尚無實機截圖，不放圖、不畫模擬聊天介面）。
 * 時間軸跟著捲動前進：一道光沿細線走（ScrollTrigger scrub，進度寫在 --p），
 * 光走到哪一站就點亮那一站的節點與數字。偏好減少動態時整條直接亮起。
 * 不用 framer useScroll（與 Lenis 衝突，見 CLAUDE.md）。
 */
export function LineFlow({ copy }: LineFlowProps) {
  const listRef = useRef<HTMLOListElement>(null);
  // 已經點亮到第幾站（-1：還沒開始）
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const last = copy.steps.length - 1;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      list.style.setProperty('--p', '1');
      setReached(last);
    });

    // 桌機橫向：節點等距，第 i 站落在進度 i / last
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        list,
        { '--p': 0 },
        {
          '--p': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.6,
            onUpdate: (self) => setReached(Math.floor(self.progress * last + 0.02) - (self.progress === 0 ? 1 : 0)),
          },
        },
      );
    });

    // 手機直向：各站高度不一，用每一站相對清單頂端的位置判斷
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const items = Array.from(list.children).filter((el): el is HTMLLIElement => el.tagName === 'LI');
      gsap.fromTo(
        list,
        { '--p': 0 },
        {
          '--p': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 0.6,
            onUpdate: (self) => {
              const head = self.progress * list.offsetHeight;
              setReached(self.progress === 0 ? -1 : items.filter((li) => li.offsetTop <= head + 4).length - 1);
            },
          },
        },
      );
    });

    return () => mm.revert();
  }, [copy.steps.length]);

  return (
    <section id="line" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />
        <motion.ol
          ref={listRef}
          variants={staggerList}
          {...inView}
          className="relative mx-auto grid max-w-md gap-12 [--p:0] sm:max-w-xl lg:max-w-none lg:grid-cols-5 lg:gap-8"
        >
          {/* 時間軸細線——手機：左側直線；桌機：橫向，貫穿五個節點。上面疊一條隨捲動前進的光 */}
          <span className="pointer-events-none absolute bottom-2 left-[5px] top-2 w-px lg:hidden" aria-hidden>
            <span className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/20 to-[#06B6D4]/20" />
            <span className="absolute -left-px inset-y-0 w-[3px] origin-top scale-y-[var(--p)] rounded-full bg-gradient-to-b from-[#2563EB] to-[#06B6D4]" />
            <span className="flow-head absolute left-1/2 top-[calc(var(--p)*100%)]" />
          </span>
          <span
            className="pointer-events-none absolute left-0 right-[calc((100%_-_8rem)/5_-_11px)] top-[5px] hidden h-px lg:block"
            aria-hidden
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#06B6D4]/20" />
            <span className="absolute inset-x-0 -top-px h-[3px] origin-left scale-x-[var(--p)] rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />
            <span className="flow-head absolute left-[calc(var(--p)*100%)] top-1/2" />
          </span>
          {copy.steps.map((item, i) => {
            const lit = i <= reached;
            return (
              <motion.li key={item.title} variants={fadeUpItem} className="relative pl-10 lg:pl-0 lg:pt-10">
                {/* 節點：落在細線上的小圓點；光走到這一站時亮起 */}
                <span
                  className={`absolute left-0 top-0 h-[11px] w-[11px] rounded-full border-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    lit
                      ? 'scale-125 border-white bg-gradient-to-br from-[#2563EB] to-[#06B6D4] shadow-[0_0_0_4px_rgba(6,182,212,0.15),0_0_16px_rgba(37,99,235,0.45)]'
                      : 'border-[#2563EB]/30 bg-white shadow-none'
                  }`}
                  aria-hidden
                />
                <span
                  className={`-mt-1.5 block font-serif text-4xl font-black leading-none lining-nums transition-colors duration-700 lg:mt-0 lg:text-5xl ${
                    lit ? 'text-[#2563EB]' : 'text-[#2563EB]/20'
                  }`}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#101828] lg:mt-5">{item.title}</h3>
                {item.quote && (
                  <p className="cjk-punct mb-0 mt-3 font-serif text-xl font-semibold leading-snug text-[#101828] lg:text-base xl:text-xl">
                    {item.quote}
                  </p>
                )}
                <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-[#475467] md:text-base">{keepRanges(item.desc)}</p>
              </motion.li>
            );
          })}
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
