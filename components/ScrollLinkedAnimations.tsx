'use client';

import { useRef, ReactNode, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const easeDecelerate = [0, 0, 0.2, 1] as const;
const easeEmphasized = [0.4, 0, 0.2, 1] as const;

interface ParallaxTextProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxText({ children, className = '' }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 30 }}
      transition={{
        duration: 0.9,
        ease: easeDecelerate,
        scale: { duration: 1.0, ease: easeEmphasized },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollZoomCardProps {
  children: ReactNode;
  className?: string;
}

export function ScrollZoomCard({ children, className = '' }: ScrollZoomCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, y: 35 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 35 }}
      transition={{
        duration: 0.8,
        ease: easeDecelerate,
        scale: { duration: 0.9, ease: easeEmphasized },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface Scroll3DProps {
  children: ReactNode;
  className?: string;
}

export function Scroll3D({ children, className = '' }: Scroll3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 25, rotateX: 8 }}
      transition={{
        duration: 0.8,
        ease: easeDecelerate,
        rotateX: { duration: 0.9, ease: easeEmphasized },
      }}
      style={{ transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  decimals?: number;
  separator?: boolean;
}

export function ScrollCounter({
  target,
  suffix = '',
  prefix = '',
  className = '',
  duration = 2000,
  decimals = 0,
  separator = false,
}: ScrollCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayValue, setDisplayValue] = useState(0);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    if (!separator) return fixed;
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    let raf = 0;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      const value = target * eased;
      setDisplayValue(decimals > 0 ? value : Math.round(value));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
}
