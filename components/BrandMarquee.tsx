'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

type Variant = 'solid' | 'outline' | 'gradient';

interface MarqueeRowProps {
  children: string;
  baseVelocity: number;
  variant?: Variant;
  delay?: number;
}

function MarqueeRow({
  children,
  baseVelocity,
  variant = 'solid',
  delay = 0,
}: MarqueeRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef<number>(1);
  const hasStarted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasStarted.current = true;
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useAnimationFrame((_, delta) => {
    if (!hasStarted.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const variantClass = (() => {
    if (variant === 'outline') {
      return 'text-transparent [-webkit-text-stroke:1.5px_#101828]';
    }
    if (variant === 'gradient') {
      return 'bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#2563EB]';
    }
    return 'text-[#101828]';
  })();

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        className="flex whitespace-nowrap gap-12 md:gap-20 flex-nowrap"
        style={{ x }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`block text-[14vw] md:text-[11vw] font-extrabold tracking-[-0.05em] leading-[0.95] uppercase ${variantClass}`}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function BrandMarquee() {
  return (
    <div className="relative space-y-1 md:space-y-2 py-2 md:py-4">
      <MarqueeRow baseVelocity={-2.5} variant="solid">
        Digital Fashion Evolution
      </MarqueeRow>
      <MarqueeRow baseVelocity={2} variant="outline">
        Try-On × AI × Fashion
      </MarqueeRow>
      <MarqueeRow baseVelocity={-1.5} variant="gradient">
        即時試穿 × 全通路 × 時尚基礎建設
      </MarqueeRow>
    </div>
  );
}
