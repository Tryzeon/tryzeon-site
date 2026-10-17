'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { SCAN_EASE } from '@/lib/motion';

interface ScanRevealProps {
  /** 畫面內容（例：<AppScreen framed={false} />），會被放進兩個絕對定位、填滿父層的圖層 */
  children: ReactNode;
  /** 變成 true 時播放一次掃描；預設 true（掛上就播） */
  play?: boolean;
  /** 光束由頂掃到底的秒數，預設 1.4 */
  duration?: number;
  /** play 之後再等幾秒開始，預設 0 */
  delay?: number;
  /** 掃描完成（或 reduced motion 直接顯示）時呼叫一次 */
  onDone?: () => void;
}

const sharp: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)' },
};

const beam: Variants = {
  hidden: { y: '0%', opacity: 0 },
  show: { y: '100%', opacity: [0, 1, 1, 0] },
};

/**
 * ScanReveal — 全站的「掃描顯影」簽名動作。
 *
 * 父層需是 relative 且有尺寸（例：PhoneFrame 的螢幕區）。內容疊兩層：下層是
 * `blur(14px) saturate(.4) brightness(1.08)` 的半成品，上層是清晰圖，以
 * `clip-path: inset(0 0 X% 0)` 跟著一道 2px 的藍-青光束由上往下推進。
 * 掃完後模糊層與光束卸載，只留清晰的 children（同一個 DOM 節點，圖片不會重載）。
 * prefers-reduced-motion：直接顯示清晰圖並立即呼叫 onDone。
 *
 * 只用在「結果第一次出現」的地方（hero 主手機、Experience 換畫面、/download hero）。
 * 要重播就換 key 重新掛載。
 */
export function ScanReveal({ children, play = true, duration = 1.4, delay = 0, onDone }: ScanRevealProps) {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    onDoneRef.current?.();
  };

  // reduced motion 只能在 client 判斷：SSR 一律先輸出未掃描狀態，掛上後再直接跳到完成
  useEffect(() => {
    if (reduced && play) finish();
  }, [reduced, play]);

  const transition = { duration, delay, ease: SCAN_EASE };
  const state = play ? 'show' : 'hidden';

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 光束之下：尚未顯影的半成品。條件式留在同一個位置，清晰層的節點才不會因為卸載而重掛 */}
      {!done && (
        <div
          aria-hidden
          className="absolute inset-0 scale-[1.06] [filter:blur(14px)_saturate(0.4)_brightness(1.08)]"
        >
          {children}
        </div>
      )}

      <motion.div
        className="absolute inset-0"
        variants={sharp}
        initial="hidden"
        animate={done ? 'show' : state}
        transition={done ? { duration: 0 } : transition}
        onAnimationComplete={(definition) => {
          if (definition === 'show') finish();
        }}
      >
        {children}
      </motion.div>

      {/* 光束：整層 inset-0 往下推 100%，光束本身貼在這層的頂端 */}
      {!done && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          variants={beam}
          initial="hidden"
          animate={state}
          transition={{ ...transition, opacity: { duration, delay, times: [0, 0.08, 0.9, 1] } }}
        >
          <div className="absolute inset-x-0 top-0 h-6 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,#60A5FA,#06B6D4,transparent)] opacity-60 blur-[6px]" />
          <div className="absolute inset-x-0 top-0 h-[2px] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,#60A5FA,#06B6D4,transparent)]" />
        </motion.div>
      )}
    </div>
  );
}
