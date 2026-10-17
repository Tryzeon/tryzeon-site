'use client';

import { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { clauseWrap, keepRanges, splitClauses } from '@/components/clauseWrap';
import { EASE } from '@/lib/motion';

const heading: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// 每個子句從遮罩下方升起（帶一點旋轉，像紙頁翻上來）
const clause: Variants = {
  hidden: { y: '115%', rotate: 3, opacity: 0 },
  show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

const ledeVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: EASE, delay: 0.3 } },
};

interface SectionHeaderProps {
  /** 主標題 — 宋體 editorial。字串會在中文子句後切開，逐段從遮罩升起 */
  title: ReactNode;
  /** 副文案（可選） */
  lede?: ReactNode;
  align?: 'center' | 'left';
  /** 與下方內容的間距 */
  spacing?: string;
}

/**
 * SectionHeader — 全站唯一的 section 標題 pattern。
 * 宋體大標（子句逐段從遮罩下升起）+ lede（由模糊到清晰）。
 * 子句是 inline-block，窄螢幕只會在「，」處換行。
 */
export function SectionHeader({ title, lede, align = 'center', spacing = 'mb-14 md:mb-20' }: SectionHeaderProps) {
  const isCenter = align === 'center';
  const parts = typeof title === 'string' ? splitClauses(title) : null;

  return (
    <div className={`${isCenter ? 'text-center' : 'text-left'} ${spacing}`}>
      <motion.h2
        variants={heading}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className={`cjk-punct text-balance font-serif font-black leading-[1.12] tracking-[-0.01em] text-[#101828] ${
          isCenter ? 'mx-auto' : ''
        } max-w-[22ch]`}
        style={{ fontSize: 'clamp(2.125rem, 1.4rem + 2.8vw, 3.9rem)' }}
      >
        {parts
          ? parts.map((part, i) => (
              <span key={i} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <motion.span variants={clause} className="inline-block origin-bottom-left">
                  {keepRanges(part)}
                </motion.span>
              </span>
            ))
          : clauseWrap(title)}
      </motion.h2>

      {lede && (
        <motion.p
          variants={ledeVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className={`mt-6 max-w-2xl text-balance font-medium leading-relaxed text-[#475467] ${isCenter ? 'mx-auto' : ''}`}
          style={{ fontSize: 'clamp(1rem, 1.35vw, 1.3rem)' }}
        >
          {clauseWrap(lede)}
        </motion.p>
      )}
    </div>
  );
}
