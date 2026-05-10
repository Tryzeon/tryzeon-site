'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LINES = [
  '時尚的未來，',
  '不是一個更聰明的試衣間，',
  '而是一座連接',
  '線上、線下、衣櫃與品牌的',
  '基礎建設。',
];

export function VisionManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          pinSpacing: false,
          scrub: 1,
        },
      });

      tl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 0.4 },
        { scale: 1.1, opacity: 0.7, ease: 'none', duration: 1 },
        0,
      );

      const lineSegment = 0.85 / LINES.length;
      LINES.forEach((_, i) => {
        const start = i * lineSegment;
        const lineEl = lineRefs.current[i];
        if (lineEl) {
          tl.fromTo(
            lineEl,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: lineSegment * 0.7 },
            start,
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0B] text-white"
      style={{ height: '200vh' }}
      aria-label="Tryzeon vision manifesto"
    >
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-[#0A0A0B] relative flex items-center justify-center">
        <div ref={bgRef} className="absolute inset-0 pointer-events-none" aria-hidden style={{ opacity: 0.4 }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(96,165,250,0.20)_0%,transparent_60%)] blur-3xl" />
          <div className="absolute top-[10%] right-[-15%] w-[55vw] h-[55vh] bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_60%)] blur-3xl" />
          <div className="absolute bottom-[10%] left-[-15%] w-[55vw] h-[55vh] bg-[radial-gradient(circle,rgba(244,114,182,0.12)_0%,transparent_60%)] blur-3xl" />
          <div className="absolute inset-0 dot-grid-dark opacity-20" />
        </div>

        <div className="absolute top-[10vh] md:top-[12vh] left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 z-10">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/40">
              <span className="block w-6 h-px bg-white/30" />
              The Vision
            </span>
            <h3 className="hidden md:block text-sm font-mono uppercase tracking-[0.25em] text-white/35">
              Fashion Infrastructure
            </h3>
          </div>
        </div>

        <div className="relative z-10 px-6 md:px-12 lg:px-20 text-center max-w-5xl mx-auto">
          {LINES.map((line, i) => (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="!text-white font-extrabold tracking-[-0.04em] leading-[1.05] will-change-transform"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 4.25rem)',
                opacity: 0,
                textShadow: '0 8px 60px rgba(0,0,0,0.5)',
              }}
            >
              {i === 4 ? (
                <span className="bg-gradient-to-r from-[#60A5FA] via-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">
                  {line}
                </span>
              ) : (
                line
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
