'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// SSR 時 useLayoutEffect 會警告；server 上本來就什麼都不做
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });

    lenis.on('scroll', () => ScrollTrigger.update());
    lenisRef.current = lenis;

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // 換頁時 Next 會把頁面捲回頂端（或捲到 #hash），但 Lenis 若還在滾輪慣性中，
  // 下一個 frame 會把捲動拉回舊位置，新頁面就停在半途。在同一次 commit 裡
  // （Next 的捲動在子層先跑完）停掉動畫、改採實際位置，再重新量測新頁面高度。
  // 不用 scrollTo(scrollY, { immediate })：Lenis 還記著舊頁面的高度會把目標夾到
  // 舊頁底部，而目標等於現值時它直接 return、動畫不會停。
  useIsomorphicLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.stop();
    lenis.start();
    lenis.resize();
  }, [pathname]);

  // reducedMotion="user"：偏好減少動態的使用者，所有 framer 進場只留 opacity、
  // 去掉 transform——不必逐一在每個 fadeUp 補 useReducedMotion
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
