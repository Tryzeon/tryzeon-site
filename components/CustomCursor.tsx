'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor — awwwards-grade cursor.
 * - A trailing ring using mix-blend-mode: difference (inverts whatever it's over)
 * - A precise center dot
 * - Ring grows + fills when over interactive elements
 * - Hides on touch / when leaving the window
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (hidden) setHidden(false);
      const target = e.target as HTMLElement | null;
      setIsPointer(
        !!target?.closest('a, button, [role="button"], input, textarea, select, label'),
      );
    };
    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);
    const onLeave = () => setHidden(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [hidden]);

  return (
    <>
      {/* Center dot — precise, brand blue */}
      <div
        ref={dotRef}
        aria-hidden
        className={`hidden lg:block fixed top-0 left-0 -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-[#2563EB] z-[9999] pointer-events-none transition-opacity duration-300 ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {/* Trailing ring — inverts content via difference blend, grows on hover */}
      <div
        ref={ringRef}
        aria-hidden
        style={{ mixBlendMode: 'difference' }}
        className={`hidden lg:block fixed top-0 left-0 rounded-full z-[9999] pointer-events-none bg-white transition-[width,height,margin,opacity,background-color] duration-300 ease-out ${
          hidden ? 'opacity-0' : 'opacity-100'
        } ${
          isPointer
            ? 'w-16 h-16 -ml-8 -mt-8'
            : isDown
              ? 'w-6 h-6 -ml-3 -mt-3'
              : 'w-9 h-9 -ml-[18px] -mt-[18px]'
        }`}
      />
    </>
  );
}
