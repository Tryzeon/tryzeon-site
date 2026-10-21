'use client';

import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionStyle, type MotionValue } from 'framer-motion';

// 慢、帶一點重量：游標停下後還會再滑一小段才落定（MASTER 的 fluid motion）
const SPRING = { stiffness: 110, damping: 18, mass: 0.7 } as const;

interface TiltStageProps {
  children: ReactNode;
  /** 最大傾斜角度（度） */
  max?: number;
  /** 偵測游標的範圍；省略時以元件本身為範圍 */
  trackRef?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * TiltStage — 跟著游標轉動的 3D 舞台。
 * 子層可用 translateZ 排出前後景深（舞台本身是 preserve-3d），並透過
 * --glare-x / --glare-y 兩個 CSS 變數讓 .tilt-glare 的反光點跟著游標走。
 * 只在有滑鼠的裝置啟用；觸控裝置維持靜止、不掛監聽。
 */
export function TiltStage({ children, max = 8, trackRef, className = '' }: TiltStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, SPRING);
  const sy = useSpring(ny, SPRING);
  // 正面轉向游標：游標那一側往後退、另一側往前
  const rotateY = useTransform(sx, (v) => -v * max);
  const rotateX = useTransform(sy, (v) => v * max);
  const glareX = useTransform(sx, (v) => `${50 + v * 45}%`);
  const glareY = useTransform(sy, (v) => `${50 + v * 45}%`);
  // 反光只在舞台轉開時出現：靜止時螢幕中央不會一直壓著一塊白光
  const glareO = useTransform([sx, sy], ([x, y]: number[]) => String(Math.min(1, Math.hypot(x, y))));

  useEffect(() => {
    const target = trackRef?.current ?? ref.current;
    if (!target) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onMove = (e: PointerEvent) => {
      const r = target.getBoundingClientRect();
      nx.set(clamp(((e.clientX - r.left) / r.width) * 2 - 1));
      ny.set(clamp(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => {
      nx.set(0);
      ny.set(0);
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerleave', onLeave);
    return () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerleave', onLeave);
    };
  }, [trackRef, nx, ny]);

  // framer 會把 motion value 寫進 CSS 變數，但 MotionStyle 的型別沒列自訂屬性
  const style: MotionStyle & Record<`--${string}`, MotionValue<string>> = {
    rotateX,
    rotateY,
    transformPerspective: 1200,
    transformStyle: 'preserve-3d',
    '--glare-x': glareX,
    '--glare-y': glareY,
    '--glare-o': glareO,
  };

  return (
    <motion.div ref={ref} className={className} style={style}>
      {children}
    </motion.div>
  );
}
