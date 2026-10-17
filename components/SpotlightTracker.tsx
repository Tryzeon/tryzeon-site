'use client';

import { useEffect } from 'react';

const SELECTOR = '.glass-panel, [data-spotlight]';

/**
 * 全站一個 pointermove：把游標在卡片內的位置寫進 --mx / --my，
 * 讓 .glass-panel（與標了 data-spotlight 的元素）的珠光跟著游標走。只在滑鼠裝置上跑。
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;
    const flush = () => {
      raf = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${x - rect.left}px`);
      el.style.setProperty('--my', `${y - rect.top}px`);
      pending = null;
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(SELECTOR);
      if (!el) return;
      pending = { el, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return null;
}
