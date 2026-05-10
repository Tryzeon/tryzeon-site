'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ColdOpen() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineOneRef = useRef<HTMLDivElement>(null);
  const lineTwoRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      tl.fromTo(
        lineOneRef.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -40, ease: 'power2.in', duration: 0.5 },
        0,
      );
      tl.fromTo(
        lineTwoRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 },
        0.2,
      ).to(
        lineTwoRef.current,
        { opacity: 0, y: -30, ease: 'power2.in', duration: 0.3 },
        0.7,
      );

      gsap.to(arrowRef.current, {
        y: 6,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0B] min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-label="Tryzeon cold open"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vh] bg-[radial-gradient(circle,rgba(96,165,250,0.10)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vh] bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 dot-grid-dark opacity-20" />
      </div>

      <div className="relative z-10 px-6 text-center max-w-5xl mx-auto">
        <div
          ref={lineOneRef}
          className="!text-white font-extrabold tracking-[-0.04em] leading-[0.95]"
          style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', textShadow: '0 8px 60px rgba(0,0,0,0.4)' }}
        >
          試穿，<br />
          <span className="text-white/50">重新</span>定義。
        </div>

        <div
          ref={lineTwoRef}
          className="absolute inset-0 flex items-center justify-center !text-white font-extrabold tracking-[-0.04em] leading-[0.95] px-6"
          style={{ fontSize: 'clamp(1.75rem, 5vw, 4.25rem)', opacity: 0 }}
        >
          <span>
            一張照片，
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#06B6D4] to-[#60A5FA] bg-clip-text text-transparent">
              穿上任何衣服。
            </span>
          </span>
        </div>
      </div>

      <div
        ref={arrowRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase">Scroll</span>
        <span className="text-xl">↓</span>
      </div>
    </section>
  );
}
