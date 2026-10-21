import type { Variants } from 'framer-motion';

// MASTER.md 的 ease-out，與 globals.css 的 --ease-out-expo 同一條曲線
export const EASE = [0.16, 1, 0.3, 1] as const;

// 捲到才進場、只播一次
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
