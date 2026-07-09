'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: d },
  }),
};

interface SectionHeaderProps {
  /** Mono kicker, e.g. "Omnichannel" / "N°03 — Features" */
  kicker: string;
  /** 主標題 — 宋體 editorial。可含 <span> 做藍青漸層強調 */
  title: ReactNode;
  /** 副文案（可選） */
  lede?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

/**
 * SectionHeader — 全站唯一的 section 標題 pattern。
 * kicker(mono) + 宋體大標(serif) + lede，字級/間距/進場動畫鎖死，
 * 讓每個 section 開頭長得像同一本雜誌的章節頁。
 */
export function SectionHeader({
  kicker,
  title,
  lede,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const reduced = useReducedMotion();
  const isCenter = align === 'center';

  return (
    <div
      className={`${isCenter ? 'text-center' : 'text-left'} mb-14 md:mb-20 ${className}`}
    >
      <motion.span
        variants={item}
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        custom={0}
        className={`inline-flex items-center gap-3 font-mono text-[10px] md:text-[11px] font-semibold tracking-[0.4em] uppercase text-[#475467] mb-6`}
      >
        {isCenter && <span className="block w-6 h-px bg-[#101828]/30" />}
        {!isCenter && <span className="block w-8 h-px bg-[#101828]/40" />}
        {kicker}
        {isCenter && <span className="block w-6 h-px bg-[#101828]/30" />}
      </motion.span>

      <motion.h2
        variants={item}
        initial={reduced ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        custom={0.12}
        className={`font-serif font-black tracking-[-0.02em] leading-[1.12] text-[#101828] ${
          isCenter ? 'mx-auto' : ''
        } max-w-[22ch]`}
        style={{ fontSize: 'clamp(2rem, 4.6vw, 3.9rem)' }}
      >
        {title}
      </motion.h2>

      {lede && (
        <motion.p
          variants={item}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          custom={0.24}
          className={`mt-6 text-[#475467] font-medium leading-relaxed max-w-2xl text-balance ${
            isCenter ? 'mx-auto' : ''
          }`}
          style={{ fontSize: 'clamp(1rem, 1.35vw, 1.3rem)' }}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
