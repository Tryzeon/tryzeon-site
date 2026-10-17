'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { EASE, inView } from '@/lib/motion';

const reveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(12px)' },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

interface BlurRevealProps {
  children: ReactNode;
  className?: string;
  /** 進場延遲（秒） */
  delay?: number;
}

/**
 * 整段文字的 blur 揭露（blur 12px → 0、y 24 → 0），捲到才播一次。
 * 不拆字：整段是一個區塊，內文的 keepRanges 等斷行控制原樣保留。
 * reduced motion 由 SmoothScrollProvider 的 MotionConfig 降成只淡入。
 */
export function BlurReveal({ children, className = '', delay = 0 }: BlurRevealProps) {
  return (
    <motion.p {...inView} variants={reveal} custom={delay} className={className}>
      {children}
    </motion.p>
  );
}
