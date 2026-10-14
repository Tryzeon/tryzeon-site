'use client';

import { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { clauseWrap } from '@/components/clauseWrap';
import { EASE } from '@/lib/motion';

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: d },
  }),
};

interface SectionHeaderProps {
  /** 主標題 — 宋體 editorial。可含 <span> 做藍青漸層強調 */
  title: ReactNode;
  /** 副文案（可選） */
  lede?: ReactNode;
  align?: 'center' | 'left';
  /** 與下方內容的間距 */
  spacing?: string;
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
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`${isCenter ? 'text-center' : 'text-left'} ${spacing}`}>
      <motion.h2
        variants={item}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        custom={0.12}
        className={`cjk-punct text-balance font-serif font-black tracking-[-0.01em] leading-[1.12] text-[#101828] ${
          isCenter ? 'mx-auto' : ''
        } max-w-[22ch]`}
        style={{ fontSize: 'clamp(2.125rem, 1.4rem + 2.8vw, 3.9rem)' }}
      >
        {clauseWrap(title)}
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
