'use client';

import { motion, type Variants } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { TiltStage } from '@/components/TiltStage';
import type { AppImageName } from '@/lib/app-images';
import { EASE } from '@/lib/motion';

// 三支手機的扇形姿勢：左右兩支往外轉 ∓14°、略往中間收，中間那支往前 40px
const POSES = [
  { x: '10%', rotateY: -14, z: 0 },
  { x: '0%', rotateY: 0, z: 40 },
  { x: '-10%', rotateY: 14, z: 0 },
] as const;
// 中間那支先到，兩側跟上
const DELAYS = [0.14, 0, 0.14] as const;

const phone: Variants = {
  hidden: (i: number) => ({ opacity: 0, x: POSES[i].x, rotateY: POSES[i].rotateY * 2, z: POSES[i].z - 320 }),
  show: (i: number) => ({
    opacity: 1,
    ...POSES[i],
    transition: { duration: 1.1, ease: EASE, delay: DELAYS[i] },
  }),
};

interface PhoneFanProps {
  /** 三張後台實機畫面，左 → 中 → 右 */
  names: readonly [AppImageName, AppImageName, AppImageName];
}

/**
 * 品牌後台三支手機的 3D 扇形（/business）：perspective 1200px 裡左右兩支斜轉、中間往前，
 * 整組跟著游標微傾（TiltStage，只在精準指標上）。第一次捲到時從景深飛入到位。
 * reduced motion 由 MotionConfig 略過位移，直接停在最終姿勢。
 */
export function PhoneFan({ names }: PhoneFanProps) {
  return (
    <TiltStage perspective={1200} max={5} innerClassName="flex justify-center gap-3 md:gap-4">
      {names.map((name, i) => (
        <motion.div
          key={name}
          variants={phone}
          custom={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="w-[28vw] max-w-[200px] lg:w-[168px]"
        >
          <AppScreen name={name} sizes="(min-width: 1024px) 168px, (min-width: 768px) 200px, 28vw" className="w-full" />
        </motion.div>
      ))}
    </TiltStage>
  );
}
