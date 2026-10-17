'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';
import { FINE_POINTER_QUERY, TILT_SPRING } from '@/lib/motion';

interface TiltStageProps {
  children: ReactNode;
  /** 外層 perspective 容器的 class（版位、寬度） */
  className?: string;
  /** 景深距離，預設 1400px（Tailwind 要看到完整字串，所以用列舉） */
  perspective?: 1200 | 1400;
  /** 會傾斜的內層（preserve-3d）的 class */
  innerClassName?: string;
  /** 最大傾斜角度（度），預設 7 */
  max?: number;
}

/**
 * TiltStage — 3D 舞台：內層跟著游標做 spring rotateX/rotateY（同首頁 hero 的手法）。
 * 游標位置以舞台中心為原點、以半個視窗寬高正規化，所以游標在舞台附近移動就會傾斜，
 * 不必真的停在物件上。只在 (hover: hover) and (pointer: fine) 且非 reduced motion 時啟用；
 * 視窗外或停用時回正。內層是 preserve-3d，子元素可以用 translateZ 做景深。
 */
const PERSPECTIVE = { 1200: '[perspective:1200px]', 1400: '[perspective:1400px]' } as const;

export function TiltStage({ children, className = '', innerClassName = '', max = 7, perspective = 1400 }: TiltStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(`${FINE_POINTER_QUERY} and (prefers-reduced-motion: no-preference)`);
    let visible = false;

    const reset = () => {
      rotateX.set(0);
      rotateY.set(0);
    };
    const onMove = (e: PointerEvent) => {
      if (!visible || !mq.matches || e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      rotateY.set(Math.max(-1, Math.min(1, px)) * max);
      rotateX.set(-Math.max(-1, Math.min(1, py)) * max);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) reset();
    });
    const onMq = () => {
      if (!mq.matches) reset();
    };

    io.observe(el);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    mq.addEventListener('change', onMq);
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', reset);
      mq.removeEventListener('change', onMq);
    };
  }, [max, rotateX, rotateY]);

  return (
    <div ref={ref} className={`${PERSPECTIVE[perspective]} ${className}`}>
      <motion.div style={{ rotateX, rotateY }} className={`relative [transform-style:preserve-3d] ${innerClassName}`}>
        {children}
      </motion.div>
    </div>
  );
}
