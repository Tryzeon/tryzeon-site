'use client';

import { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { clauseWrap } from '@/components/clauseWrap';
import { EASE } from '@/lib/motion';

// 對焦進場：由模糊到清晰、同時上移，像鏡頭拉焦
const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(14px)' },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE, delay: d },
  }),
};

interface SectionHeaderProps {
  /** 主標題 — 宋體 editorial */
  title: ReactNode;
  /** 副文案（可選） */
  lede?: ReactNode;
  align?: 'center' | 'left';
  /** 與下方內容的間距 */
  spacing?: string;
}

/**
 * SectionHeader — 全站唯一的 section 標題 pattern。
 * 宋體大標(serif) + lede，字級/間距/進場動畫鎖死，讓每個 section 開頭長得像同一本雜誌的章節頁。
 */
export function SectionHeader({ title, lede, align = 'center', spacing = 'mb-14 md:mb-20' }: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`${isCenter ? 'text-center' : 'text-left'} ${spacing}`}>
      <motion.h2
        variants={item}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        custom={0.05}
        className={`cjk-punct text-balance font-serif font-black leading-[1.12] tracking-[-0.01em] text-pearl ${
          isCenter ? 'mx-auto' : ''
        } max-w-[22ch]`}
        style={{ fontSize: 'clamp(2.25rem, 1.3rem + 3.2vw, 4.4rem)' }}
      >
        {clauseWrap(title)}
      </motion.h2>

      {lede && (
        <motion.p
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.2}
          className={`mb-0 mt-6 max-w-2xl text-balance font-medium leading-relaxed text-haze ${isCenter ? 'mx-auto' : ''}`}
          style={{ fontSize: 'clamp(1rem, 1.35vw, 1.25rem)' }}
        >
          {clauseWrap(lede)}
        </motion.p>
      )}
    </div>
  );
}
