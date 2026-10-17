'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useAnimate, useInView, useReducedMotion, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppScreen } from '@/components/AppScreen';
import { MoreLink } from '@/components/MoreLink';
import { PhoneFrame } from '@/components/PhoneFrame';
import { SectionHeader } from '@/components/SectionHeader';
import { TryOnVideo } from '@/components/TryOnVideo';
import { APP_IMAGES, TRYON_VIDEO, type AppImageName } from '@/lib/app-images';
import type { HomeCopy } from '@/lib/copy';
import { EASE, fadeUpItem, inView } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 功能 → 畫面，順序對應 copy.home.experience.items
const SCREENS = [
  { kind: 'image', name: 'tryonOutfit' },
  { kind: 'video' },
  { kind: 'image', name: 'fitGreen' },
  { kind: 'image', name: 'agentShirt' },
] as const satisfies readonly ({ kind: 'image'; name: AppImageName } | { kind: 'video' })[];

type Screen = (typeof SCREENS)[number];
type ExperienceItem = HomeCopy['experience']['items'][number];

const DESKTOP = '(min-width: 1024px)';
const SCAN_S = 0.9;
// 舊畫面淡出的時間；掃描層在這之後才收回，淡出途中不會露出模糊底圖
const FADE_OUT_S = 0.35;

const revealProps = { variants: fadeUpItem, ...inView };

// 進度軌：點的位置與漸層線的填充比例（4 項，以 class 列舉，不寫 inline style）
const DOT_POS = ['top-0', 'top-1/3', 'top-2/3', 'top-full'] as const;
const FILL_SCALE = ['scale-y-0', 'scale-y-[0.3333]', 'scale-y-[0.6667]', 'scale-y-100'] as const;

// 桌機手機的寬度：最多 320px，矮螢幕上依視窗高度縮小，避開固定導覽列
const DESKTOP_PHONE_W = 'w-[min(320px,calc((100vh_-_10rem)*0.45))]';
const MOBILE_PHONE_W = 'w-[62vw] max-w-[260px]';

interface ExperienceShowcaseProps {
  copy: HomeCopy['experience'];
}

/**
 * 顧客會得到的體驗：四個功能 × 實機畫面。
 * 桌機是 sticky 手機 scrollytelling：左欄文字逐項捲過，右邊同一支手機隨 active 項換畫面；
 * 手機與平板改成逐項直排。兩份 DOM 以 display:none 互斥，螢幕閱讀器只會讀到看得見的那一份。
 */
export function ExperienceShowcase({ copy }: ExperienceShowcaseProps) {
  return (
    <section id="experience" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />

        <DesktopShowcase copy={copy} />

        {/* 手機與平板：文字在上、手機在下，逐項直排 */}
        <div className="space-y-16 lg:hidden">
          {copy.items.map((item, i) => (
            <motion.div key={item.title} {...revealProps}>
              <div className="mx-auto max-w-md text-center">
                <ItemText item={item} />
              </div>
              <div className="mt-8 flex justify-center">
                <MobilePhone screen={SCREENS[i]} replayLabel={copy.replay} />
              </div>
            </motion.div>
          ))}
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
 * 桌機：三欄 grid（進度軌｜文字｜手機舞台）。進度軌與舞台都是 sticky top-0 h-screen 的欄，
 * 內容在欄內垂直置中；這條路徑上的祖先沒有 transform / overflow:hidden，sticky 才不會失效。
 * active 由每個文字區塊的 ScrollTrigger（top center → bottom center）決定，
 * SmoothScrollProvider 會從 Lenis 的 scroll 事件 pump ScrollTrigger.update()。
 */
function DesktopShowcase({ copy }: DesktopShowcaseProps) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const [turnScope, animateTurn] = useAnimate<HTMLDivElement>();
  const entered = useInView(stageRef, { once: true, amount: 0.3 });
  const reduced = useReducedMotion() ?? false;
  const prevActive = useRef(active);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    });
    // 整段捲動中手機微微轉向，像站在空間裡
    mm.add(`${DESKTOP} and (prefers-reduced-motion: no-preference)`, () => {
      if (!driftRef.current || !listRef.current) return;
      gsap.fromTo(
        driftRef.current,
        { rotateY: -4 },
        {
          rotateY: 4,
          ease: 'none',
          scrollTrigger: { trigger: listRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  // 換畫面時手機做一次 3D 翻頁
  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    if (!entered || reduced || !turnScope.current) return;
    void animateTurn(turnScope.current, { rotateY: [0, -10, 0] }, { duration: 0.7, ease: EASE });
  }, [active, entered, reduced, animateTurn, turnScope]);

  return (
    <div className="mx-auto hidden max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] gap-x-12 lg:grid xl:gap-x-20">
      <div className="sticky top-0 flex h-screen items-center self-start" aria-hidden>
        <ProgressRail active={active} />
      </div>

      <div ref={listRef}>
        {copy.items.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex min-h-[80vh] items-center"
          >
            <div
              className={`max-w-xl transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:opacity-100 ${
                i === active ? 'opacity-100' : 'opacity-[0.35]'
              }`}
            >
              <ItemText item={item} large />
            </div>
          </div>
        ))}
      </div>

      <div
        ref={stageRef}
        className="sticky top-0 flex h-screen items-center justify-center self-start [perspective:1200px]"
      >
        <div ref={driftRef} className="[transform-style:preserve-3d]">
          <div ref={turnScope} className="[transform-style:preserve-3d]">
            <PhoneFrame
              className={`${DESKTOP_PHONE_W} shadow-[0_40px_100px_rgba(16,24,40,0.18),0_8px_24px_rgba(16,24,40,0.08)]`}
            >
              {SCREENS.map((screen, i) => (
                <DesktopScreenLayer
                  key={screen.kind === 'video' ? 'video' : screen.name}
                  screen={screen}
                  isActive={i === active}
                  play={i === active && entered}
                  replayLabel={copy.replay}
                />
              ))}
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

const layerVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: FADE_OUT_S, ease: 'easeIn' } },
  show: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};

const videoExit = { opacity: 0, transition: { duration: FADE_OUT_S, ease: 'easeIn' } } as const;

interface DesktopScreenLayerProps {
  screen: Screen;
  isActive: boolean;
  /** active 且舞台已進入視窗：播掃描顯影 */
  play: boolean;
  replayLabel: string;
}

/**
 * 一格畫面。四格疊在同一支手機裡（圖片因此先載好），active 的那格在最上層淡入並掃描顯影，
 * 舊的那格在下面淡出。影片只在 active 時掛載，每次切到都從頭播（TryOnVideo 進入視窗即播）。
 */
function DesktopScreenLayer({ screen, isActive, play, replayLabel }: DesktopScreenLayerProps) {
  return (
    <motion.div
      variants={layerVariants}
      initial="hidden"
      animate={isActive ? 'show' : 'hidden'}
      className={`absolute inset-0 ${isActive ? 'z-10' : 'pointer-events-none z-0'}`}
    >
      {screen.kind === 'video' ? (
        <ScanReveal play={play} base={TRYON_VIDEO.poster} sizes="320px">
          <AnimatePresence>
            {isActive && (
              <motion.div
                key="video"
                className="absolute inset-0"
                initial="hidden"
                animate="show"
                exit={videoExit}
              >
                <TryOnVideo replayLabel={replayLabel} framed={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </ScanReveal>
      ) : (
        <ScanReveal play={play} base={screen.name} sizes="320px">
          <AppScreen name={screen.name} sizes="320px" framed={false} />
        </ScanReveal>
      )}
    </motion.div>
  );
}

interface MobilePhoneProps {
  screen: Screen;
  replayLabel: string;
}

/** 手機與平板：每支手機第一次進入視窗時掃描顯影一次 */
function MobilePhone({ screen, replayLabel }: MobilePhoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const sizes = '(min-width: 640px) 260px, 62vw';
  return (
    <div ref={ref} className={MOBILE_PHONE_W}>
      <PhoneFrame className="w-full">
        {screen.kind === 'video' ? (
          <ScanReveal play={seen} base={TRYON_VIDEO.poster} sizes={sizes}>
            <TryOnVideo replayLabel={replayLabel} framed={false} />
          </ScanReveal>
        ) : (
          <ScanReveal play={seen} base={screen.name} sizes={sizes}>
            <AppScreen name={screen.name} sizes={sizes} framed={false} />
          </ScanReveal>
        )}
      </PhoneFrame>
    </div>
  );
}

const SCAN_EASE = [0.45, 0, 0.2, 1] as const;

// custom = reduced motion：直接清晰，不掃描
const sharpVariants: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0, delay: FADE_OUT_S + 0.05 } },
  show: (reduced: boolean) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: reduced ? 0 : SCAN_S, ease: SCAN_EASE },
  }),
};

// 光束掛在一個滿版容器的底邊；容器 y 從 -100% 到 0%，底邊就與裁切邊緣同步由上往下
const beamVariants: Variants = {
  hidden: { y: '-100%', opacity: 0, transition: { duration: 0, delay: FADE_OUT_S + 0.05 } },
  show: (reduced: boolean) =>
    reduced
      ? { y: '0%', opacity: 0, transition: { duration: 0 } }
      : {
          y: ['-100%', '0%'],
          opacity: [0, 1, 1, 0],
          transition: {
            y: { duration: SCAN_S, ease: SCAN_EASE },
            opacity: { duration: SCAN_S, times: [0, 0.08, 0.85, 1], ease: 'linear' },
          },
        },
};

interface ScanRevealProps {
  play: boolean;
  /** 模糊底圖用的截圖（裝飾，alt 為空）；影片格用它的 poster */
  base: AppImageName;
  sizes: string;
  children: ReactNode;
}

/**
 * 掃描顯影（本元件內的最小版本）：底層是模糊、去飽和的同一張畫面，
 * 清晰層以 clip-path 由上往下展開，一道藍→青光束跟著裁切邊緣走。
 */
function ScanReveal({ play, base, sizes, children }: ScanRevealProps) {
  const reduced = useReducedMotion() ?? false;
  const image = APP_IMAGES[base];
  const state = play ? 'show' : 'hidden';
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 scale-110 blur-[14px] saturate-[0.4]" aria-hidden>
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes={sizes}
          className="h-full w-full object-cover"
        />
      </div>
      <motion.div
        className="absolute inset-0"
        variants={sharpVariants}
        custom={reduced}
        initial="hidden"
        animate={state}
      >
        {children}
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        variants={beamVariants}
        custom={reduced}
        initial="hidden"
        animate={state}
        aria-hidden
      >
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#06B6D4] shadow-[0_0_14px_3px_rgba(96,165,250,0.55)]" />
      </motion.div>
    </div>
  );
}

interface ProgressRailProps {
  active: number;
}

/** 桌機最左的細進度軌：4 個點 + 連線，漸層線填到 active 的點 */
function ProgressRail({ active }: ProgressRailProps) {
  return (
    <div className="relative h-[min(56vh,26rem)] w-4">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#101828]/10" />
      <div
        className={`absolute inset-y-0 left-1/2 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-[#2563EB] to-[#06B6D4] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${FILL_SCALE[active]}`}
      />
      {DOT_POS.map((pos, i) => (
        <span
          key={pos}
          className={`absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${pos} ${
            i === active
              ? 'scale-100 border-transparent shadow-[0_0_0_5px_rgba(37,99,235,0.12)]'
              : i < active
                ? 'scale-[0.6] border-[#2563EB]/60'
                : 'scale-[0.6] border-[#101828]/20'
          }`}
        >
          <span
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] transition-opacity duration-500 motion-reduce:transition-none ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </span>
      ))}
    </div>
  );
}

interface ItemTextProps {
  item: ExperienceItem;
  /** 桌機 scrollytelling 的較大字級 */
  large?: boolean;
}

function ItemText({ item, large = false }: ItemTextProps) {
  return (
    <>
      <h3
        className={
          large
            ? 'cjk-punct font-serif text-[2rem] font-black leading-tight tracking-[-0.01em] text-[#101828] xl:text-[2.375rem]'
            : 'text-xl font-semibold text-[#101828]'
        }
      >
        {item.title}
      </h3>
      {item.metric && (
        <span className={`block font-mono text-[#1D4ED8] ${large ? 'mt-3 text-base' : 'mt-1 text-sm'}`}>
          {item.metric}
        </span>
      )}
      <p
        className={`mb-0 text-balance leading-relaxed text-[#475467] ${
          large ? 'mt-4 text-lg' : 'mt-2 text-sm md:text-base'
        }`}
      >
        {item.desc}
      </p>
    </>
  );
}
