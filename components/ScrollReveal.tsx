'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

const easeDecelerate = [0, 0, 0.2, 1] as const;
const easeStandard = [0.25, 0.1, 0.25, 1.0] as const;

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const distance = 40;

  const variants: Variants = (() => {
    switch (direction) {
      case 'down':
        return { hidden: { y: -distance, opacity: 0 }, visible: { y: 0, opacity: 1 } };
      case 'left':
        return { hidden: { x: -distance, opacity: 0 }, visible: { x: 0, opacity: 1 } };
      case 'right':
        return { hidden: { x: distance, opacity: 0 }, visible: { x: 0, opacity: 1 } };
      case 'fade':
        return { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } };
      case 'up':
      default:
        return { hidden: { y: distance, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    }
  })();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: easeDecelerate,
        opacity: { duration: duration * 0.8, ease: easeStandard },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
