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
        <div className="absolute top-[10%] left-[5%] w-[55vw] h-[55vh] bg-[radial-gradient(circle,rgba(96,165,250,0.18)_0%,transparent_60%)] blur-3xl animate-mesh-float" />
        <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vh] bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_60%)] blur-3xl animate-mesh-float [animation-delay:5s]" />
        <div className="absolute top-[40%] right-[20%] w-[40vw] h-[40vh] bg-[radial-gradient(circle,rgba(244,114,182,0.10)_0%,transparent_60%)] blur-3xl animate-mesh-float [animation-delay:10s]" />
        <div className="absolute inset-0 dot-grid-dark opacity-25" />
      </div>

      <div className="absolute top-[14vh] md:top-[16vh] left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 z-10">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/40">
            <span className="block w-6 h-px bg-white/30" />
            Tryzeon · 2026
          </span>
          <h3 className="hidden md:block text-sm font-mono uppercase tracking-[0.25em] text-white/35">
            Try-on, redefined.
          </h3>
        </div>
      </div>

      <div className="relative z-10 px-6 text-center max-w-6xl mx-auto">
        <div
          ref={lineOneRef}
          className="!text-white font-extrabold tracking-[-0.05em] leading-[0.85]"
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 11rem)',
            textShadow: '0 8px 80px rgba(0,0,0,0.5)',
          }}
        >
          試穿，<br />
          <span className="bg-gradient-to-r from-white via-white/60 to-white/30 bg-clip-text text-transparent">
            重新定義。
          </span>
        </div>

        <div
          ref={lineTwoRef}
          className="absolute inset-0 flex items-center justify-center !text-white font-extrabold tracking-[-0.05em] leading-[0.9] px-6"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)', opacity: 0 }}
        >
          <span>
            一張照片，<br />
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">
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
