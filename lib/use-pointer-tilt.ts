import { useEffect, type RefObject } from 'react';

interface PointerTiltOptions {
  /** 最大旋轉角度（度） */
  max?: number;
  /** 'window'：以視窗中心計算（首屏舞台）；'element'：以元素中心、半徑至少 400px */
  relativeTo?: 'window' | 'element';
}

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

/**
 * 依游標位置在元素上寫入 CSS 變數：
 * --tilt-x / --tilt-y（度，給 rotateX / rotateY）、--light-x / --light-y（0–1，給打光位置）。
 * 只在精細指標、≥1024px、未要求減少動態、元素在視窗內時啟用；
 * 數值收斂後就停掉 rAF，不在背景空轉。不寫 React state，不會重繪元件。
 */
export function usePointerTilt(ref: RefObject<HTMLElement | null>, { max = 4, relativeTo = 'window' }: PointerTiltOptions = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const capable = window.matchMedia('(pointer: fine) and (min-width: 1024px)');
    if (!capable.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let inView = false;

    const write = () => {
      el.style.setProperty('--tilt-x', `${(-y * max).toFixed(3)}deg`);
      el.style.setProperty('--tilt-y', `${(x * max).toFixed(3)}deg`);
      el.style.setProperty('--light-x', ((x + 1) / 2).toFixed(3));
      el.style.setProperty('--light-y', ((y + 1) / 2).toFixed(3));
    };

    const step = () => {
      x += (tx - x) * 0.075;
      y += (ty - y) * 0.075;
      write();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (!inView) return;
      if (relativeTo === 'element') {
        const r = el.getBoundingClientRect();
        tx = clamp((e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 400));
        ty = clamp((e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 400));
      } else {
        tx = clamp((e.clientX / window.innerWidth) * 2 - 1);
        ty = clamp((e.clientY / window.innerHeight) * 2 - 1);
      }
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) onLeave();
    });
    observer.observe(el);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, max, relativeTo]);
}
