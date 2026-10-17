'use client';

import { useEffect } from 'react';

/**
 * 全站一個 pointermove 監聽：游標下最近的 .spotlight 或 [data-spot] 元素
 * 拿到 --mx/--my（相對自身的座標），CSS 用它畫聚光（globals.css 的 .spotlight）。
 * server component 頁面的卡片也能用，不必各自掛 hook。觸控裝置不啟用。
 */
export function PointerFx() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      raf = 0;
      if (!last) return;
      const target = last.target instanceof Element ? last.target : null;
      const el = target?.closest<HTMLElement>('.spotlight, [data-spot]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(last.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty('--my', `${(last.clientY - r.top).toFixed(0)}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
