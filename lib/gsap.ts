import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// SmoothScrollProvider 也會註冊；重複註冊無害，元件 import 這裡就不必在意掛載順序
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * gsap.matchMedia 的條件鍵。matchMedia 只在「至少一個條件成立」時才呼叫 callback，
 * 所以每次都要帶上永遠成立的 any，callback 裡再看 desktop / reduce 分支。
 */
export const MEDIA = {
  any: 'all',
  desktop: '(min-width: 1024px)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

export { gsap, ScrollTrigger };
