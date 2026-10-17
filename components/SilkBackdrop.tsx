'use client';

import { useEffect, useRef, useState } from 'react';

interface SilkBackdropProps {
  tone?: 'pearl' | 'iris';
  /** 捲動時布面往後倒（首屏用） */
  scrollDrift?: boolean;
  className?: string;
}

/**
 * 會動的絲綢底（WebGL）。three.js 在 effect 裡才動態載入，不進首屏的 JS；
 * 載入前與不支援 WebGL 時，看到的是同色調的 CSS 漸層。
 * 指標的感應範圍是最近的 <section>（canvas 本身不接事件）。
 */
export function SilkBackdrop({ tone = 'pearl', scrollDrift = false, className = '' }: SilkBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    void import('@/lib/three/silk').then(({ mountSilk }) => {
      if (cancelled) return;
      cleanup = mountSilk(canvas, {
        tone,
        scrollDrift,
        pointerArea: canvas.closest('section'),
        onReady: () => setReady(true),
      });
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [tone, scrollDrift]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className={`absolute inset-0 ${
          tone === 'iris'
            ? 'bg-[radial-gradient(ellipse_at_70%_30%,#E7E1FB_0%,#EEF2FF_40%,#F5F5F8_75%)]'
            : 'bg-[radial-gradient(ellipse_at_70%_40%,#EEEAF8_0%,#F3F4F8_45%,#FAFAFA_80%)]'
        }`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-[1600ms] ease-out ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
