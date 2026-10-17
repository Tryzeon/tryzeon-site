'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, MessageCircle, QrCode, Smartphone, type LucideIcon } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap } from '@/components/clauseWrap';
import { APP_IMAGES } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { EASE } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// SSR 時 useLayoutEffect 會警告；server 上本來就什麼都不做
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// 順序對應 copy.home.brands.channels
const CHANNEL_ICONS: readonly LucideIcon[] = [Smartphone, MessageCircle, Globe, QrCode];

// 桌機舞台：0 左上、1 右上、2 左下、3 右下（DOM 順序維持 copy 順序）
const NODE_PLACEMENT = [
  'lg:col-start-1 lg:row-start-1 lg:self-start',
  'lg:col-start-3 lg:row-start-1 lg:self-start',
  'lg:col-start-1 lg:row-start-2 lg:self-end',
  'lg:col-start-3 lg:row-start-2 lg:self-end',
] as const;

// 「上線」pill 的兩個狀態；SSR 輸出的是點亮後的樣子，GSAP 從未點亮開始補間
const PILL_IDLE = { color: '#667085', borderColor: 'rgba(16,24,40,0.1)' } as const;
const PILL_LIT = { color: '#0E7490', borderColor: 'rgba(6,182,212,0.3)' } as const;
const PILL_DOT_IDLE = '#98A2B3';
const PILL_DOT_LIT = '#06B6D4';

const SVG_ID = 'channel-dispatch';

// 手機／平板的進場；桌機由 GSAP 控制內層元素，兩者不碰同一個節點
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: d } }),
};

interface ChannelSyncProps {
  copy: HomeCopy['brands'];
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 以 offsetLeft/Top 量相對位置：不受 transform（進場位移、縮放）影響 */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** 點亮一個通路節點：藍框光暈浮現、pill 由灰轉青並脈衝一次 */
function lightUp(tl: gsap.core.Timeline, node: HTMLElement, at: number, dur: number) {
  const lit = node.querySelector('[data-lit]');
  const pill = node.querySelector('[data-pill]');
  const pillDot = node.querySelector('[data-pill-dot]');
  if (lit) tl.fromTo(lit, { opacity: 0 }, { opacity: 1, duration: dur, ease: 'power2.out' }, at);
  if (pill) {
    tl.fromTo(pill, { ...PILL_IDLE }, { ...PILL_LIT, duration: dur }, at);
    tl.to(pill, { scale: 1.15, duration: dur / 2, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at);
  }
  if (pillDot) tl.fromTo(pillDot, { backgroundColor: PILL_DOT_IDLE }, { backgroundColor: PILL_DOT_LIT, duration: dur }, at);
}

/**
 * 四通路總覽「Dispatch」：一張商品卡沿線路同步到四個已上線的通路。
 * 桌機 pin 住一個 100vh 舞台以捲動 scrub；手機／平板直排，一條直線隨捲動畫下。
 * 品牌端怎麼上架（三種方式＋後台畫面）只在 /business 說明。
 */
export function ChannelSync({ copy }: ChannelSyncProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardEnterRef = useRef<HTMLDivElement>(null);
  const cardGlassRef = useRef<HTMLDivElement>(null);
  const pathsSvgRef = useRef<SVGSVGElement>(null);
  const lineSvgRef = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const field = fieldRef.current;
    const header = headerRef.current;
    const card = cardRef.current;
    const cardEnter = cardEnterRef.current;
    const cardGlass = cardGlassRef.current;
    const svg = pathsSvgRef.current;
    const lineSvg = lineSvgRef.current;
    if (!section || !stage || !field || !header || !card || !cardEnter || !cardGlass || !svg || !lineSvg) return;

    const nodes = Array.from(section.querySelectorAll<HTMLElement>('[data-node]'));
    const nodeInners = nodes.map((n) => n.querySelector<HTMLElement>('[data-node-inner]'));
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-path]'));
    const grads = Array.from(svg.querySelectorAll<SVGLinearGradientElement>('[data-grad]'));
    const dots = Array.from(svg.querySelectorAll<SVGGElement>('[data-dot]'));
    const linePath = lineSvg.querySelector<SVGPathElement>('path');
    // 每顆光點在線上的位置（0 = 中央卡、1 = 節點）；靜態／減少動態時停在節點
    const progress = nodes.map(() => 1);

    const placeDot = (i: number) => {
      const path = paths[i];
      const dot = dots[i];
      if (!path || !dot) return;
      const len = path.getTotalLength();
      if (!len) return;
      const pt = path.getPointAtLength(len * progress[i]);
      dot.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    };

    // 依實際的卡片位置寫出四條貝茲曲線：中央卡左右兩側 → 節點內側
    const layout = () => {
      const w = field.offsetWidth;
      const h = field.offsetHeight;
      if (!w || !h) return;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const c = offsetWithin(card, field);
      nodes.forEach((node, i) => {
        const path = paths[i];
        const grad = grads[i];
        if (!path || !grad) return;
        const n = offsetWithin(node, field);
        const left = i % 2 === 0;
        const top = i < 2;
        const sx = left ? c.x : c.x + c.w;
        const sy = c.y + c.h * (top ? 0.4 : 0.6);
        const ex = left ? n.x + n.w : n.x;
        const ey = n.y + n.h * (top ? 0.62 : 0.38);
        const k = Math.max(24, Math.abs(sx - ex) * 0.6) * (left ? -1 : 1);
        path.setAttribute(
          'd',
          `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${(sx + k).toFixed(1)} ${sy.toFixed(1)}, ${(ex - k).toFixed(1)} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        );
        grad.setAttribute('x1', sx.toFixed(1));
        grad.setAttribute('y1', sy.toFixed(1));
        grad.setAttribute('x2', ex.toFixed(1));
        grad.setAttribute('y2', ey.toFixed(1));
        placeDot(i);
      });
    };

    layout();
    const ro = new ResizeObserver(() => layout());
    [field, header, card, ...nodes].forEach((el) => ro.observe(el));
    ScrollTrigger.addEventListener('refresh', layout);

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
        // 跨過 sm（單欄 ↔ 兩欄）時重建，讓點亮時機跟著卡片位置
        sm: '(min-width: 640px)',
      },
      (ctx) => {
        const cond = ctx.conditions ?? {};

        if (cond.desktop) {
          // 進場（pin 之前）：中央卡從景深浮出，舞台到頂時已就位
          gsap.fromTo(
            cardEnter,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: stage, start: 'top 85%', end: 'top 15%', scrub: 0.6 },
            },
          );

          gsap.set(paths, { opacity: 0.35 });
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: '+=160%',
              pin: true,
              pinSpacing: true,
              scrub: 0.6,
              anticipatePin: 1,
            },
          });

          // 0–0.15：四條線依序畫出
          paths.forEach((path, i) => {
            tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.06, ease: 'power1.inOut' }, i * 0.03);
          });

          // 0.15–0.75：光點沿線抵達節點，節點立起並點亮
          nodes.forEach((node, i) => {
            const start = 0.15 + i * 0.08;
            const travel = 0.36;
            const arrive = start + travel;
            const proxy = { p: 0 };
            progress[i] = 0;
            const dot = dots[i];
            if (dot) tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.03 }, start);
            tl.fromTo(
              proxy,
              { p: 0 },
              {
                p: 1,
                duration: travel,
                ease: 'power1.inOut',
                onUpdate: () => {
                  progress[i] = proxy.p;
                  placeDot(i);
                },
              },
              start,
            );
            const inner = nodeInners[i];
            if (inner) {
              tl.fromTo(inner, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, arrive - 0.14);
            }
            lightUp(tl, node, arrive, 0.05);
          });

          // 0.8–1：全部點亮後中央卡微微縮回、線路轉實，舞台靜止
          tl.to(cardGlass, { scale: 0.96, duration: 0.2, ease: 'power2.out' }, 0.8);
          tl.to(paths, { opacity: 0.6, duration: 0.2 }, 0.8);

          nodes.forEach((_, i) => placeDot(i));
        } else if (cond.mobile && linePath) {
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: lineSvg, start: 'top 80%', end: 'bottom 60%', scrub: 0.6 },
          });
          tl.fromTo(linePath, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, 0);
          // 直線畫到哪張卡，哪張卡就點亮
          const box = lineSvg.getBoundingClientRect();
          nodes.forEach((node) => {
            const r = node.getBoundingClientRect();
            const at = box.height ? gsap.utils.clamp(0, 0.94, (r.top + r.height * 0.4 - box.top) / box.height) : 0;
            lightUp(tl, node, at, 0.06);
          });
        }

        return () => {
          progress.fill(1);
          nodes.forEach((_, i) => placeDot(i));
        };
      },
      section,
    );

    return () => {
      mm.revert();
      ro.disconnect();
      ScrollTrigger.removeEventListener('refresh', layout);
    };
  }, []);

  return (
    <section id="brands" ref={sectionRef} className="relative bg-[#FAFAFA] py-24 md:py-36 lg:py-0">
      <div
        ref={stageRef}
        className="relative lg:h-screen lg:pb-[clamp(1.25rem,4vh,3rem)] lg:pt-[clamp(5.5rem,12vh,8rem)]"
      >
        <div
          ref={fieldRef}
          className="relative mx-auto max-w-7xl px-6 md:px-12 lg:flex lg:h-full lg:flex-col lg:items-center lg:justify-between"
        >
          {/* 桌機線路：路徑與光點，d 由 layout() 依實際位置寫入 */}
          <svg
            ref={pathsSvgRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[3] hidden h-full w-full overflow-visible lg:block"
          >
            <defs>
              {copy.channels.map((channel, i) => (
                <linearGradient key={channel.name} id={`${SVG_ID}-g${i}`} data-grad gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#2563EB" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              ))}
              <radialGradient id={`${SVG_ID}-dot`}>
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="0.45" stopColor="#60A5FA" />
                <stop offset="1" stopColor="#06B6D4" />
              </radialGradient>
              <filter id={`${SVG_ID}-glow`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            {copy.channels.map((channel, i) => (
              <path
                key={channel.name}
                data-path
                fill="none"
                stroke={`url(#${SVG_ID}-g${i})`}
                strokeWidth={1.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 2"
                strokeDashoffset={0}
                opacity={0.6}
              />
            ))}
            {copy.channels.map((channel) => (
              <g key={channel.name} data-dot>
                <circle r={12} fill="#60A5FA" opacity={0.35} filter={`url(#${SVG_ID}-glow)`} />
                <circle r={5} fill={`url(#${SVG_ID}-dot)`} />
              </g>
            ))}
          </svg>

          <div ref={headerRef} className="relative z-[2] lg:max-w-[calc(100%_-_508px)] xl:max-w-[calc(100%_-_584px)]">
            <SectionHeader title={copy.title} lede={copy.lede} spacing="mb-12 md:mb-16 lg:mb-0" />
          </div>

          {/* 中央商品卡：上架一次的那一件 */}
          <motion.div
            ref={cardRef}
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative z-[2] mx-auto w-full max-w-[300px] lg:mx-0 lg:w-[min(240px,30vh)] xl:w-[min(300px,34vh)]"
          >
            <div ref={cardEnterRef}>
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(96,165,250,0.22),rgba(207,250,254,0.12)_60%,transparent)]"
              />
              <div
                ref={cardGlassRef}
                className="rounded-3xl border border-white/60 bg-white/70 p-3 shadow-[0_40px_100px_rgba(16,24,40,0.18)] backdrop-blur-xl"
              >
                <div className="relative aspect-[6/5] overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={APP_IMAGES.productWhiteShirt.src}
                    width={APP_IMAGES.productWhiteShirt.width}
                    height={APP_IMAGES.productWhiteShirt.height}
                    alt={siteCopy.images.productWhiteShirt}
                    sizes="(min-width: 1280px) 300px, 280px"
                    className="h-full w-full object-cover"
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                </div>
                <div className="mt-3 flex items-center justify-center gap-2" aria-hidden>
                  {CHANNEL_ICONS.map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101828] text-white"
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative mt-10 md:mt-12 lg:static lg:contents">
            {/* 手機／平板：從中央卡底部往下穿過四張卡的直線 */}
            <svg
              ref={lineSvgRef}
              aria-hidden
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -top-10 left-1/2 h-[calc(100%_+_2.5rem)] w-[2px] -translate-x-1/2 md:-top-12 md:h-[calc(100%_+_3rem)] lg:hidden"
            >
              <defs>
                <linearGradient id={`${SVG_ID}-line`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
                  <stop offset="0" stopColor="#2563EB" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <path
                d="M 1 0 V 100"
                fill="none"
                stroke={`url(#${SVG_ID}-line)`}
                strokeWidth={1.5}
                pathLength={1}
                strokeDasharray="1 2"
                strokeDashoffset={0}
                opacity={0.55}
              />
            </svg>

            <ul className="relative z-[1] grid gap-4 sm:grid-cols-2 lg:absolute lg:inset-x-12 lg:inset-y-0 lg:grid-cols-[230px_minmax(0,1fr)_230px] lg:grid-rows-2 lg:gap-x-6 lg:gap-y-0 xl:grid-cols-[260px_minmax(0,1fr)_260px] xl:gap-x-8">
              {copy.channels.map((channel, i) => {
                const Icon = CHANNEL_ICONS[i];
                return (
                  <motion.li
                    key={channel.name}
                    data-node
                    variants={rise}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    custom={(i % 2) * 0.08}
                    className={`relative ${NODE_PLACEMENT[i]}`}
                  >
                    <div
                      data-node-inner
                      className="relative h-full rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_8px_32px_rgba(16,24,40,0.08)] backdrop-blur-xl lg:p-5 xl:p-6"
                    >
                      <span
                        data-lit
                        aria-hidden
                        className="pointer-events-none absolute -inset-px rounded-3xl border border-[#2563EB]/40 shadow-[0_12px_40px_rgba(37,99,235,0.22)]"
                      />
                      <div className="relative flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101828] text-white lg:h-10 lg:w-10 xl:h-11 xl:w-11">
                          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                        </span>
                        <span
                          data-pill
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]"
                        >
                          <span data-pill-dot className="h-1.5 w-1.5 rounded-full bg-[#06B6D4]" aria-hidden />
                          {copy.status}
                        </span>
                      </div>
                      <h3 className="relative mt-6 text-lg font-semibold text-[#101828] lg:mt-4 lg:text-base xl:text-lg">
                        {channel.name}
                      </h3>
                      <p className="relative mt-2 text-balance text-sm leading-relaxed text-[#475467] md:text-base lg:text-sm xl:text-[0.9375rem]">
                        {clauseWrap(channel.desc)}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="relative z-[2] mt-12 text-center lg:mt-0">
            <MoreLink href="/business">{copy.link}</MoreLink>
          </div>
        </div>
      </div>
    </section>
  );
}
