'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { FINE_POINTER_QUERY, TILT_SPRING } from '@/lib/motion';

interface TiltCardProps {
  children: ReactNode;
  /** 套在會傾斜的卡片本體上（例：glass-panel p-8）。本體已帶 relative + h-full */
  className?: string;
  /** 套在外層 perspective 容器上（grid span、寬度等版位 class 放這裡） */
  wrapperClassName?: string;
  /** 最大傾斜角度（度），預設 8 */
  max?: number;
  /** 是否疊一層跟著游標走的高光，預設 true */
  glare?: boolean;
  /** 外層容器的標籤（清單裡用 li） */
  as?: 'div' | 'li' | 'article' | 'section';
}

/**
 * TiltCard — 游標在卡片上移動時，卡片依位置做 spring 3D 傾斜，並有一層高光跟著游標。
 * 只在 (hover: hover) and (pointer: fine) 的滑鼠上啟用；觸控與 prefers-reduced-motion 不傾斜、不出高光。
 * 外層是 [perspective:1000px] 的 `as` 元素，內層是傾斜的卡片本體。
 */
export function TiltCard({
  children,
  className = '',
  wrapperClassName = '',
  max = 8,
  glare = true,
  as: Tag = 'div',
}: TiltCardProps) {
  const reduced = useReducedMotion();
  const active = useRef(false);

  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), transparent 55%)`;

  const handleEnter = (e: PointerEvent<HTMLDivElement>) => {
    active.current = e.pointerType === 'mouse' && !reduced && window.matchMedia(FINE_POINTER_QUERY).matches;
  };

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!active.current) {
      handleEnter(e);
      if (!active.current) return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
    glareOpacity.set(1);
  };

  const handleLeave = () => {
    active.current = false;
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <Tag className={`[perspective:1000px] ${wrapperClassName}`}>
      <motion.div
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY }}
        className={`relative h-full ${className}`}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </Tag>
  );
}
