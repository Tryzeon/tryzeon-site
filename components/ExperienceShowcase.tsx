'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { MoreLink } from '@/components/MoreLink';
import { PhoneFrame } from '@/components/PhoneFrame';
import { SectionHeader } from '@/components/SectionHeader';
import { TryOnVideo } from '@/components/TryOnVideo';
import type { AppImageName } from '@/lib/app-images';
import type { HomeCopy } from '@/lib/copy';
import { EASE, fadeUpItem, inView } from '@/lib/motion';

const FOCUS_RING = 'focus-ring focus-visible:ring-offset-[#FAFAFA]';

// 滑過清單時停留這麼久才切換：游標斜著劃過其他項目去點右邊時，畫面不會一路閃過
const HOVER_INTENT_MS = 120;
// 自動輪播：每一項停留的時間（動態試穿影片 5 秒，留一點餘韻）
const AUTO_MS = 6500;

// 功能 → 畫面，順序對應 copy.home.experience.items
const SCREENS = [
  { kind: 'image', name: 'tryonOutfit' },
  { kind: 'video' },
  { kind: 'image', name: 'fitGreen' },
  { kind: 'image', name: 'agentCommute' },
] as const satisfies readonly ({ kind: 'image'; name: AppImageName } | { kind: 'video' })[];

type ExperienceItem = HomeCopy['experience']['items'][number];

const revealProps = { variants: fadeUpItem, ...inView };

// 手機版：每支手機從後方翻起來（rotateX），父層給 perspective
const phoneRise: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: 22 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1.2, ease: EASE } },
};

interface ExperienceShowcaseProps {
  copy: HomeCopy['experience'];
}

/**
 * 顧客會得到的體驗：四個功能 × 實機畫面。
 * 桌機：左邊選功能，右邊四支手機排成 3D 的 cover flow，選到的那支轉到正面；
 * 在畫面內且沒有游標停留時自動輪播（選中項下方的進度條就是倒數）。
 * 手機與平板改成逐項直排，手機從後方翻起來進場。
 * 兩份 DOM 以 display:none 互斥，螢幕閱讀器只會讀到看得見的那一份。
 */
export function ExperienceShowcase({ copy }: ExperienceShowcaseProps) {
  return (
    <section id="experience" className="relative overflow-hidden bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />

        <DesktopShowcase copy={copy} />

        {/* 手機與平板：文字在上、手機在下，逐項直排 */}
        <div className="space-y-20 lg:hidden">
          {copy.items.map((item, i) => {
            const screen = SCREENS[i];
            return (
              <div key={item.title}>
                <motion.div {...revealProps} className="mx-auto max-w-md text-center">
                  <ItemText item={item} as="h3" />
                </motion.div>
                <div className="mt-8 flex justify-center [perspective:1200px]">
                  <motion.div variants={phoneRise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="origin-bottom">
                    {screen.kind === 'video' ? (
                      <TryOnVideo className="w-[62vw] max-w-[260px]" />
                    ) : (
                      <AppScreen name={screen.name} sizes="(min-width: 640px) 260px, 62vw" className="w-[62vw] max-w-[260px]" />
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center md:mt-16">
          <MoreLink href="/download">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}

interface DesktopShowcaseProps {
  copy: HomeCopy['experience'];
}

/**
 * 桌機：功能清單採 WAI-ARIA tabs 模式（直向 tablist + 一個 tabpanel）：
 * 滑鼠停在項目上就切換（不必點擊）；點擊與鍵盤照常可用——
 * 只有選中項在 Tab 順序裡，上下（或左右）方向鍵、Home、End 在項目間移動並直接切換。
 * 右邊的 cover flow 只是選中項的視覺，非選中的手機對輔助科技隱藏，點擊可以直接切過去。
 */
function DesktopShowcase({ copy }: DesktopShowcaseProps) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [auto, setAuto] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useInView(rootRef, { amount: 0.4 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const titleId = (i: number) => `${baseId}-title-${i}`;
  const descId = (i: number) => `${baseId}-desc-${i}`;
  const panelId = `${baseId}-panel`;
  const count = copy.items.length;

  // 減少動態時不自動輪播（在 client 判斷，SSR 一律先不顯示進度條）
  useEffect(() => {
    setAuto(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  useEffect(() => cancelHover, []);

  const select = (i: number) => {
    cancelHover();
    setActive(i);
  };

  const onTabHover = (i: number) => {
    cancelHover();
    if (i === active) return;
    hoverTimer.current = setTimeout(() => select(i), HOVER_INTENT_MS);
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (active + 1) % count
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? (active - 1 + count) % count
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? count - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const paused = hovering || focused || !visible;

  return (
    <motion.div
      ref={rootRef}
      {...revealProps}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      className="mx-auto hidden max-w-6xl items-center gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] xl:gap-16"
    >
      <div role="tablist" aria-label={copy.title} aria-orientation="vertical" className="relative max-w-xl border-l border-[#101828]/10">
        {copy.items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.title}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={isActive}
              aria-controls={panelId}
              aria-labelledby={titleId(i)}
              aria-describedby={descId(i)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i)}
              onMouseEnter={() => onTabHover(i)}
              onMouseLeave={cancelHover}
              onKeyDown={onTabKeyDown}
              className={`group relative block w-full cursor-pointer rounded-r-2xl py-5 pl-8 pr-4 text-left transition-colors duration-300 hover:bg-white/60 ${FOCUS_RING}`}
            >
              {/* 選中項左側的藍青漸層條；自動輪播時它就是倒數的進度條 */}
              <span className="absolute -left-px bottom-3 top-3 w-[2px] overflow-hidden rounded-full" aria-hidden>
                <span className={`absolute inset-0 bg-[#101828]/10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                {isActive &&
                  (auto ? (
                    <span
                      key={`progress-${active}`}
                      className="tab-progress absolute inset-0 origin-top bg-gradient-to-b from-[#2563EB] to-[#06B6D4]"
                      style={{ animationDuration: `${AUTO_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                      onAnimationEnd={() => setActive((prev) => (prev + 1) % count)}
                    />
                  ) : (
                    <span className="absolute inset-0 bg-gradient-to-b from-[#2563EB] to-[#06B6D4]" />
                  ))}
              </span>
              <ItemText item={item} as="span" active={isActive} titleId={titleId(i)} descId={descId(i)} />
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={tabId(active)} className="relative px-28 xl:px-32">
        {/* 地面的影子與光暈 */}
        <span
          className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-[420px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(16,24,40,0.18),transparent)] blur-md"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.24)_0%,rgba(6,182,212,0.12)_40%,transparent_70%)] blur-2xl"
          aria-hidden
        />
        {/* cover flow 的 3D 空間：perspective 給景深，preserve-3d 讓每支手機的 translateZ / rotateY 共用同一個空間 */}
        <div className="relative aspect-[300/652] w-[min(280px,calc((100svh_-_10rem)_*_0.46))] [perspective:1600px] [transform-style:preserve-3d] xl:w-[min(300px,calc((100svh_-_10rem)_*_0.46))]">
          {SCREENS.map((screen, i) => {
            const o = i - active;
            const d = Math.abs(o);
            const isActive = o === 0;
            return (
              <div
                key={i}
                aria-hidden={!isActive}
                onClick={isActive ? undefined : () => select(i)}
                className={`absolute inset-0 transition-[transform,opacity,filter] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? '' : 'cursor-pointer'
                }`}
                style={{
                  transform: `translateX(${o * 48}%) translateZ(${-d * 200}px) rotateY(${-o * 34}deg)`,
                  opacity: d === 0 ? 1 : d === 1 ? 0.55 : d === 2 ? 0.2 : 0,
                  filter: d === 0 ? 'none' : `saturate(${1 - d * 0.3}) blur(${d * 0.6}px)`,
                  pointerEvents: d > 1 ? 'none' : undefined,
                }}
              >
                <PhoneFrame className="w-full">
                  {screen.kind === 'video' ? (
                    <TryOnVideo framed={false} />
                  ) : (
                    <AppScreen name={screen.name} sizes="300px" framed={false} />
                  )}
                </PhoneFrame>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

interface ItemTextProps {
  item: ExperienceItem;
  /** 手機版用 h3；桌機版在 button 裡，只能用 phrasing content */
  as: 'h3' | 'span';
  /** 桌機清單的選中狀態；未選中時以較淺的字色退後（仍維持 4.5:1 對比） */
  active?: boolean;
  titleId?: string;
  descId?: string;
}

function ItemText({ item, as: Title, active = true, titleId, descId }: ItemTextProps) {
  const Body = Title === 'h3' ? 'p' : 'span';
  return (
    <>
      <Title
        id={titleId}
        className={`block text-xl font-semibold transition-colors duration-300 ${
          active ? 'text-[#101828]' : 'text-[#475467] group-hover:text-[#101828]'
        }`}
      >
        {item.title}
      </Title>
      {item.metric && (
        <span className={`mt-1 block text-sm font-semibold transition-colors duration-300 ${active ? 'text-[#1D4ED8]' : 'text-[#475467]'}`}>
          {item.metric}
        </span>
      )}
      <Body
        id={descId}
        className={`mb-0 mt-2 block text-balance text-sm leading-relaxed transition-colors duration-300 md:text-base ${
          active ? 'text-[#475467]' : 'text-[#667085]'
        }`}
      >
        {item.desc}
      </Body>
    </>
  );
}
