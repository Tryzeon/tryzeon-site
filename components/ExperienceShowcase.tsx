'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { MoreLink } from '@/components/MoreLink';
import { PhoneBody } from '@/components/Phone3D';
import { SectionHeader } from '@/components/SectionHeader';
import { TryOnVideo } from '@/components/TryOnVideo';
import type { AppImageName } from '@/lib/app-images';
import type { HomeCopy } from '@/lib/copy';
import { EASE, fadeUpItem, inView } from '@/lib/motion';
import { usePointerTilt } from '@/lib/use-pointer-tilt';

const FOCUS_RING = 'focus-ring focus-visible:ring-offset-[#FAFAFA]';

// 滑過清單時停留這麼久才切換：游標斜著劃過其他項目去點右邊時，畫面不會一路閃過；
// 切換時整支手機會轉一下，所以比單純換圖要更確定一點才切
const HOVER_INTENT_MS = 220;

// 手機背後的光暈，跟著選中的功能換色（只在藍青之間）
const HALOS = ['rgba(37,99,235,0.20)', 'rgba(6,182,212,0.20)', 'rgba(96,165,250,0.24)', 'rgba(29,78,216,0.18)'] as const;

// 功能 → 畫面，順序對應 copy.home.experience.items
const SCREENS = [
  { kind: 'image', name: 'tryonOutfit' },
  { kind: 'video' },
  { kind: 'image', name: 'fitGreen' },
  { kind: 'image', name: 'agentShirt' },
] as const satisfies readonly ({ kind: 'image'; name: AppImageName } | { kind: 'video' })[];

type ExperienceItem = HomeCopy['experience']['items'][number];

const revealProps = { variants: fadeUpItem, ...inView };

interface ExperienceShowcaseProps {
  copy: HomeCopy['experience'];
}

/**
 * 顧客會得到的體驗：四個功能 × 實機畫面。
 * 桌機是「左邊選功能、右邊一支手機換畫面」；手機與平板改成逐項直排，不需要互動。
 * 兩份 DOM 以 display:none 互斥，螢幕閱讀器只會讀到看得見的那一份。
 */
export function ExperienceShowcase({ copy }: ExperienceShowcaseProps) {
  return (
    <section id="experience" className="relative overflow-x-clip bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />

        <DesktopShowcase copy={copy} />

        {/* 手機與平板：文字在上、手機在下，逐項直排 */}
        <div className="space-y-16 lg:hidden">
          {copy.items.map((item, i) => {
            const screen = SCREENS[i];
            return (
              <motion.div key={item.title} {...revealProps}>
                <div className="mx-auto max-w-md text-center">
                  <ItemText item={item} as="h3" />
                </div>
                <div className="mt-8 flex justify-center">
                  <PhoneReveal className="w-[62vw] max-w-[260px]">
                    {screen.kind === 'video' ? (
                      <TryOnVideo replayLabel={copy.replay} framed={false} />
                    ) : (
                      <AppScreen name={screen.name} sizes="(min-width: 640px) 260px, 62vw" framed={false} />
                    )}
                  </PhoneReveal>
                </div>
              </motion.div>
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
 * 桌機：功能清單切換右側手機畫面，採 WAI-ARIA tabs 模式（直向 tablist + 一個 tabpanel）：
 * 滑鼠停在項目上就切換（不必點擊）；點擊與鍵盤照常可用——
 * 只有選中項在 Tab 順序裡，上下（或左右）方向鍵、Home、End 在項目間移動並直接切換。
 */
function DesktopShowcase({ copy }: DesktopShowcaseProps) {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  usePointerTilt(stageRef, { max: 5, relativeTo: 'element' });

  // 換功能時手機朝新的方向轉一下再回正（往下選往左轉、往上選往右轉）
  const [swingScope, animateSwing] = useAnimate<HTMLDivElement>();
  const previous = useRef(0);
  useEffect(() => {
    if (previous.current === active) return;
    const dir = active > previous.current ? 1 : -1;
    previous.current = active;
    if (!swingScope.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    void animateSwing(swingScope.current, { rotateY: [dir * 16, 0], rotateX: [-3, 0] }, { duration: 1.1, ease: EASE });
  }, [active, animateSwing, swingScope]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const titleId = (i: number) => `${baseId}-title-${i}`;
  const descId = (i: number) => `${baseId}-desc-${i}`;
  const panelId = `${baseId}-panel`;

  const screen = SCREENS[active];
  const current: AppImageName | null = screen.kind === 'video' ? null : screen.name;

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
    const count = copy.items.length;
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

  return (
    <motion.div {...revealProps} className="mx-auto hidden max-w-5xl items-center gap-16 lg:grid lg:grid-cols-[1fr_auto]">
      <div
        role="tablist"
        aria-label={copy.title}
        aria-orientation="vertical"
        className="relative max-w-xl border-l border-[#101828]/10"
      >
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
              {/* 選中項：一片玻璃底與左側 2px 藍青漸層條，切換時滑到新的項目 */}
              {isActive && (
                <motion.span
                  layoutId={`${baseId}-active`}
                  className="pointer-events-none absolute inset-0 rounded-r-2xl bg-white/80 shadow-[0_8px_28px_rgba(16,24,40,0.07)]"
                  transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                  aria-hidden
                >
                  <span className="absolute -left-px bottom-3 top-3 w-[2px] rounded-full bg-gradient-to-b from-[#2563EB] to-[#06B6D4]" />
                </motion.span>
              )}
              <span className="relative block">
                <ItemText item={item} as="span" active={isActive} titleId={titleId(i)} descId={descId(i)} />
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={tabId(active)} className="relative isolate flex w-[300px] flex-col items-center">
        {/* 背後的光暈：跟著選中的功能換色 */}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{ backgroundColor: HALOS[active] }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-hidden
        />
        <div ref={stageRef} className="phone3d w-full" style={{ ['--yaw' as string]: '-7deg' }}>
          <div className="phone3d-pose">
            <motion.div ref={swingScope} style={{ transformStyle: 'preserve-3d' }}>
              <PhoneBody className="w-full">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current ?? 'video'}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE } }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }}
                  >
                    {current === null ? (
                      <TryOnVideo replayLabel={copy.replay} framed={false} />
                    ) : (
                      <AppScreen name={current} sizes="300px" framed={false} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </PhoneBody>
            </motion.div>
          </div>
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
        <span
          className={`mt-1 block font-mono text-sm transition-colors duration-300 ${
            active ? 'text-[#1D4ED8]' : 'text-[#475467]'
          }`}
        >
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

interface PhoneRevealProps {
  children: ReactNode;
  className?: string;
}

/** 手機與平板：有厚度的手機捲進視窗時從後仰的角度立起來（只動 transform） */
function PhoneReveal({ children, className = '' }: PhoneRevealProps) {
  return (
    <div className={`phone3d ${className}`}>
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateX: 22, rotateY: -10, y: 24 }}
        whileInView={{ rotateX: 0, rotateY: -4, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <PhoneBody className="w-full">{children}</PhoneBody>
      </motion.div>
    </div>
  );
}
