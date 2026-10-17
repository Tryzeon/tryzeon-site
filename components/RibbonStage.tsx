'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';

interface RibbonStageProps {
  /** 區塊內的捲動進度（0..1），由父層在捲動時更新 */
  progressRef?: MutableRefObject<number>;
  className?: string;
}

/** 標誌緞帶的 3D 版（WebGL）。與 SilkBackdrop 一樣延遲載入 three.js，canvas 不接事件 */
export function RibbonStage({ progressRef, className = '' }: RibbonStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    void import('@/lib/three/ribbon').then(({ mountRibbon }) => {
      if (cancelled) return;
      cleanup = mountRibbon(canvas, {
        progress: progressRef ? () => progressRef.current : undefined,
        pointerArea: canvas.closest('section'),
        onReady: () => setReady(true),
      });
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [progressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none transition-[opacity,transform] duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        ready ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      } ${className}`}
    />
  );
}
