'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface TiltStageProps {
  children: ReactNode;
  className?: string;
  /** 內層（.tilt-body）的 class；子層用 translateZ 排出前後深度 */
  bodyClassName?: string;
}

/**
 * 3D 傾斜舞台：指標在最近的 <section> 裡移動時，整組內容朝游標傾斜（rAF 緩動），
 * 離開時回正。只在滑鼠裝置、且沒有開減少動態時作用；觸控裝置維持平面。
 */
export function TiltStage({ children, className = '', bodyClassName = '' }: TiltStageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const area = stage.closest('section') ?? stage;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      stage.style.setProperty('--tilt-x', x.toFixed(4));
      stage.style.setProperty('--tilt-y', y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    area.addEventListener('pointermove', onMove as EventListener);
    area.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener('pointermove', onMove as EventListener);
      area.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt-stage ${className}`}>
      <div className={`tilt-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}
