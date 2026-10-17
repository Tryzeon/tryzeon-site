'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], input, textarea, select, label';

/**
 * CustomCursor — awwwards-grade cursor.
 * - A trailing ring using mix-blend-mode: difference (inverts whatever it's over)
 * - A precise center dot
 * - Ring grows over interactive elements, shrinks while pressed
 * - 只在精細指標、≥1024px、未要求減少動態時啟用；游標停下、圓環追上之後就停掉 rAF。
 *   狀態全寫在 DOM 的 data 屬性上，不經 React state，移動時不會重繪元件。
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const capable = window.matchMedia('(pointer: fine) and (min-width: 1024px)');
    if (!capable.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (rx < -50) {
        rx = e.clientX;
        ry = e.clientY;
      }
      mx = e.clientX;
      my = e.clientY;
      ring.dataset.visible = dot.dataset.visible = '1';
      const target = e.target as Element | null;
      ring.dataset.pointer = target?.closest(INTERACTIVE) ? '1' : '0';
      kick();
    };
    const onDown = () => {
      ring.dataset.down = '1';
    };
    const onUp = () => {
      ring.dataset.down = '0';
    };
    const onLeave = () => {
      ring.dataset.visible = dot.dataset.visible = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      {/* Center dot — precise, brand blue */}
      <div
        ref={dotRef}
        aria-hidden
        data-visible="0"
        className="cursor-dot hidden lg:block fixed top-0 left-0 -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-[#2563EB] z-[9999] pointer-events-none"
      />
      {/* Trailing ring — inverts content via difference blend, grows on hover */}
      <div
        ref={ringRef}
        aria-hidden
        data-visible="0"
        data-pointer="0"
        data-down="0"
        style={{ mixBlendMode: 'difference' }}
        className="cursor-ring hidden lg:block fixed top-0 left-0 rounded-full z-[9999] pointer-events-none bg-white"
      />
    </>
  );
}
