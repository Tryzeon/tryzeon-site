'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { EASE, inView, staggerList } from '@/lib/motion';

const LINE_S = 1.2;
const STEPS = 3;

const draw: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: LINE_S, ease: EASE, delay: 0.1 } },
};

// 線畫到哪一站，那一站的圓點就亮起
const dot: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE, delay: 0.1 + (LINE_S * i) / (STEPS - 1) * 0.8 },
  }),
};

// 三欄各自的中心（gap 1rem × 2）：第一欄、中間、最後一欄
const DOT_LEFT = ['left-[calc((100%-2rem)/6)]', 'left-1/2', 'left-[calc(100%-(100%-2rem)/6)]'] as const;

interface StepsTrackProps {
  /** 三個 RevealItem（<li>） */
  children: ReactNode;
  className?: string;
}

/**
 * 導入三步驟（/business）：桌機三張卡上方一條細線把三站串起，捲到時由左往右畫出
 * （framer pathLength），畫到哪一站圓點就亮起；卡片依序立起。手機版只有卡片直排。
 * 線與圓點是裝飾（aria-hidden），順序由 <ol> 表達。
 */
export function StepsTrack({ children, className = '' }: StepsTrackProps) {
  return (
    <motion.div {...inView} variants={{ hidden: {}, show: {} }} className={`relative md:pt-12 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-3 md:block" aria-hidden>
        <div className="absolute left-[calc((100%-2rem)/6)] right-[calc((100%-2rem)/6)] top-1/2 h-px -translate-y-1/2">
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 1" preserveAspectRatio="none">
            <defs>
              <linearGradient id="steps-track" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <path d="M0 0.5 H100" stroke="#101828" strokeOpacity="0.08" strokeWidth="1.5" />
            <motion.path
              d="M0 0.5 H100"
              stroke="url(#steps-track)"
              strokeWidth="1.5"
             
              variants={draw}
            />
          </svg>
        </div>
        {DOT_LEFT.map((left, i) => (
          <motion.span
            key={left}
            variants={dot}
            custom={i}
            className={`absolute top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] shadow-[0_0_14px_rgba(37,99,235,0.45)] ring-4 ring-[#FAFAFA] ${left}`}
          />
        ))}
      </div>
      <motion.ol variants={staggerList} className="grid gap-4 md:grid-cols-3">
        {children}
      </motion.ol>
    </motion.div>
  );
}
