'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  { label: 'Capture', title: '一張實體照片', desc: '從衣架、櫥窗、街拍——任何來源開始。', accent: '#60A5FA' },
  { label: 'Dissolve', title: '即時拆解為數位', desc: '材質、剪裁、版型，AI 全部識別。', accent: '#7C3AED' },
  { label: 'Recompose', title: '重組成你的可能', desc: '套上你的身型、你的場合、你的下一套穿搭。', accent: '#F472B6' },
];

export function WireframeMagic() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visualRefs = useRef<(SVGElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      const segment = 1 / STAGES.length;
      STAGES.forEach((_, i) => {
        const start = i * segment;
        const end = (i + 1) * segment;
        const fadeIn = start + segment * 0.1;
        const fadeOut = end - segment * 0.1;

        const stageEl = stageRefs.current[i];
        if (stageEl) {
          tl.fromTo(
            stageEl,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: fadeIn - start },
            start,
          ).to(
            stageEl,
            { opacity: 0, y: -60, ease: 'power2.in', duration: end - fadeOut },
            fadeOut,
          );
        }

        const visualEl = visualRefs.current[i];
        if (visualEl) {
          tl.fromTo(
            visualEl,
            { opacity: 0, scale: 0.85, rotate: -8 },
            { opacity: 1, scale: 1, rotate: 0, ease: 'power3.out', duration: fadeIn - start + 0.05 },
            start,
          ).to(
            visualEl,
            { opacity: 0, scale: 1.1, rotate: 8, ease: 'power2.in', duration: end - fadeOut },
            fadeOut,
          );
        }

        const labelEl = labelRefs.current[i];
        if (labelEl) {
          tl.fromTo(
            labelEl,
            { opacity: 0 },
            { opacity: 1, ease: 'none', duration: fadeIn - start },
            start,
          ).to(
            labelEl,
            { opacity: 0, ease: 'none', duration: end - fadeOut },
            fadeOut,
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="magic"
      className="relative bg-[#0A0A0B] text-white"
      style={{ height: `${STAGES.length * 100}vh` }}
      aria-label="Tryzeon AI magic transition"
    >
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-[#0A0A0B] relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(124,58,237,0.10)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute inset-0 dot-grid-dark opacity-20" />
        </div>

        <div className="absolute top-[10vh] md:top-[12vh] left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 z-10">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/40">
              <span className="block w-6 h-px bg-white/30" />
              The Magic
            </span>
            <h3 className="hidden md:block text-sm font-mono uppercase tracking-[0.25em] text-white/35">
              實體 → 數位 → 重組
            </h3>
          </div>
        </div>

        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="w-full max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative aspect-square max-w-xl mx-auto w-full">
              {STAGES.map((s, i) => (
                <svg
                  key={s.title}
                  ref={(el) => {
                    visualRefs.current[i] = el;
                  }}
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full"
                  style={{ opacity: 0 }}
                  aria-hidden
                >
                  {i === 0 && (
                    <>
                      <defs>
                        <radialGradient id="g0" cx="50%" cy="50%">
                          <stop offset="0%" stopColor={s.accent} stopOpacity="0.6" />
                          <stop offset="100%" stopColor={s.accent} stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="200" cy="200" r="160" fill="url(#g0)" />
                      <circle cx="200" cy="200" r="120" fill="none" stroke={s.accent} strokeWidth="1" opacity="0.4" />
                      <circle cx="200" cy="200" r="80" fill="none" stroke={s.accent} strokeWidth="1" opacity="0.2" />
                    </>
                  )}
                  {i === 1 && (
                    <g stroke={s.accent} strokeWidth="0.8" fill="none" opacity="0.7">
                      {Array.from({ length: 12 }).map((_, r) => (
                        <line
                          key={`h${r}`}
                          x1="60"
                          y1={80 + r * 24}
                          x2="340"
                          y2={80 + r * 24}
                          opacity={0.3 + (r % 3) * 0.2}
                        />
                      ))}
                      {Array.from({ length: 12 }).map((_, c) => (
                        <line
                          key={`v${c}`}
                          x1={60 + c * 24}
                          y1="80"
                          x2={60 + c * 24}
                          y2="320"
                          opacity={0.3 + (c % 3) * 0.2}
                        />
                      ))}
                      <circle cx="200" cy="200" r="100" fill="none" strokeWidth="1.5" opacity="1" />
                    </g>
                  )}
                  {i === 2 && (
                    <>
                      <defs>
                        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={s.accent} stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 200 60 Q 280 60 320 140 Q 360 220 320 300 Q 280 360 200 360 Q 120 360 80 300 Q 40 220 80 140 Q 120 60 200 60 Z"
                        fill="url(#g2)"
                        opacity="0.6"
                      />
                      <path
                        d="M 200 60 Q 280 60 320 140 Q 360 220 320 300 Q 280 360 200 360 Q 120 360 80 300 Q 40 220 80 140 Q 120 60 200 60 Z"
                        fill="none"
                        stroke={s.accent}
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                    </>
                  )}
                </svg>
              ))}
            </div>

            <div className="lg:col-span-6 relative">
              {STAGES.map((s, i) => (
                <div
                  key={s.title}
                  ref={(el) => {
                    stageRefs.current[i] = el;
                  }}
                  className="absolute inset-0 lg:relative will-change-transform"
                  style={{ opacity: 0, transform: 'translate3d(0, 60px, 0)' }}
                >
                  <div
                    ref={(el) => {
                      labelRefs.current[i] = el;
                    }}
                    className="flex items-center gap-3 mb-6 md:mb-8"
                    style={{ opacity: 0 }}
                  >
                    <span
                      className="block w-6 md:w-8 h-px"
                      style={{ backgroundColor: s.accent, opacity: 0.6 }}
                    />
                    <span
                      className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.35em] uppercase"
                      style={{ color: s.accent }}
                    >
                      {String(i + 1).padStart(2, '0')} / 03 · {s.label}
                    </span>
                  </div>

                  <h2
                    className="!text-white font-extrabold tracking-[-0.04em] leading-[0.95] mb-6 md:mb-8"
                    style={{
                      fontSize: 'clamp(2.25rem, 6vw, 5rem)',
                      textShadow: '0 8px 60px rgba(0,0,0,0.4)',
                    }}
                  >
                    {s.title}
                  </h2>

                  <p className="text-base md:text-xl text-white/65 font-medium leading-relaxed max-w-xl">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-6 md:bottom-8 inset-x-0 px-6 md:px-12 lg:px-20 z-30 pointer-events-none"
          aria-hidden
        >
          <div className="max-w-[1500px] mx-auto">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 text-center">
              Placeholder visualisation. Production replaces with 30-frame image sequence canvas painter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
