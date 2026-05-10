'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    index: 1,
    label: 'Upload',
    title: '上傳一張照片',
    desc: '從衣櫃、街拍、品牌官網——任何來源的服飾照片都可以。',
    accent: '#60A5FA',
  },
  {
    index: 2,
    label: 'AI Process',
    title: 'AI 即時試穿',
    desc: '輸入身型資料一次，後端紅綠燈技術自動套用到你的影像。',
    accent: '#06B6D4',
  },
  {
    index: 3,
    label: 'See & Share',
    title: '看見、決定、行動',
    desc: '靜態試穿、動態走秀，跨品牌混搭，當下就知道要不要買。',
    accent: '#7C3AED',
  },
];

export function ProcessScroll() {
  return (
    <>
      <ProcessMobile />
      <ProcessDesktop />
    </>
  );
}

function ProcessDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const trackEl = trackRef.current;
      if (!trackEl) return;
      const distance = trackEl.scrollWidth - window.innerWidth;

      gsap.to(trackEl, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          pinSpacing: false,
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative bg-[#0A0A0B] text-white hidden lg:block"
      style={{ height: `${STEPS.length * 100}vh` }}
      aria-label="Tryzeon usage process"
    >
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-[#0A0A0B] relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(circle,rgba(96,165,250,0.10)_0%,transparent_60%)] blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vh] bg-[radial-gradient(circle,rgba(124,58,237,0.10)_0%,transparent_60%)] blur-3xl" />
          <div className="absolute inset-0 dot-grid-dark opacity-25" />
        </div>

        <div className="absolute top-[10vh] md:top-[12vh] left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 z-10">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/40">
              <span className="block w-6 h-px bg-white/30" />
              The Process
            </span>
            <h3 className="hidden md:block text-sm font-mono uppercase tracking-[0.25em] text-white/35">
              三步完成
            </h3>
          </div>
        </div>

        <div ref={trackRef} className="relative z-20 h-full flex items-center will-change-transform">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="shrink-0 w-screen h-full flex items-center justify-center px-6 md:px-12 lg:px-20"
            >
              <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className="lg:col-span-5 relative">
                  <div
                    className="absolute -inset-10 rounded-full opacity-30 blur-3xl"
                    style={{ background: `radial-gradient(circle, ${step.accent}55 0%, transparent 70%)` }}
                    aria-hidden
                  />
                  <div className="relative aspect-[4/5] rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden flex items-center justify-center">
                    <span
                      className="font-extrabold tracking-tighter leading-none opacity-25"
                      style={{
                        fontSize: 'clamp(8rem, 20vw, 18rem)',
                        background: `linear-gradient(135deg, ${step.accent}, white)`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {String(step.index).padStart(2, '0')}
                    </span>
                    <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                      Placeholder · demo video here
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <span
                      className="block w-6 md:w-8 h-px"
                      style={{ backgroundColor: step.accent, opacity: 0.6 }}
                    />
                    <span
                      className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.35em] uppercase"
                      style={{ color: step.accent }}
                    >
                      Step {String(step.index).padStart(2, '0')} · {step.label}
                    </span>
                  </div>

                  <h2
                    className="!text-white font-extrabold tracking-[-0.04em] leading-[0.95] mb-6 md:mb-8"
                    style={{
                      fontSize: 'clamp(2.25rem, 6vw, 5rem)',
                      textShadow: '0 8px 60px rgba(0,0,0,0.4)',
                    }}
                  >
                    {step.title}
                  </h2>

                  <p className="text-base md:text-xl text-white/65 font-medium leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessMobile() {
  return (
    <section
      id="process"
      className="relative lg:hidden bg-[#0A0A0B] text-white py-20 overflow-hidden"
      aria-label="Tryzeon usage process"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[10%] left-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(96,165,250,0.16)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[10%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(124,58,237,0.14)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 dot-grid-dark opacity-25" />
      </div>

      <div className="relative z-10 px-6 max-w-md mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-3 text-[10px] font-mono font-semibold tracking-[0.4em] uppercase text-white/45 mb-4">
            <span className="block w-6 h-px bg-white/30" />
            The Process
            <span className="block w-6 h-px bg-white/30" />
          </span>
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] !text-white leading-[1.0]">
            三步完成
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden"
            >
              <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-25 blur-2xl"
                style={{ backgroundColor: step.accent }}
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="block w-5 h-px"
                    style={{ backgroundColor: step.accent, opacity: 0.7 }}
                  />
                  <span
                    className="text-[9px] font-mono font-semibold tracking-[0.3em] uppercase"
                    style={{ color: step.accent }}
                  >
                    Step {String(step.index).padStart(2, '0')} · {step.label}
                  </span>
                </div>
                <h3
                  className="!text-white font-extrabold tracking-[-0.03em] leading-[1.05] mb-3"
                  style={{ fontSize: 'clamp(1.35rem, 5.5vw, 1.75rem)' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
