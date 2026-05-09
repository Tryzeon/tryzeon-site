'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover'>('default');
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let rafId = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const update = () => {
      ringPos.x = lerp(ringPos.x, target.x, 0.22);
      ringPos.y = lerp(ringPos.y, target.y, 0.22);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.closest('a') ||
        t.closest('button') ||
        t.closest('[role="button"]') ||
        t.tagName.toLowerCase() === 'input' ||
        t.tagName.toLowerCase() === 'textarea'
      ) {
        setCursorVariant('hover');
      } else {
        setCursorVariant('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const isHover = cursorVariant === 'hover';

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border pointer-events-none z-[9999] hidden lg:block"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          backgroundColor: isHover ? 'white' : 'transparent',
          borderColor: isHover ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
          mixBlendMode: isHover ? 'difference' : 'normal',
          scale: isHover ? '1.5' : '1',
          transition:
            'background-color 0.2s ease, border-color 0.2s ease, scale 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] hidden lg:block mix-blend-difference"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          opacity: isHover ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      />
    </>
  );
}
