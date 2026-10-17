'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { keepRanges } from '@/components/clauseWrap';
import { LINE_OA_QR_SRC } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { fadeUpItem, inView } from '@/lib/motion';

interface LineFlowProps {
  copy: HomeCopy['line'];
}

/**
 * LINE 試穿流程：捲動驅動的時間軸（不畫模擬聊天介面）。
 * 桌機（夠高的視窗）整個場景用 CSS sticky 釘住，往下捲時光軌往右填滿，
 * 五個步驟依序點亮——數字由空心變成珠光實心，引言逐字浮現。
 * 窄螢幕不釘住：直向時間軸跟著視窗中線點亮。偏好減少動態時全部直接點亮。
 */
export function LineFlow({ copy }: LineFlowProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [lit, setLit] = useState(1);
  const total = copy.steps.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    if (!wrap || !list) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.style.setProperty('--p', '1');
      setLit(total);
      return;
    }
    const pinned = window.matchMedia('(min-width: 1024px) and (min-height: 680px)');
    let raf = 0;
    const update = () => {
      raf = 0;
      let p: number;
      if (pinned.matches) {
        const rect = wrap.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        p = travel > 0 ? -rect.top / travel : 1;
      } else {
        const rect = list.getBoundingClientRect();
        p = (window.innerHeight * 0.6 - rect.top) / rect.height;
      }
      p = Math.max(0, Math.min(1, p));
      wrap.style.setProperty('--p', p.toFixed(4));
      setLit(Math.min(total, Math.floor(p * (total + 0.4)) + 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    pinned.addEventListener('change', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      pinned.removeEventListener('change', onScroll);
    };
  }, [total]);

  return (
    <section id="line" className="relative bg-[#FAFAFA]">
      <div ref={wrapRef} className="pin-wrap">
        <div className="pin-stage py-24 md:py-36">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
            <SectionHeader title={copy.title} lede={copy.lede} spacing="mb-14 md:mb-16 xl:mb-20" />

            <ol ref={listRef} className="relative mx-auto grid max-w-md gap-12 sm:max-w-xl lg:max-w-none lg:grid-cols-5 lg:gap-6">
              {/* 光軌：底線＋隨捲動填滿的珠光線。手機直向、桌機橫向 */}
              <span className="pointer-events-none absolute bottom-2 left-[5px] top-2 w-px bg-[#101828]/10 lg:hidden" aria-hidden>
                <span className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-[#7C6AE6] to-[#22D3EE] [transform:scaleY(var(--p,0))]" />
              </span>
              <span
                className="pointer-events-none absolute left-[5px] right-[calc((100%_-_6rem)/5_-_11px)] top-[5px] hidden h-px bg-[#101828]/10 lg:block"
                aria-hidden
              >
                <span className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-[#7C6AE6] via-[#60A5FA] to-[#22D3EE] [transform:scaleX(min(1,calc(var(--p,0)*1.12)))]" />
              </span>

              {copy.steps.map((item, i) => {
                const on = i < lit;
                const current = i === lit - 1;
                return (
                  <li key={item.title} className="relative pl-10 lg:pl-0 lg:pt-10">
                    {/* 節點：點亮時變成珠光實心並擴散一圈 */}
                    <span className="absolute left-0 top-0 h-[11px] w-[11px]" aria-hidden>
                      <span
                        className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
                          on
                            ? 'border-white bg-gradient-to-br from-[#7C6AE6] to-[#22D3EE] shadow-[0_0_0_1px_rgba(124,106,230,0.35)]'
                            : 'border-[#101828]/15 bg-[#FAFAFA]'
                        }`}
                      />
                      {current && <span className="absolute -inset-2 animate-ping rounded-full bg-[#7C6AE6]/25" />}
                    </span>

                    <span className="relative -mt-1.5 block font-serif text-6xl font-black leading-none lining-nums lg:mt-0 lg:text-7xl xl:text-8xl" aria-hidden>
                      <span className="text-outline">{i + 1}</span>
                      <span className={`text-iris absolute left-0 top-0 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}>
                        {i + 1}
                      </span>
                    </span>

                    <h3 className={`mt-4 text-lg font-semibold transition-colors duration-500 lg:mt-6 ${on ? 'text-[#101828]' : 'text-[#475467]'}`}>
                      {item.title}
                    </h3>
                    {item.quote && (
                      <p className="cjk-punct mb-0 mt-3 font-serif text-xl font-semibold leading-snug text-[#101828] lg:text-lg xl:text-xl">
                        <span className="sr-only">{item.quote}</span>
                        <span aria-hidden>
                        {Array.from(item.quote).map((ch, k) => (
                          <span
                            key={k}
                            className={`inline-block transition-[opacity,transform,filter] duration-500 ${
                              on ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-1 opacity-20 blur-[2px]'
                            }`}
                            style={{ transitionDelay: on ? `${k * 45}ms` : '0ms' }}
                          >
                            {ch}
                          </span>
                        ))}
                        </span>
                      </p>
                    )}
                    <p
                      className={`mb-0 mt-2 text-balance text-sm leading-relaxed transition-colors duration-500 md:text-base ${
                        on ? 'text-[#475467]' : 'text-[#667085]'
                      }`}
                    >
                      {keepRanges(item.desc)}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 md:pb-36">
        {/* 親自試試：加入 Tryzeon 的 LINE 官方帳號走一遍流程；桌機附 QR Code（電腦上點連結無法加好友） */}
        <motion.div
          variants={fadeUpItem}
          {...inView}
          className="glass-panel mx-auto flex max-w-2xl flex-col items-center gap-6 p-7 text-center md:p-9 lg:flex-row lg:text-left"
        >
          <figure className="hidden shrink-0 rounded-2xl bg-white p-2 shadow-[0_8px_24px_-8px_rgba(16,24,40,0.15)] lg:block">
            <Image src={LINE_OA_QR_SRC} width={112} height={112} alt={copy.tryIt.qrAlt} unoptimized />
            <figcaption className="mt-2 text-center text-xs text-[#475467]">{copy.tryIt.qrCaption}</figcaption>
          </figure>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#101828] md:text-xl">{copy.tryIt.title}</h3>
            <p className="mb-0 mt-2 text-balance text-sm leading-relaxed text-[#475467] md:text-base">{copy.tryIt.desc}</p>
            <a href={siteCopy.contact.lineOa.url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 gap-2 text-base">
              {copy.tryIt.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </motion.div>

        {/* 從 /business 的導入步驟點過來的人，看完流程一鍵回到方案 */}
        <div className="mt-10 text-center md:mt-12">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
