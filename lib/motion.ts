import type { Variants } from 'framer-motion';

// MASTER.md 的 ease-out，與 globals.css 的 --ease-out-expo 同一條曲線
export const EASE = [0.16, 1, 0.3, 1] as const;

// 捲到才進場、只播一次。reduced motion 交給 SmoothScrollProvider 的 MotionConfig
// 統一降級；這裡不分支，否則 SSR(null) 與 client(true) 的 initial 不同會 hydration mismatch
export const inView = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.15 },
} as const;

// 清單容器：子項依序錯開進場
export const staggerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// 清單子項／單一區塊：淡入上移
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// 跟著游標的 3D 傾斜（hero 舞台、TiltCard）共用的 spring
export const TILT_SPRING = { stiffness: 120, damping: 18, mass: 0.4 } as const;

// 光束掃描（ScanReveal）用的曲線：頭尾稍緩、中段等速，光束與清晰層同一條，才會對齊
export const SCAN_EASE = [0.45, 0, 0.25, 1] as const;

// 只在能 hover 的精準指標裝置上啟用游標互動（觸控、(hover:none) 不傾斜）
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
