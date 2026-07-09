'use client';

/**
 * BentoFeatures — Tryzeon 5 大核心技術 Bento grid section.
 *
 * Adapted from 21st.dev "Bento Monochrome" inspiration (similarity 0.22)
 * — light editorial-tech aesthetic, intersection-observer reveal,
 * intrinsic strokes-only icons, motion-safe gentle float/pulse animations.
 *
 * Tryzeon customisation:
 *  - Light-only (no dark mode toggle)
 *  - 5 features = Tryzeon's 5 core technologies
 *  - Bento spans: hero card (4×2) + 2 small (2×1 ×2) + 2 wide (3×1 ×2)
 *  - Accent gradient subtle (no AI purple/pink slop — see UI/UX Pro Max anti-pattern)
 */

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Video, Shirt, TrendingUp, Store } from 'lucide-react';

const FEATURES = [
  {
    title: 'AI 時尚虛擬試穿',
    blurb: '一張照片即可虛擬試穿任何服飾。AI 精準辨識身形與姿勢，讓消費者在購買前看見每一種搭配的可能。',
    meta: 'Virtual Try-On',
    metric: '< 3 秒',
    icon: Sparkles,
    animation: 'tz-bento-float 6s ease-in-out infinite',
  },
  {
    title: 'AI 虛擬試穿影片',
    blurb: '靜態照片秒變動態走秀影片。讓你以第三人稱看見自己穿著服飾走動、旋轉的真實樣貌。',
    meta: 'Dynamic Video',
    metric: '10 秒',
    icon: Video,
    animation: 'tz-bento-pulse 4s ease-in-out infinite',
  },
  {
    title: '個人雲端衣櫃 & AI 推薦',
    blurb: '數位化管理你的衣物。AI 根據 5W1H 推薦穿搭，缺合適服飾時自動引導試穿合作品牌商品。',
    meta: 'Smart Wardrobe',
    metric: '5W1H',
    icon: Shirt,
    animation: 'tz-bento-tilt 5.5s ease-in-out infinite',
  },
  {
    title: '時尚趨勢數據分析',
    blurb: '從試穿與互動數據洞察消費者偏好。協助品牌精準進貨、降低庫存風險、優化行銷投放。',
    meta: 'Trend Analytics',
    metric: '即時',
    icon: TrendingUp,
    animation: 'tz-bento-drift 8s ease-in-out infinite',
  },
  {
    title: '虛擬試衣間',
    blurb: '合作品牌將服飾上架到試衣間。消費者跨品牌組搭試穿，發現新風格、創造交叉銷售機會。',
    meta: 'Try-On Room',
    metric: '跨品牌',
    icon: Store,
    animation: 'tz-bento-glow 7s ease-in-out infinite',
  },
];

const SPANS = [
  'md:col-span-4 md:row-span-2', // 1. Hero feature (large)
  'md:col-span-2 md:row-span-1', // 2. Small top-right
  'md:col-span-2 md:row-span-1', // 3. Small below
  'md:col-span-3 md:row-span-1', // 4. Wide bottom-left
  'md:col-span-3 md:row-span-1', // 5. Wide bottom-right
];

export function BentoFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Inject CSS keyframes once
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = 'tz-bento-animations';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `
      @keyframes tz-bento-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6%); }
      }
      @keyframes tz-bento-pulse {
        0%, 100% { transform: scale(1); opacity: 0.85; }
        50% { transform: scale(1.08); opacity: 1; }
      }
      @keyframes tz-bento-tilt {
        0% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
        100% { transform: rotate(-2deg); }
      }
      @keyframes tz-bento-drift {
        0%, 100% { transform: translate3d(0,0,0); }
        50% { transform: translate3d(6%,-6%,0); }
      }
      @keyframes tz-bento-glow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      @keyframes tz-bento-intro {
        0% { opacity: 0; transform: translate3d(0,28px,0); }
        100% { opacity: 1; transform: translate3d(0,0,0); }
      }
      @keyframes tz-bento-card {
        0% { opacity: 0; transform: translate3d(0,18px,0) scale(0.96); }
        100% { opacity: 1; transform: translate3d(0,0,0) scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  // IntersectionObserver fade-in
  useEffect(() => {
    if (!sectionRef.current) return;
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative bg-[#FAFAFA] py-20 md:py-32 overflow-hidden"
      aria-label="Tryzeon core features"
    >
      {/* Ambient mesh + subtle grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 80% at 12% 0%, rgba(37,99,235,0.07), transparent 65%), radial-gradient(ellipse 40% 70% at 88% 0%, rgba(6,182,212,0.06), transparent 70%), #FAFAFA',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage:
              'radial-gradient(circle at center, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 30%, transparent 80%)',
          }}
        />
      </div>

      <div
        className={`relative mx-auto max-w-7xl px-6 motion-safe:opacity-0 ${
          visible ? 'motion-safe:animate-[tz-bento-intro_0.9s_ease-out_forwards]' : ''
        }`}
      >
        {/* Header */}
        <header className="mb-12 flex flex-col gap-6 border-b border-[#101828]/8 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#475467] font-mono font-semibold">
              <span className="block w-8 h-px bg-[#101828]/40" />
              N°05 — Core Infrastructure
            </span>
            <h2
              className="font-serif font-black tracking-[-0.02em] leading-[1.12] text-[#101828]"
              style={{ fontSize: 'clamp(2rem, 4.6vw, 3.9rem)' }}
            >
              五大核心技術
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-[#475467] leading-relaxed">
            從 AI 試穿到跨品牌組搭，Tryzeon 用模組化基礎建設讓品牌與消費者
            雙端共贏。
          </p>
        </header>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:auto-rows-[minmax(160px,auto)] md:grid-cols-6">
          {FEATURES.map((feature, index) => (
            <BentoCard
              key={feature.title}
              span={SPANS[index]}
              feature={feature}
              index={index}
              isVisible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface BentoCardProps {
  feature: (typeof FEATURES)[number];
  span: string;
  index: number;
  isVisible: boolean;
}

function BentoCard({ feature, span, index, isVisible }: BentoCardProps) {
  const { icon: Icon, animation, title, blurb, meta, metric } = feature;
  const delay = `${Math.max(index * 0.12, 0)}s`;

  return (
    <article
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_40px_rgba(16,24,40,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_24px_70px_rgba(37,99,235,0.10)] motion-safe:opacity-0 ${
        isVisible ? 'motion-safe:animate-[tz-bento-card_0.8s_ease-out_forwards]' : ''
      } ${span}`}
      style={{ animationDelay: delay }}
    >
      {/* Subtle gradient backdrop */}
      <div
        className="absolute inset-0 -z-10 opacity-60 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 120% at 10% 0%, rgba(37,99,235,0.10), transparent 72%)',
        }}
      />

      {/* Top: icon + meta tag */}
      <header className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10">
          <Icon
            className="h-6 w-6 text-[#2563EB]"
            strokeWidth={1.5}
            style={{ animation }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base md:text-lg font-semibold uppercase tracking-wide text-[#101828]">
              {title}
            </h3>
            {meta && (
              <span className="hidden md:inline-block rounded-full border border-[#101828]/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.3em] text-[#475467] font-mono font-semibold">
                {meta}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#475467]">{blurb}</p>
        </div>
      </header>

      {/* Metric (bottom-aligned for tall card) */}
      {metric && (
        <div className="mt-6 flex items-baseline gap-3 border-t border-[#101828]/5 pt-4">
          <span
            className="font-extrabold tracking-tighter leading-none text-[#101828]"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            {metric}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#475467]">
            {meta}
          </span>
        </div>
      )}
    </article>
  );
}
