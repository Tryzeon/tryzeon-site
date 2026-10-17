'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { MoreLink } from '@/components/MoreLink';
import { PhoneFrame } from '@/components/PhoneFrame';
import { SectionHeader } from '@/components/SectionHeader';
import { TryOnVideo } from '@/components/TryOnVideo';
import { keepRanges } from '@/components/clauseWrap';
import type { AppImageName } from '@/lib/app-images';
import type { HomeCopy } from '@/lib/copy';
import { EASE, fadeUpItem, inView } from '@/lib/motion';

// 功能 → 畫面，順序對應 copy.home.experience.items
const SCREENS = [
  { kind: 'image', name: 'tryonOutfit' },
  { kind: 'video' },
  { kind: 'image', name: 'fitGreen' },
  { kind: 'image', name: 'agentShirt' },
] as const satisfies readonly ({ kind: 'image'; name: AppImageName } | { kind: 'video' })[];

// 每一站手機轉向的角度與背後光暈的顏色
const POSES = [
  { ry: -12, rx: 4, glow: 'rgba(185,167,255,0.42)' },
  { ry: 10, rx: 2, glow: 'rgba(143,211,255,0.40)' },
  { ry: -8, rx: -2, glow: 'rgba(92,225,230,0.36)' },
  { ry: 12, rx: 3, glow: 'rgba(201,184,255,0.42)' },
] as const;

// 「虛擬試衣間」的三色合身燈號（裝飾，文字說明在 desc 裡）
const FIT_LIGHTS = ['bg-[#4ADE80]', 'bg-[#FACC15]', 'bg-[#F87171]'] as const;

type ExperienceItem = HomeCopy['experience']['items'][number];

interface ExperienceShowcaseProps {
  copy: HomeCopy['experience'];
}

/**
 * 顧客會得到的體驗：四個功能 × 實機畫面。
 * 桌機：左邊四段文字往上捲，右邊一支手機釘在畫面中央；捲到哪一段，
 * 一道光束就由上往下把螢幕「重新渲染」成那個功能的畫面，手機同時換個角度。
 * 手機與平板：逐項直排。兩份 DOM 以 display:none 互斥。
 */
export function ExperienceShowcase({ copy }: ExperienceShowcaseProps) {
  return (
    <section id="experience" className="relative bg-night py-28 md:py-40">
      <div className="mx-auto max-w-[1360px] px-6 md:px-12">
        <SectionHeader align="left" title={copy.title} lede={copy.lede} />

        <DesktopShowcase copy={copy} />

        <div className="space-y-20 lg:hidden">
          {copy.items.map((item, i) => {
            const screen = SCREENS[i];
            return (
              <motion.div key={item.title} variants={fadeUpItem} {...inView}>
                <div className="mx-auto max-w-md">
                  <ItemText item={item} index={i} />
                </div>
                <div className="relative mt-10 flex justify-center">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-3/4 w-3/4 -translate-y-1/2 rounded-full blur-3xl"
                    style={{ background: `radial-gradient(closest-side, ${POSES[i].glow}, transparent)` }}
                    aria-hidden
                  />
                  {screen.kind === 'video' ? (
                    <TryOnVideo replayLabel={copy.replay} className="w-[62vw] max-w-[260px]" />
                  ) : (
                    <AppScreen name={screen.name} sizes="(min-width: 640px) 260px, 62vw" className="w-[62vw] max-w-[260px]" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 md:mt-20">
          <MoreLink href="/download">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}

function DesktopShowcase({ copy }: { copy: HomeCopy['experience'] }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const activeRef = useRef(0);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

  // 文字段落跨過視窗中線，就換成那一段
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = Number((entry.target as HTMLElement).dataset.index);
          if (i === activeRef.current) return;
          setPrev(activeRef.current);
          activeRef.current = i;
          setActive(i);
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    articleRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (i: number) => {
    const el = articleRefs.current[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + el.offsetHeight / 2;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  const pose = POSES[active];

  return (
    <div className="hidden gap-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative border-l border-white/10">
        {/* 左側細線上的進度光條 */}
        <span
          className="absolute -left-px top-0 w-[2px] rounded-full bg-gradient-to-b from-lilac to-aqua shadow-[0_0_14px_rgba(185,167,255,0.8)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: `${100 / copy.items.length}%`, transform: `translateY(${active * 100}%)` }}
          aria-hidden
        />
        {copy.items.map((item, i) => (
          <article
            key={item.title}
            ref={(el) => {
              articleRefs.current[i] = el;
            }}
            data-index={i}
            className={`flex min-h-[78vh] items-center py-16 pl-12 transition-opacity duration-700 ${
              active === i ? 'opacity-100' : 'opacity-35'
            }`}
          >
            <div className="max-w-lg">
              <ItemText item={item} index={i} large />
            </div>
          </article>
        ))}
      </div>

      <div className="sticky top-0 flex h-[100svh] items-center justify-center pt-16">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-[background] duration-1000"
          style={{ background: `radial-gradient(closest-side, ${pose.glow}, transparent)` }}
          aria-hidden
        />
        <div className="[perspective:1600px]">
          <div
            className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `rotateY(${pose.ry}deg) rotateX(${pose.rx}deg)` }}
          >
            <PhoneFrame className="w-[min(320px,calc((100svh_-_10rem)_*_0.46))]">
              {SCREENS.map((screen, i) => {
                const role = i === active ? 'active' : i === prev ? 'prev' : 'idle';
                return (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      clipPath: role === 'idle' ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)',
                      zIndex: role === 'active' ? 3 : role === 'prev' ? 2 : 1,
                    }}
                    transition={{ clipPath: role === 'active' ? { duration: 1.1, ease: EASE } : { duration: 0 } }}
                    aria-hidden={role !== 'active'}
                  >
                    {screen.kind === 'video' ? (
                      <TryOnVideo replayLabel={copy.replay} framed={false} playing={active === i} />
                    ) : (
                      <AppScreen name={screen.name} sizes="320px" framed={false} />
                    )}
                  </motion.div>
                );
              })}
              {/* 換畫面時跟著遮罩邊緣往下走的光束 */}
              {prev !== null && (
                <motion.span
                  key={active}
                  className="pointer-events-none absolute inset-x-0 z-[4] h-[2px] -translate-y-1/2 [background:var(--opal)] shadow-[0_0_14px_3px_rgba(201,184,255,0.85),0_0_50px_10px_rgba(110,231,240,0.35)]"
                  initial={{ top: '0%', opacity: 1 }}
                  animate={{ top: '100%', opacity: [1, 1, 0] }}
                  transition={{ duration: 1.1, ease: EASE, opacity: { duration: 1.1, times: [0, 0.8, 1] } }}
                  aria-hidden
                />
              )}
            </PhoneFrame>
          </div>
        </div>

        {/* 四站的快速跳轉 */}
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {copy.items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={item.title}
              aria-current={active === i ? 'step' : undefined}
              className="focus-ring group flex h-6 w-6 items-center justify-center rounded-full"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  active === i ? 'h-2.5 w-2.5 bg-aqua shadow-[0_0_10px_2px_rgba(110,231,240,0.7)]' : 'h-1.5 w-1.5 bg-white/30 group-hover:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ItemTextProps {
  item: ExperienceItem;
  index: number;
  large?: boolean;
}

function ItemText({ item, index, large = false }: ItemTextProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <h3 className={`font-semibold text-pearl ${large ? 'text-3xl' : 'text-2xl'}`}>{item.title}</h3>
        {index === 2 && (
          <span className="flex gap-1.5" aria-hidden>
            {FIT_LIGHTS.map((light) => (
              <span key={light} className={`h-2.5 w-2.5 rounded-full ${light} shadow-[0_0_10px_currentColor]`} />
            ))}
          </span>
        )}
      </div>
      {item.metric && (
        <span className={`opal-text mt-3 block font-serif font-black ${large ? 'text-5xl' : 'text-4xl'}`}>{keepRanges(item.metric)}</span>
      )}
      <p className={`mb-0 mt-4 leading-relaxed text-haze ${large ? 'text-lg' : 'text-base'}`}>{item.desc}</p>
    </>
  );
}
