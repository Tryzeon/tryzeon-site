'use client';

import { useEffect, type RefObject } from 'react';

interface TiltOptions {
  /** 靜止時的角度（deg） */
  rx?: number;
  ry?: number;
  /** 游標從畫面中央移到邊緣時，額外轉多少度 */
  ampX?: number;
  ampY?: number;
}

/**
 * 讓元素跟著游標在 3D 空間裡微微轉向：寫入 --rx / --ry，CSS 用 transform 讀。
 * 只在可見、精準指標（滑鼠）且沒有偏好減少動態時跑。
 */
export function usePointerTilt(ref: RefObject<HTMLElement | null>, { rx = 2, ry = -8, ampX = 14, ampY = 9 }: TiltOptions = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      x += (tx - x) * 0.05;
      y += (ty - y) * 0.05;
      el.style.setProperty('--ry', `${(ry + x * ampX).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(rx - y * ampY).toFixed(2)}deg`);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [ref, rx, ry, ampX, ampY]);
}
