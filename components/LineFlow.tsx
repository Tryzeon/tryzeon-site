'use client';

import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { keepRanges } from '@/components/clauseWrap';
import { LINE_OA_QR_SRC } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { EASE, fadeUpItem, inView } from '@/lib/motion';

interface LineFlowProps {
  copy: HomeCopy['line'];
}

interface Point {
  x: number;
  y: number;
}

type Mode = 'none' | 'desktop' | 'mobile' | 'static';

// SSR 時 useLayoutEffect 會警告；server 上本來就什麼都不做
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const DESKTOP = '(min-width: 1024px)';
const MOBILE = '(max-width: 1023.98px)';
const REDUCE = '(prefers-reduced-motion: reduce)';
/** 絲線起伏：貝茲控制點的偏移，實際波峰約為 0.29 倍（≈ 24px） */
const WAVE = 84;
const LUT_STEPS = 160;
/** 站的「到位」帶：站中心離視窗中央 ≤ 12vw 全亮，≥ 22vw 退到 .45 */
const FOCUS_FULL = 0.12;
const FOCUS_FADE = 0.1;

const stationEnter: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** 以 offsetLeft/Top 累加到 ancestor——不受 transform（軌道位移、進場 y）影響 */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { x, y };
}

/** 橫向正弦絲線：節點落在零點上，每段一個完整起伏；較短的段等比縮小振幅，節點處保持平滑 */
function wavePath(points: Point[], endX: number): string {
  const y = points[0].y;
  const xs = [0, ...points.map((p) => p.x), endX];
  const ref = points.length > 1 ? points[1].x - points[0].x : endX;
  let d = `M 0 ${y}`;
  for (let k = 1; k < xs.length; k++) {
    const a = xs[k - 1];
    const dx = xs[k] - a;
    if (dx <= 0) continue;
    const amp = WAVE * Math.min(1, dx / ref);
    d += ` C ${a + dx / 3} ${y - amp} ${a + (2 * dx) / 3} ${y + amp} ${xs[k]} ${y}`;
  }
  return d;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** LINE 試穿流程：桌機為釘住的橫向軌道＋一條絲線穿過五站；手機／平板為直排時間軸 */
export function LineFlow({ copy }: LineFlowProps) {
  const gradId = `line-thread-${useId().replace(/:/g, '')}`;
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  const railRef = useRef<SVGPathElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    const glow = glowRef.current;
    const track = trackRef.current;
    const list = listRef.current;
    const svg = svgRef.current;
    const grad = gradRef.current;
    const rail = railRef.current;
    const thread = threadRef.current;
    const tip = tipRef.current;
    if (!stage || !glow || !track || !list || !svg || !grad || !rail || !thread || !tip) return;

    gsap.registerPlugin(ScrollTrigger);
    const pick = (sel: string) => Array.from(list.querySelectorAll<HTMLElement>(sel));
    const stations = pick('[data-station]');
    const bodies = pick('[data-station-body]');
    const nodes = pick('[data-node]');
    const lits = pick('[data-node-lit]');
    const halos = pick('[data-node-halo]');
    if (!nodes.length) return;

    const g = {
      mode: 'none' as Mode,
      progress: 0,
      length: 0,
      axis: [] as number[],
      nodeLen: [] as number[],
      centers: [] as number[],
      base: 0,
      travel: 0,
    };

    // 沿主軸（桌機 x、手機 y）的座標 → 路徑長度，查表內插
    const lengthAt = (v: number) => {
      const a = g.axis;
      const n = a.length;
      if (n < 2 || v <= a[0]) return 0;
      if (v >= a[n - 1]) return g.length;
      let lo = 0;
      let hi = n - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (a[mid] <= v) lo = mid;
        else hi = mid;
      }
      const t = (v - a[lo]) / (a[hi] - a[lo] || 1);
      return ((lo + t) / (n - 1)) * g.length;
    };

    const measure = () => {
      const horizontal = window.matchMedia(DESKTOP).matches;
      const w = track.offsetWidth;
      const h = track.offsetHeight;
      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

      const pts = nodes.map((n) => {
        const o = offsetWithin(n, track);
        return { x: o.x + n.offsetWidth / 2, y: o.y + n.offsetHeight / 2 };
      });
      const last = pts[pts.length - 1];
      const d = horizontal ? wavePath(pts, w) : `M ${pts[0].x} ${pts[0].y} L ${pts[0].x} ${last.y}`;
      rail.setAttribute('d', d);
      thread.setAttribute('d', d);
      grad.setAttribute('x2', String(horizontal ? w : 0));
      grad.setAttribute('y2', String(horizontal ? 0 : Math.max(1, h)));

      g.length = thread.getTotalLength();
      thread.style.strokeDasharray = `${g.length} ${g.length}`;
      g.axis = Array.from({ length: LUT_STEPS + 1 }, (_, i) => {
        const p = thread.getPointAtLength((i / LUT_STEPS) * g.length);
        return horizontal ? p.x : p.y;
      });
      g.nodeLen = pts.map((p) => lengthAt(horizontal ? p.x : p.y));
      g.centers = stations.map((li) => offsetWithin(li, track).x + li.offsetWidth / 2);
      g.base = offsetWithin(track, stage).x;
      g.travel = Math.max(0, g.base + w - window.innerWidth);
    };

    const drawTo = (len: number, showTip: boolean) => {
      thread.style.strokeDashoffset = String(g.length - len);
      const pt = thread.getPointAtLength(len);
      tip.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      tip.style.opacity = showTip && g.length > 0 ? '1' : '0';
      lits.forEach((el, i) => {
        el.style.opacity = len >= (g.nodeLen[i] ?? Infinity) - 0.5 ? '1' : '0';
      });
    };

    const paint = () => {
      if (g.mode === 'desktop') {
        const x = -g.travel * g.progress;
        const vw = window.innerWidth;
        track.style.transform = `translate3d(${x}px, 0, 0)`;
        glow.style.transform = `translate3d(${x * 0.4}px, 0, 0)`;
        // 線頭永遠停在視窗中央對到的那一點
        drawTo(lengthAt(vw / 2 - g.base - x), true);
        bodies.forEach((el, i) => {
          const dist = Math.abs(g.base + (g.centers[i] ?? 0) + x - vw / 2) / vw;
          const f = clamp01((FOCUS_FULL + FOCUS_FADE - dist) / FOCUS_FADE);
          el.style.opacity = String(0.45 + 0.55 * f);
          el.style.transform = `scale(${0.96 + 0.04 * f})`;
          if (halos[i]) halos[i].style.opacity = lits[i]?.style.opacity === '1' ? String(f) : '0';
        });
      } else if (g.mode === 'mobile') {
        drawTo(g.length * g.progress, false);
      } else if (g.mode === 'static') {
        drawTo(g.length, false);
      }
    };

    const reset = () => {
      g.mode = 'none';
      g.progress = 0;
      [track, glow, ...bodies].forEach((el) => {
        el.style.transform = '';
        el.style.opacity = '';
      });
      halos.forEach((el) => (el.style.opacity = ''));
    };

    // 每次 refresh（resize、版面變動）前重新量測站點位置
    const onRefreshInit = () => measure();
    const onRefresh = () => paint();
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit);
    ScrollTrigger.addEventListener('refresh', onRefresh);

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP, mobile: MOBILE, reduce: REDUCE }, (ctx) => {
      const c = ctx.conditions ?? {};
      measure();
      if (c.reduce) {
        g.mode = 'static';
        paint();
        return reset;
      }
      const sync = (self: ScrollTrigger) => {
        g.progress = self.progress;
        paint();
      };
      if (c.desktop) {
        g.mode = 'desktop';
        ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 2)}`,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: sync,
          onRefresh: sync,
        });
      } else {
        g.mode = 'mobile';
        ScrollTrigger.create({
          trigger: list,
          start: 'top 80%',
          end: 'bottom 60%',
          invalidateOnRefresh: true,
          onUpdate: sync,
          onRefresh: sync,
        });
      }
      paint();
      return reset;
    });

    // 字型載入、換行等改變站點高度時重新量測（refreshInit 會呼叫 measure）
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(list);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      mm.revert();
    };
  }, []);

  return (
    <section id="line" className="relative bg-[#FAFAFA] py-24 md:py-36 lg:pt-0">
      {/* 包一層讓 GSAP 的 pin-spacer 只動到這個 div 的子節點，不碰 React 管的 section */}
      <div>
        <div
          ref={stageRef}
          className="relative lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden lg:pb-6 lg:pt-20 lg:motion-reduce:h-auto lg:motion-reduce:pt-36"
        >
          {/* 軌道背後的天藍光暈，以 0.4 倍速視差 */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute left-[30vw] top-[calc(50%-24vw)] hidden h-[56vw] w-[56vw] rounded-full bg-[radial-gradient(circle,#DBEAFE_0%,rgba(219,234,254,0.55)_38%,rgba(219,234,254,0)_68%)] will-change-transform lg:block"
            aria-hidden
          />

          <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
            <SectionHeader title={copy.title} lede={copy.lede} />
          </div>

          <div className="px-6 md:px-12 lg:px-0">
            <div
              ref={trackRef}
              className="relative mx-auto max-w-md sm:max-w-xl lg:will-change-transform lg:mx-0 lg:w-max lg:max-w-none lg:px-[33vw] lg:motion-reduce:mx-auto lg:motion-reduce:w-auto lg:motion-reduce:max-w-7xl lg:motion-reduce:px-12"
            >
              {/* 絲線：路徑、尺寸由量測到的節點位置決定（見 measure） */}
              <svg
                ref={svgRef}
                className="pointer-events-none absolute left-0 top-0 overflow-visible"
                width="0"
                height="0"
                fill="none"
                aria-hidden
                focusable="false"
              >
                <defs>
                  <linearGradient id={gradId} ref={gradRef} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#2563EB" />
                    <stop offset="0.5" stopColor="#60A5FA" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                  <radialGradient id={`${gradId}-halo`}>
                    <stop offset="0" stopColor="#06B6D4" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path ref={railRef} stroke="#2563EB" strokeOpacity="0.14" strokeWidth="1.5" />
                <path ref={threadRef} stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round" />
                <g ref={tipRef} className="hidden opacity-0 lg:block">
                  <circle r="18" fill={`url(#${gradId}-halo)`} />
                  <circle r="5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                </g>
              </svg>

              <ol
                ref={listRef}
                role="list"
                className="relative grid gap-12 lg:flex lg:gap-10 lg:motion-reduce:gap-8"
              >
                {copy.steps.map((item, i) => (
                  <motion.li
                    key={item.title}
                    data-station
                    variants={stationEnter}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className="relative pl-10 lg:w-[34vw] lg:shrink-0 lg:pl-0 lg:motion-reduce:w-auto lg:motion-reduce:min-w-0 lg:motion-reduce:flex-1"
                  >
                    {/* 背景水印數字 */}
                    <span
                      className="pointer-events-none absolute right-[10%] top-12 hidden select-none font-serif text-[7rem] font-black leading-none lining-nums text-[#2563EB]/15 lg:block"
                      aria-hidden
                    >
                      {i + 1}
                    </span>

                    {/* 節點：手機是細線上的小圓點；桌機是穿在絲線上的珠子，帶實色數字。絲線抵達時點亮 */}
                    <span
                      data-node
                      className="absolute left-0 top-0 block h-[11px] w-[11px] rounded-full border border-[#2563EB]/30 bg-white lg:relative lg:flex lg:h-10 lg:w-10 lg:items-center lg:justify-center lg:border-[#2563EB]/25 lg:shadow-[0_4px_14px_rgba(16,24,40,0.06)]"
                      aria-hidden
                    >
                      <span
                        data-node-halo
                        className="pointer-events-none absolute -inset-3 hidden rounded-full bg-[#60A5FA]/30 opacity-0 blur-md lg:block"
                      />
                      <span className="relative hidden font-serif text-base font-black leading-none lining-nums text-[#2563EB] lg:block">
                        {i + 1}
                      </span>
                      <span
                        data-node-lit
                        className="absolute -inset-px flex items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] opacity-0 shadow-[0_0_0_2px_#FFFFFF,0_0_0_3px_rgba(37,99,235,0.25)] transition-opacity duration-500 lg:shadow-[0_0_0_3px_#FFFFFF,0_8px_24px_rgba(37,99,235,0.35)]"
                      >
                        <span className="hidden font-serif text-base font-black leading-none lining-nums text-white lg:block">
                          {i + 1}
                        </span>
                      </span>
                    </span>

                    <div data-station-body className="relative origin-top-left lg:mt-7 lg:max-w-[26rem] lg:pr-8">
                      <span
                        className="-mt-1.5 block font-serif text-4xl font-black leading-none lining-nums text-[#2563EB] lg:hidden"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-[#101828] lg:mt-0 lg:text-2xl">{item.title}</h3>
                      {item.quote && (
                        <p className="cjk-punct relative mb-0 mt-4 inline-block rounded-[22px] rounded-bl-md border border-[#E4E7EC] bg-white px-5 py-3 font-serif text-lg font-semibold leading-snug text-[#101828] shadow-[0_8px_24px_rgba(16,24,40,0.06)] xl:text-xl">
                          {item.quote}
                          {/* 左下的小尾巴 */}
                          <span
                            className="absolute -bottom-[5px] left-3 h-2.5 w-2.5 rotate-45 border-b border-r border-[#E4E7EC] bg-white"
                            aria-hidden
                          />
                        </p>
                      )}
                      <p className="mb-0 mt-3 text-balance text-sm leading-relaxed text-[#475467] md:text-base">
                        {keepRanges(item.desc)}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* 親自試試：加入 Tryzeon 的 LINE 官方帳號走一遍流程；桌機附 QR Code（電腦上點連結無法加好友） */}
        <motion.div
          variants={fadeUpItem}
          {...inView}
          className="mx-auto mt-16 md:mt-20 flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-white/60 bg-white/70 p-7 text-center shadow-[0_8px_32px_rgba(16,24,40,0.06)] backdrop-blur-xl md:p-9 lg:flex-row lg:text-left"
        >
          <figure className="hidden shrink-0 lg:block">
            <Image src={LINE_OA_QR_SRC} width={112} height={112} alt={copy.tryIt.qrAlt} unoptimized />
            <figcaption className="mt-2 text-center text-xs text-[#475467]">{copy.tryIt.qrCaption}</figcaption>
          </figure>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-[#101828]">{copy.tryIt.title}</h3>
            <p className="mt-2 mb-0 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{copy.tryIt.desc}</p>
            <a
              href={siteCopy.contact.lineOa.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 gap-2 text-base"
            >
              {copy.tryIt.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </motion.div>

        {/* 從 /business 的導入步驟點過來的人，看完流程一鍵回到方案 */}
        <div className="mt-10 md:mt-12 text-center">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
