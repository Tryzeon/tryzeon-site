'use client';

import { useRef, type PointerEvent } from 'react';

/**
 * 頁尾的巨大字標：佔滿整個螢幕寬度，游標經過的地方被薰衣草色的光照亮
 * （取自 logo 的薰衣草；藍青色票的例外，負責人指定）。
 * --mx/--my 是游標相對字標的座標；觸控裝置沒有 hover，停在預設位置的柔光。
 * 純裝飾（aria-hidden），公司名稱在頁尾上方已經有文字版。
 */
export function FooterWordmark() {
  const ref = useRef<HTMLParagraphElement>(null);
  const raf = useRef(0);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const { clientX, clientY } = e;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(clientX - r.left).toFixed(0)}px`);
      el.style.setProperty('--my', `${(clientY - r.top).toFixed(0)}px`);
    });
  };

  return (
    <div className="relative select-none overflow-hidden px-4" onPointerMove={onPointerMove} aria-hidden>
      <p
        ref={ref}
        className="mb-0 bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,40%),rgba(214,204,255,0.85),transparent_55%),linear-gradient(180deg,rgba(241,240,247,0.16),rgba(241,240,247,0.02)_85%)] bg-clip-text text-center font-serif text-[24vw] font-black leading-[0.82] tracking-[-0.04em] text-transparent"
      >
        Tryzeon
      </p>
    </div>
  );
}
