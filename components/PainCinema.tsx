'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PainItem {
  index: number;
  label: string;
  title: string;
  bullets: string[];
  accent: string;
}

const PAINS: PainItem[] = [
  {
    index: 1,
    label: 'Consumer',
    title: '告別憑空想像的試穿',
    bullets: [
      '線下排隊試、線上看圖猜、衣櫃滿了百種組合搭不完——每一步都在靠腦海中想像的畫面。',
      '你需要的，是在快時尚的時代下 即時看見上身的能力。',
    ],
    accent: '#60A5FA',
  },
  {
    index: 2,
    label: 'Brands',
    title: '中小型品牌經營痛點',
    bullets: [
      '缺乏資源製作高品質展示內容。',
      '銷量不佳且缺乏試穿功能。',
      '多數 AI 工具導入門檻高、建模成本大，中小品牌無資源開發。',
    ],
    accent: '#06B6D4',
  },
  {
    index: 3,
    label: 'Daily Styling',
    title: '日常穿搭困擾',
    bullets: [
      '選擇穿搭耗時，缺乏場合風格信心，反覆試穿影響生活效率。',
      '無即時 AI 推薦與個人化建議，穿搭決策仍靠人工經驗。',
    ],
    accent: '#7C3AED',
  },
  {
    index: 4,
    label: 'Market Gap',
    title: '市場結構缺乏整合',
    bullets: [
      '市面 AI 試穿多聚焦技術，多為「工具」形式，未能落地商業應用與實際整合。',
      '亞洲市場雖潛力龐大，但缺乏領導品牌與統一平台整合供需。',
    ],
    accent: '#F472B6',
  },
];

export function PainCinema() {
  return (
    <>
      <PainMobile />
      <PainDesktop />
    </>
  );
}

function PainDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${PAINS.length * 100}%`,
          pin: pinRef.current,
          scrub: 1,
        },
      });

      const segment = 1 / PAINS.length;
      PAINS.forEach((_, i) => {
        const start = i * segment;
        const end = (i + 1) * segment;
        const fadeIn = start + segment * 0.08;
        const peakStart = start + segment * 0.18;
        const peakEnd = start + segment * 0.78;
        const fadeOut = end - segment * 0.08;

        const sceneEl = sceneRefs.current[i];
        if (sceneEl) {
          tl.fromTo(
            sceneEl,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: peakStart - start },
            start,
          ).to(
            sceneEl,
            { opacity: 0, y: -60, ease: 'power2.in', duration: end - peakEnd },
            peakEnd,
          );
        }

        const bgEl = bgRefs.current[i];
        if (bgEl) {
          tl.fromTo(
            bgEl,
            { opacity: 0 },
            { opacity: 1, ease: 'none', duration: fadeIn - start },
            start,
          ).to(
            bgEl,
            { opacity: 0, ease: 'none', duration: end - fadeOut },
            fadeOut,
          );
        }

        const progressEl = progressRefs.current[i];
        if (progressEl) {
          tl.fromTo(
            progressEl,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', duration: segment },
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
      id="pain"
      className="relative bg-[#0A0A0B] text-white hidden lg:block"
      aria-label="Tryzeon market pain points"
    >
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-[#0A0A0B] relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {PAINS.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                bgRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: 0 }}
            >
              <div
                className="absolute -top-[10%] left-[-15%] w-[70vw] h-[70vh] blur-3xl"
                style={{ background: `radial-gradient(circle, ${p.accent}33 0%, transparent 60%)` }}
              />
              <div
                className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vh] blur-3xl"
                style={{ background: `radial-gradient(circle, ${p.accent}22 0%, transparent 60%)` }}
              />
            </div>
          ))}
          <div className="absolute inset-0 dot-grid-dark opacity-30" />
        </div>

        <div className="absolute top-[10vh] md:top-[12vh] left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 z-10">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/40">
              <span className="block w-6 h-px bg-white/30" />
              The Pain
            </span>
            <h3 className="hidden md:block text-sm font-mono uppercase tracking-[0.25em] text-white/35">
              四大市場痛點
            </h3>
          </div>
        </div>

        <div className="relative z-20 h-full">
          {PAINS.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                sceneRefs.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 will-change-transform"
              style={{ opacity: 0, transform: 'translate3d(0, 60px, 0)' }}
            >
              <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-6 md:mb-10">
                    <span
                      className="block w-6 md:w-8 h-px"
                      style={{ backgroundColor: p.accent, opacity: 0.6 }}
                    />
                    <span
                      className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.35em] uppercase"
                      style={{ color: p.accent }}
                    >
                      {String(p.index).padStart(2, '0')} / 04 · {p.label}
                    </span>
                  </div>

                  <h2
                    className="!text-white font-extrabold tracking-[-0.04em] leading-[0.95] mb-8 md:mb-12"
                    style={{
                      fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
                      textShadow: '0 8px 60px rgba(0,0,0,0.4)',
                    }}
                  >
                    {p.title}
                  </h2>

                  <ul className="space-y-4 md:space-y-5 max-w-2xl">
                    {p.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-4">
                        <span
                          className="shrink-0 mt-3 w-2 h-2 rounded-full"
                          style={{ backgroundColor: p.accent }}
                        />
                        <span className="text-base md:text-lg lg:text-xl text-white/65 font-medium leading-relaxed">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
                  <div className="relative w-full aspect-square max-w-md">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${p.accent}1f 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                      }}
                    />
                    <div
                      className="absolute inset-[15%] rounded-full border opacity-20"
                      style={{ borderColor: p.accent }}
                    />
                    <div
                      className="absolute inset-[30%] rounded-full border opacity-15"
                      style={{ borderColor: p.accent }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-extrabold tracking-tighter leading-none"
                        style={{
                          fontSize: 'clamp(6rem, 14vw, 12rem)',
                          background: `linear-gradient(135deg, ${p.accent}, white)`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          opacity: 0.3,
                        }}
                      >
                        {String(p.index).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="absolute bottom-0 inset-x-0 px-6 md:px-12 lg:px-20 pb-6 md:pb-8 z-30 pointer-events-none"
          aria-hidden
        >
          <div className="max-w-[1500px] mx-auto flex items-center gap-2 md:gap-3">
            {PAINS.map((p, i) => (
              <div
                key={p.title}
                className="flex-1 h-px relative overflow-hidden bg-white/[0.08]"
              >
                <div
                  ref={(el) => {
                    progressRefs.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left"
                  style={{ backgroundColor: p.accent, transform: 'scaleX(0)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PainMobile() {
  return (
    <section
      id="pain"
      className="relative lg:hidden bg-[#0A0A0B] text-white py-20 overflow-hidden"
      aria-label="Tryzeon market pain points"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[5%] left-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(96,165,250,0.16)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[10%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(124,58,237,0.14)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 dot-grid-dark opacity-25" />
      </div>

      <div className="relative z-10 px-6 max-w-md mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-3 text-[10px] font-mono font-semibold tracking-[0.4em] uppercase text-white/45 mb-4">
            <span className="block w-6 h-px bg-white/30" />
            The Pain
            <span className="block w-6 h-px bg-white/30" />
          </span>
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] !text-white leading-[1.0]">
            四大市場痛點
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {PAINS.map((p) => (
            <div
              key={p.title}
              className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden"
            >
              <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-25 blur-2xl"
                style={{ backgroundColor: p.accent }}
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="block w-5 h-px"
                    style={{ backgroundColor: p.accent, opacity: 0.7 }}
                  />
                  <span
                    className="text-[9px] font-mono font-semibold tracking-[0.3em] uppercase"
                    style={{ color: p.accent }}
                  >
                    {String(p.index).padStart(2, '0')} · {p.label}
                  </span>
                </div>

                <h3
                  className="!text-white font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
                  style={{ fontSize: 'clamp(1.35rem, 5.5vw, 1.75rem)' }}
                >
                  {p.title}
                </h3>

                <ul className="space-y-3">
                  {p.bullets.map((b, bi) => (
                    <li key={bi} className="flex gap-3">
                      <span
                        className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: p.accent }}
                      />
                      <span className="text-sm text-white/60 leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
