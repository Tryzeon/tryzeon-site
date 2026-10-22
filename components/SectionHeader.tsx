'use client';

import { Fragment, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { motion, type Variants } from 'framer-motion';
import { clauseWrap, gapBefore, keepRanges, splitClauses } from '@/components/clauseWrap';
import { gsap } from '@/lib/gsap';
import { EASE } from '@/lib/motion';

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: d },
  }),
};

// sheen 標題：每個子句從自己的遮罩下緣升起，依序錯開
const titleList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};
const clauseRise: Variants = {
  hidden: { y: '108%' },
  show: { y: '0%', transition: { duration: 1.05, ease: EASE } },
};

interface SectionHeaderProps {
  /** 主標題 — 宋體 editorial。可含 <span> 做藍青漸層強調 */
  title: ReactNode;
  /** 副文案（可選） */
  lede?: ReactNode;
  align?: 'center' | 'left';
  /** 與下方內容的間距 */
  spacing?: string;
  /**
   * 字串標題逐子句從遮罩升起，再有一道藍青光帶穿過字面（桌機隨捲動、手機進場掃一次）；
   * 字本身始終是可讀的深色。首頁 AI 引擎那一句用
   */
  sheen?: boolean;
}

/**
 * SectionHeader — 全站唯一的 section 標題 pattern。
 * 宋體大標(serif) + lede，字級/間距/進場動畫鎖死，
 * 讓每個 section 開頭長得像同一本雜誌的章節頁。
 */
export function SectionHeader({
  title,
  lede,
  align = 'center',
  spacing = 'mb-14 md:mb-20',
  sheen = false,
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  const headingRef = useRef<HTMLHeadingElement>(null);
  const clauses = sheen && typeof title === 'string' ? splitClauses(title) : null;

  useSheen(headingRef, clauses !== null);

  return (
    <div className={`${isCenter ? 'text-center' : 'text-left'} ${spacing}`}>
      <motion.h2
        ref={headingRef}
        variants={clauses ? titleList : item}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        custom={0.12}
        className={`relative cjk-punct text-balance font-serif font-black tracking-[-0.01em] leading-[1.12] text-[#101828] ${
          isCenter ? 'mx-auto' : ''
        } max-w-[22ch]`}
        style={{ fontSize: 'clamp(2.125rem, 1.4rem + 2.8vw, 3.9rem)' }}
      >
        {clauses
          ? clauses.map((clause, i) => (
              <Fragment key={i}>
                {gapBefore(clauses, i)}
                <span className="clause-mask">
                  <motion.span variants={clauseRise} className="sheen-text inline-block">
                    {keepRanges(clause)}
                  </motion.span>
                </span>
              </Fragment>
            ))
          : clauseWrap(title)}
      </motion.h2>

      {lede && (
        <motion.p
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.24}
          className={`mt-6 text-[#475467] font-medium leading-relaxed max-w-2xl text-balance ${
            isCenter ? 'mx-auto' : ''
          }`}
          style={{ fontSize: 'clamp(1rem, 1.35vw, 1.3rem)' }}
        >
          {clauseWrap(lede)}
        </motion.p>
      )}
    </div>
  );
}

/**
 * 光帶：每個子句是自己的 background-clip:text 盒子，背景寬度等於整個標題、
 * 位置扣掉子句自己的 offsetLeft，所以光帶是一道連續的光穿過所有子句。
 * --sheen 是光帶中心在標題寬度上的位置（%）。
 */
function useSheen(ref: RefObject<HTMLHeadingElement | null>, enabled: boolean) {
  useEffect(() => {
    const heading = ref.current;
    if (!enabled || !heading) return;
    const spans = Array.from(heading.querySelectorAll<HTMLElement>('.sheen-text'));
    const measure = () => {
      heading.style.setProperty('--sheen-w', `${heading.offsetWidth}px`);
      spans.forEach((span) => {
        const parent = span.parentElement as HTMLElement;
        span.style.setProperty('--sheen-x', `${parent.offsetLeft}px`);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(heading);

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.fromTo(
        heading,
        { '--sheen': '-30%' },
        {
          '--sheen': '130%',
          ease: 'none',
          scrollTrigger: { trigger: heading, start: 'top 85%', end: 'bottom 20%', scrub: 0.6 },
        },
      );
    });
    mm.add('(max-width: 1023px)', () => {
      gsap.fromTo(
        heading,
        { '--sheen': '-30%' },
        { '--sheen': '130%', duration: 2.2, ease: 'power2.inOut', delay: 0.5, scrollTrigger: { trigger: heading, start: 'top 80%', once: true } },
      );
    });
    return () => {
      observer.disconnect();
      mm.revert();
    };
  }, [ref, enabled]);
}
