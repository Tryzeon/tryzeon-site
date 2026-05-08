'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Video, Shirt, TrendingUp, Store } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeatureItem {
  index: number;
  total: number;
  icon: typeof Sparkles;
  kicker: string;
  title: string;
  desc: string;
  accent: string;
  metric?: { value: string; label: string };
}

const FEATURES: FeatureItem[] = [
  {
    index: 1,
    total: 5,
    icon: Sparkles,
    kicker: 'Virtual Try-On',
    title: 'AI 時尚虛擬試穿',
    desc: '一張照片即可虛擬試穿任何服飾。AI 精準辨識身形與姿勢，讓消費者在購買前看見每一種搭配的可能。',
    accent: '#60A5FA',
    metric: { value: '< 3秒', label: '生成速度' },
  },
  {
    index: 2,
    total: 5,
    icon: Video,
    kicker: 'Dynamic Video',
    title: 'AI 虛擬試穿影片',
    desc: '靜態照片秒變動態走秀影片。讓你以第三人稱看見自己穿著服飾走動、旋轉的真實樣貌。',
    accent: '#06B6D4',
    metric: { value: '10秒', label: '影片長度' },
  },
  {
    index: 3,
    total: 5,
    icon: Shirt,
    kicker: 'Smart Wardrobe',
    title: '個人雲端衣櫃 & AI 推薦',
    desc: '數位化管理你的衣物。AI 根據 5W1H 推薦穿搭，缺合適服飾時自動引導試穿合作品牌商品。',
    accent: '#7C3AED',
    metric: { value: '5W1H', label: '推薦邏輯' },
  },
  {
    index: 4,
    total: 5,
    icon: TrendingUp,
    kicker: 'Trend Analytics',
    title: '時尚趨勢數據分析',
    desc: '從試穿與互動數據洞察消費者偏好。協助品牌精準進貨、降低庫存風險、優化行銷投放。',
    accent: '#FBBF24',
    metric: { value: '即時', label: '趨勢追蹤' },
  },
  {
    index: 5,
    total: 5,
    icon: Store,
    kicker: 'Try-On Room',
    title: '虛擬試衣間',
    desc: '合作品牌將服飾上架到試衣間。消費者跨品牌組搭試穿，發現新風格、創造交叉銷售機會。',
    accent: '#F472B6',
    metric: { value: '跨品牌', label: '組合可能' },
  },
];

export function FeaturesCinema() {
  return (
    <>
      <FeaturesMobile />
      <FeaturesDesktop />
    </>
  );
}

function FeaturesDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgSliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      const segment = 1 / FEATURES.length;
      FEATURES.forEach((_, i) => {
        const start = i * segment;
        const end = (i + 1) * segment;
        const fadeIn = start + segment * 0.05;
        const peakStart = start + segment * 0.18;
        const peakEnd = start + segment * 0.78;
        const fadeOut = end - segment * 0.05;

        const sceneEl = sceneRefs.current[i];
        if (sceneEl) {
          tl.fromTo(
            sceneEl,
            { opacity: 0, y: 80 },
            { opacity: 0.5, ease: 'none', duration: fadeIn - start },
            start,
          )
            .to(
              sceneEl,
              { opacity: 1, y: 0, ease: 'power2.out', duration: peakStart - fadeIn },
              fadeIn,
            )
            .to(
              sceneEl,
              { opacity: 0.5, y: -80, ease: 'power2.in', duration: fadeOut - peakEnd },
              peakEnd,
            )
            .to(
              sceneEl,
              { opacity: 0, ease: 'none', duration: end - fadeOut },
              fadeOut,
            );
        }

        const bgEl = bgSliceRefs.current[i];
        if (bgEl) {
          const bgFadeIn = start + segment * 0.2;
          const bgFadeOut = end - segment * 0.2;
          tl.fromTo(
            bgEl,
            { opacity: 0 },
            { opacity: 1, ease: 'none', duration: bgFadeIn - start },
            start,
          ).to(
            bgEl,
            { opacity: 0, ease: 'none', duration: end - bgFadeOut },
            bgFadeOut,
          );
        }

        const fillEl = progressFillRefs.current[i];
        if (fillEl) {
          tl.fromTo(
            fillEl,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', duration: segment },
            start,
          );
        }

        const containerEl = progressContainerRefs.current[i];
        if (containerEl) {
          tl.fromTo(
            containerEl,
            { opacity: 0.2 },
            { opacity: 1, ease: 'none', duration: 0.05 },
            Math.max(0, start - 0.05),
          ).to(
            containerEl,
            { opacity: 0.2, ease: 'none', duration: 0.05 },
            end,
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-[#0A0A0B] text-white hidden lg:block"
      style={{ height: `${FEATURES.length * 90}vh` }}
      aria-label="Tryzeon core features"
    >
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-[#0A0A0B] relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => {
                bgSliceRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: 0 }}
            >
              <div
                className="absolute -top-[10%] left-[-15%] w-[70vw] h-[70vh] blur-3xl"
                style={{ background: `radial-gradient(circle, ${f.accent}30 0%, transparent 60%)` }}
              />
              <div
                className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vh] blur-3xl"
                style={{ background: `radial-gradient(circle, ${f.accent}20 0%, transparent 60%)` }}
              />
            </div>
          ))}
          <div className="absolute inset-0 dot-grid-dark opacity-30" />
        </div>

        <div className="absolute top-[10vh] md:top-[12vh] left-6 md:left-12 lg:left-20 z-10 max-w-[1500px] mx-auto right-6 md:right-12 lg:right-20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/40">
              <span className="block w-6 h-px bg-white/30" />
              Core Infrastructure
            </span>
            <h3 className="hidden md:block text-sm font-mono uppercase tracking-[0.25em] text-white/35">
              五大核心技術
            </h3>
          </div>
        </div>

        <div className="relative z-20 h-full">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  sceneRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 will-change-transform"
                style={{ opacity: 0, transform: 'translate3d(0, 80px, 0)' }}
              >
                <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-6 md:mb-10">
                      <span
                        className="block w-6 md:w-8 h-px"
                        style={{ backgroundColor: feature.accent, opacity: 0.6 }}
                      />
                      <span
                        className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.35em] uppercase"
                        style={{ color: feature.accent }}
                      >
                        {String(feature.index).padStart(2, '0')} / {String(feature.total).padStart(2, '0')} · {feature.kicker}
                      </span>
                    </div>

                    <h2
                      className="!text-white font-extrabold tracking-[-0.04em] leading-[0.92] mb-6 md:mb-10"
                      style={{
                        fontSize: 'clamp(2.25rem, 6.5vw, 5.75rem)',
                        textShadow: '0 8px 60px rgba(0,0,0,0.4)',
                      }}
                    >
                      {feature.title}
                    </h2>

                    <p className="text-base md:text-xl text-white/65 font-medium leading-relaxed max-w-2xl">
                      {feature.desc}
                    </p>

                    {feature.metric && (
                      <div className="mt-8 md:mt-12 flex items-baseline gap-4 md:gap-6">
                        <div
                          className="font-extrabold tracking-tighter leading-none"
                          style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            background: `linear-gradient(135deg, ${feature.accent}, white)`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          {feature.metric.value}
                        </div>
                        <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-white/45">
                          {feature.metric.label}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
                    <div className="relative w-full aspect-square max-w-md">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${feature.accent}20 0%, transparent 70%)`,
                          filter: 'blur(40px)',
                        }}
                      />
                      <div
                        className="absolute inset-[20%] rounded-full border opacity-30"
                        style={{ borderColor: feature.accent }}
                      />
                      <div
                        className="absolute inset-[35%] rounded-full border opacity-20"
                        style={{ borderColor: feature.accent }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon
                          className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
                          style={{ color: feature.accent, filter: `drop-shadow(0 0 40px ${feature.accent}60)` }}
                          strokeWidth={1.2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="absolute bottom-0 inset-x-0 px-6 md:px-12 lg:px-20 pb-6 md:pb-8 z-30 pointer-events-none"
          aria-hidden
        >
          <div className="max-w-[1500px] mx-auto flex items-center gap-2 md:gap-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => {
                  progressContainerRefs.current[i] = el;
                }}
                className="flex-1 h-px relative overflow-hidden bg-white/[0.08]"
                style={{ opacity: 0.2 }}
              >
                <div
                  ref={(el) => {
                    progressFillRefs.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left"
                  style={{ backgroundColor: f.accent, transform: 'scaleX(0)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesMobile() {
  return (
    <section
      id="features"
      className="relative lg:hidden bg-[#0A0A0B] text-white py-20 overflow-hidden"
      aria-label="Tryzeon core features"
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
            Core Infrastructure
            <span className="block w-6 h-px bg-white/30" />
          </span>
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] !text-white leading-[1.0]">
            五大核心技術
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden"
              >
                <div
                  className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-30 blur-2xl"
                  style={{ backgroundColor: feature.accent }}
                  aria-hidden
                />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="block w-5 h-px"
                      style={{ backgroundColor: feature.accent, opacity: 0.7 }}
                    />
                    <span
                      className="text-[9px] font-mono font-semibold tracking-[0.3em] uppercase"
                      style={{ color: feature.accent }}
                    >
                      {String(feature.index).padStart(2, '0')} · {feature.kicker}
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${feature.accent}1f` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: feature.accent }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3
                      className="!text-white font-extrabold tracking-[-0.03em] leading-[1.05] flex-1"
                      style={{ fontSize: 'clamp(1.35rem, 5.5vw, 1.75rem)' }}
                    >
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed mb-5">
                    {feature.desc}
                  </p>

                  {feature.metric && (
                    <div className="flex items-baseline gap-3 pt-4 border-t border-white/5">
                      <div
                        className="font-extrabold tracking-tighter leading-none"
                        style={{
                          fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                          background: `linear-gradient(135deg, ${feature.accent}, white)`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        {feature.metric.value}
                      </div>
                      <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/45">
                        {feature.metric.label}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
