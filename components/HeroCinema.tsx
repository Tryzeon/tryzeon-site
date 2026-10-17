'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useSpring, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppScreen } from '@/components/AppScreen';
import { Magnetic } from '@/components/Magnetic';
import { PhoneFrame } from '@/components/PhoneFrame';
import { ScanReveal } from '@/components/ScanReveal';
import { SilkField } from '@/components/SilkField';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { trackCTA } from '@/lib/analytics';
import { APP_IMAGES } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { EASE, FINE_POINTER_QUERY, TILT_SPRING } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 「輸入」小卡：白框、圓角、柔和陰影（模特全身照與商品平拍共用），寬度跟著父層
function InputCard({ name, sizes }: { name: 'modelA' | 'productWhiteShirt'; sizes: string }) {
  const image = APP_IMAGES[name];
  return (
    <div className="w-full overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-[0_24px_60px_rgba(16,24,40,0.18)]">
      <Image
        src={image.src}
        alt={siteCopy.images[name]}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

// 輸入小卡、連接線的進場時間：排在文字（CSS hero-enter，最晚 0.55s 開始）之後
const VISUAL_START = 0.6;
const CARD_FLY = 0.9;
// 連接線等第二張小卡落定（ease-out 跑到 ~85% 時已到位）才開始畫
const LINE_START = VISUAL_START + 0.12 + CARD_FLY * 0.85;
const LINE_DURATION = 0.7;
// 舞台 perspective 與小卡欄的景深，要與下方 class 的 1400px / translateZ(70px) 一致
const STAGE_PERSPECTIVE = 1400;
const CARD_DEPTH = 70;
// SSR 與首次 render 的連接線長度（mr-12 的 48px + 300px 手機的景深補償），掛載後改用實測值
const CONNECTOR_FALLBACK = 56;
// 最大傾斜角度
const TILT_MAX = 7;

// 桌機：輸入小卡從景深 translateZ(-200px) 飛到 translateZ(70px)（外層已在 70px，內層由 -270 → 0）
const flyIn: Variants = {
  hidden: { opacity: 0, z: -270 },
  show: (d: number = 0) => ({
    opacity: 1,
    z: 0,
    transition: { duration: CARD_FLY, ease: EASE, delay: d },
  }),
};

// 手機版小卡：淡入上移
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: d },
  }),
};

// 手機主圖是 LCP：與 H1 同時開始淡入（SSR 時是 opacity 0，延遲越長 LCP 越晚）
const phoneEnter: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.2 } },
};

const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: LINE_DURATION, ease: EASE, delay: LINE_START }, opacity: { duration: 0.01, delay: LINE_START } },
  },
};

const lineDot: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE, delay: LINE_START + LINE_DURATION * 0.9 } },
};

interface HeroCinemaProps {
  copy: HomeCopy['hero'];
}

/**
 * 定位：左文右舞台。右邊是試穿結果的實機畫面（掃描顯影），左側在景深前方浮著
 * 兩張「輸入」小卡（全身照 + 商品平拍），讀起來是「一張全身照＋商品照 → 試穿結果」。
 * 桌機：舞台跟著游標 spring 傾斜；捲出時舞台縮小下沉、文字上移（GSAP scrub）。
 */
export function HeroCinema({ copy }: HeroCinemaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stageExitRef = useRef<HTMLDivElement>(null);
  const cardColumnRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const tiltEnabled = useRef(false);
  const [scanned, setScanned] = useState(false);
  const [connectorLen, setConnectorLen] = useState(CONNECTOR_FALLBACK);

  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  // reduced motion 交給 MotionConfig（不在這裡分支 initial，避免 SSR/client hydration mismatch）
  const enter = { initial: 'hidden' as const, animate: 'show' as const };

  // 傾斜只在桌機、能 hover 的精準指標、非 reduced motion 時啟用
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: 1024px) and ${FINE_POINTER_QUERY} and (prefers-reduced-motion: no-preference)`);
    const sync = () => {
      tiltEnabled.current = mq.matches;
      if (!mq.matches) {
        rotateX.set(0);
        rotateY.set(0);
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [rotateX, rotateY]);

  // 連接線長度＝小卡欄與手機之間的 margin，再補上景深：小卡欄在 translateZ(70px)，投影後會往外放大，
  // 線（同在 70px 平面）要多畫 手機寬/2 × 70/1400，光點才會剛好落在手機（z = 0）的左緣
  useEffect(() => {
    const column = cardColumnRef.current;
    const phone = phoneRef.current;
    if (!column || !phone) return;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(column).marginRight) || 0;
      const len = gap + (phone.offsetWidth / 2) * (CARD_DEPTH / STAGE_PERSPECTIVE);
      setConnectorLen(Math.round(len * 10) / 10);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(phone);
    return () => ro.disconnect();
  }, []);

  // 捲出 hero：舞台 scale 1 → .92、y 0 → 80，文字欄 y 0 → -40（桌機才有）
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageExitRef.current;
    const text = textRef.current;
    if (!section || !stage || !text) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      });
      tl.to(stage, { scale: 0.92, y: 80, ease: 'none' }, 0).to(text, { y: -40, ease: 'none' }, 0);
    });
    return () => mm.revert();
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!tiltEnabled.current || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(Math.max(-1, Math.min(1, px * 2)) * TILT_MAX);
    rotateX.set(-Math.max(-1, Math.min(1, py * 2)) * TILT_MAX);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#FAFAFA]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* 背景：CSS 光暈墊底（WebGL 不可用時露出），絲綢光場蓋在上面 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-[-15%] top-[5%] h-[40vh] w-[80vw] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[5%] right-[-15%] h-[40vh] w-[80vw] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] blur-3xl" />
        <SilkField intensity={0.7} />
      </div>
      {/* 可讀性遮罩：桌機只壓左半（文字欄），手機壓中上段；底緣淡回畫布色，與下一段無接縫 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(250,250,250,0.92)_20%,rgba(250,250,250,0)_70%)] lg:bg-[radial-gradient(ellipse_at_28%_50%,#FAFAFA_25%,rgba(250,250,250,0)_68%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#FAFAFA]" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-16 px-6 pb-16 pt-28 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-16">
        {/* 文字欄：手機版置中，桌機靠左。GSAP 的離場位移放在這層，進場動畫在子元素上 */}
        <div ref={textRef} className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="cjk-punct mb-8 font-serif text-[clamp(3rem,1.6rem+6.4vw,7rem)] font-black leading-[1.06] tracking-[-0.02em] text-[#101828] md:mb-10">
            {copy.titleLines.map((line, i) => (
              <span key={line} className={`hero-line block ${i > 0 ? '[animation-delay:0.12s]' : ''}`}>
                {line}
              </span>
            ))}
          </h1>

          <p className="hero-enter mb-0 max-w-xl text-balance text-base font-medium leading-relaxed text-[#475467] [animation-delay:0.3s] md:text-xl">
            {clauseWrap(copy.sub)}
          </p>

          <p className="hero-enter mb-0 mt-4 max-w-xl text-balance text-sm leading-relaxed text-[#475467] [animation-delay:0.4s] md:text-base">
            {keepRanges(copy.service)}
          </p>

          <div className="hero-enter mt-10 flex w-full flex-col gap-3 [animation-delay:0.55s] sm:w-auto sm:flex-row md:mt-12 md:gap-4">
            <Magnetic>
              <Link href="/business" onClick={() => trackCTA('hero_business')} className="btn-primary w-full text-base">
                {copy.ctaPrimary}
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/download"
                onClick={() => trackCTA('hero_download')}
                className="focus-ring inline-flex w-full items-center justify-center rounded-full border border-[#101828]/10 bg-white/70 px-9 py-4 text-base font-semibold text-[#101828] backdrop-blur-md transition-colors duration-300 hover:bg-white"
              >
                {copy.ctaSecondary}
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* 視覺欄：輸入小卡 → 試穿結果。外層吃 GSAP 離場，中層是 perspective，內層跟游標傾斜 */}
        <div className="flex justify-center lg:justify-end">
          <div ref={stageExitRef} className="relative">
            <div className="lg:[perspective:1400px]">
              <motion.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
                {/* 景深層：手機後方的柔和光暈，傾斜時自然產生視差 */}
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 hidden aspect-square w-[150%] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_60%)] [transform:translate(-50%,-50%)_translateZ(-120px)] lg:block"
                  aria-hidden
                />

                {/* 桌機：兩張小卡直排在手機左側、景深前方 70px，中間「+」，再用一條細線接到手機 */}
                <div
                  ref={cardColumnRef}
                  className="absolute right-full top-1/2 mr-12 hidden [transform-style:preserve-3d] [transform:translateY(-50%)_translateZ(70px)] lg:block"
                >
                  <div className="flex w-24 flex-col items-center [transform-style:preserve-3d] xl:w-28">
                    <motion.div variants={flyIn} {...enter} custom={VISUAL_START} className="w-full">
                      <InputCard name="modelA" sizes="112px" />
                    </motion.div>
                    {/* 「+」那一列從小卡欄右緣拉一條水平細線到手機左緣：全身照＋商品照 → 試穿結果 */}
                    <motion.span
                      variants={fadeUp}
                      {...enter}
                      custom={VISUAL_START + 0.3}
                      className="relative my-2 flex w-full justify-center"
                      aria-hidden
                    >
                      <span className="text-xl font-light leading-none text-[#2563EB]">+</span>
                      <svg
                        className="absolute left-full top-1/2 -translate-y-1/2 overflow-visible"
                        width={connectorLen}
                        height={8}
                        viewBox={`0 0 ${connectorLen} 8`}
                        fill="none"
                      >
                        {/* 水平直線的 bounding box 高度為 0，objectBoundingBox 漸層不會畫，所以用 userSpaceOnUse */}
                        <defs>
                          <linearGradient id="hero-connector" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2={connectorLen} y2="4">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                        <motion.path
                          d={`M0 4 H${connectorLen}`}
                          stroke="url(#hero-connector)"
                          strokeWidth={1.25}
                          strokeLinecap="round"
                          variants={drawLine}
                          {...enter}
                        />
                      </svg>
                      {/* 線尾的光點：圓心落在手機左緣 */}
                      <motion.span
                        className="absolute left-full top-1/2 -ml-[3.5px] -mt-[3.5px] h-[7px] w-[7px] rounded-full bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        style={{ x: connectorLen }}
                        variants={lineDot}
                        {...enter}
                      />
                    </motion.span>
                    <motion.div variants={flyIn} {...enter} custom={VISUAL_START + 0.12} className="w-full">
                      <InputCard name="productWhiteShirt" sizes="112px" />
                    </motion.div>
                  </div>
                </div>

                <motion.div ref={phoneRef} variants={phoneEnter} initial="hidden" animate="show">
                  {/* 掃描完成後才開始待機漂浮（只在桌機、非 reduced motion） */}
                  <div className={scanned ? 'lg:motion-safe:animate-float-y' : ''}>
                    <PhoneFrame className="w-[64vw] max-w-[280px] lg:w-[min(300px,calc((100svh_-_15rem)_*_0.46))] lg:max-w-none xl:w-[min(330px,calc((100svh_-_15rem)_*_0.46))]">
                      <ScanReveal delay={0.55} onDone={() => setScanned(true)}>
                        <AppScreen
                          name="tryonSimple"
                          framed={false}
                          priority
                          sizes="(min-width: 1280px) 330px, (min-width: 1024px) 300px, min(64vw, 280px)"
                        />
                      </ScanReveal>
                    </PhoneFrame>
                  </div>
                </motion.div>

                {/* 手機版：兩張小卡縮成手機上緣左右兩側的小圓角圖，不畫連接線 */}
                <motion.div variants={fadeUp} {...enter} custom={VISUAL_START + 0.15} className="absolute -left-9 top-10 w-[72px] lg:hidden">
                  <InputCard name="modelA" sizes="72px" />
                </motion.div>
                <motion.div variants={fadeUp} {...enter} custom={VISUAL_START + 0.25} className="absolute -right-9 top-10 w-[72px] lg:hidden">
                  <InputCard name="productWhiteShirt" sizes="72px" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
