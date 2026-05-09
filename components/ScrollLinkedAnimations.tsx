'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

function useInViewOnce(rootMargin: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, isVisible] as const;
}

interface ParallaxTextProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxText({ children, className = '' }: ParallaxTextProps) {
  const [ref, isVisible] = useInViewOnce('-80px 0px -80px 0px');

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translate3d(0, 30px, 0) scale(0.95)',
        transition:
          'opacity 0.9s cubic-bezier(0, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

interface ScrollZoomCardProps {
  children: ReactNode;
  className?: string;
}

export function ScrollZoomCard({ children, className = '' }: ScrollZoomCardProps) {
  const [ref, isVisible] = useInViewOnce('-40px 0px -40px 0px');

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translate3d(0, 35px, 0) scale(0.94)',
        transition:
          'opacity 0.8s cubic-bezier(0, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

interface Scroll3DProps {
  children: ReactNode;
  className?: string;
}

export function Scroll3D({ children, className = '' }: Scroll3DProps) {
  const [ref, isVisible] = useInViewOnce('-40px 0px -40px 0px');

  return (
    <div
      ref={ref}
      className={className}
      style={{
        perspective: '1200px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translate3d(0, 25px, 0) rotateX(8deg)',
        transition:
          'opacity 0.8s cubic-bezier(0, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
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
  const [isInView, setIsInView] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-100px 0px -100px 0px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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
