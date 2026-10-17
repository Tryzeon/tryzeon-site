'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, MessageCircle, QrCode, Smartphone, type LucideIcon } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { clauseWrap } from '@/components/clauseWrap';
import type { HomeCopy } from '@/lib/copy';
import { fadeUpItem as item, inView, staggerList as list } from '@/lib/motion';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// 順序對應 copy.home.brands.channels
const CHANNEL_ICONS: readonly LucideIcon[] = [Smartphone, MessageCircle, Globe, QrCode];

// 絲帶區的高度（桌機）：從 lede 下方的一個點，垂到四張卡的上緣
const ZONE_H = 168;
// 同步光每隔幾秒再跑一次（只在畫面內）
const PULSE_EVERY_S = 6.5;

interface Ribbon {
  /** 填色的絲帶外形，在每個扭轉點切段；back 是翻到背面的那幾段（顏色較深） */
  segments: { d: string; back: boolean }[];
  /** 中心線：遮罩展開與同步光都沿它走 */
  spine: string;
  /** 亮邊 */
  edge: string;
  tx: number;
}

function cubic(a: number, b: number, c: number, d: number, t: number) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}
function cubicD(a: number, b: number, c: number, d: number, t: number) {
  const u = 1 - t;
  return 3 * u * u * (b - a) + 6 * u * t * (c - b) + 3 * t * t * (d - c);
}

/** 一條從 (sx, 0) 垂到 (tx, h) 的扭轉絲帶 */
function buildRibbon(sx: number, tx: number, h: number, phase: number): Ribbon {
  const N = 72;
  const left: string[] = [];
  const right: string[] = [];
  const spine: string[] = [];
  const segments: { d: string; back: boolean }[] = [];
  let segLeft: string[] = [];
  let segRight: string[] = [];
  let segBack: boolean | null = null;
  const c1y = h * 0.62;
  const c2y = h * 0.38;
  const wMax = 30;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = cubic(sx, sx, tx, tx, t);
    const y = cubic(0, c1y, c2y, h, t);
    const dx = cubicD(sx, sx, tx, tx, t);
    const dy = cubicD(0, c1y, c2y, h, t);
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    // 扭轉：寬度 = |cos|，在褶處收成一條線；起點收攏、終點攤開貼上卡片
    const turn = Math.cos(Math.PI * (t * 1.35 + phase));
    const envelope = Math.min(1, t / 0.18) * (0.55 + 0.45 * t);
    const w = wMax * (0.06 + 0.94 * Math.abs(turn)) * envelope + 1.2;
    const l = `${(x + (nx * w) / 2).toFixed(1)},${(y + (ny * w) / 2).toFixed(1)}`;
    const r = `${(x - (nx * w) / 2).toFixed(1)},${(y - (ny * w) / 2).toFixed(1)}`;
    left.push(l);
    right.push(r);
    spine.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    // 跨過扭轉點（cos 變號）就收掉這一段、從同一點開新的一段
    const back = turn < 0;
    if (segBack !== null && back !== segBack) {
      segLeft.push(l);
      segRight.push(r);
      segments.push({ d: `M${segLeft.join('L')}L${segRight.reverse().join('L')}Z`, back: segBack });
      segLeft = [];
      segRight = [];
    }
    segBack = back;
    segLeft.push(l);
    segRight.push(r);
  }
  segments.push({ d: `M${segLeft.join('L')}L${segRight.reverse().join('L')}Z`, back: Boolean(segBack) });
  return {
    segments,
    spine: `M${spine.join('L')}`,
    edge: `M${left.join('L')}`,
    tx,
  };
}

interface ChannelSyncProps {
  copy: HomeCopy['brands'];
}

/**
 * 四通路總覽：上架一次，同步到四個已上線的通路。
 * 桌機：lede 下方一個光點，四條半透明的緞帶扭轉著垂到四張卡；捲到時緞帶依序展開，
 * 接著一道光同時沿四條走下來（依路徑比例走，長短不同也同時抵達），四個「上線」燈一起亮——就是「同步」。
 * 之後每隔一段時間再同步一次；滑到某張卡，它那條緞帶變亮、光再跑一次。
 * 手機與平板不畫緞帶，四個燈在卡片進場後一起亮。
 * 品牌端怎麼上架（三種方式＋後台畫面）只在 /business 說明。
 */
export function ChannelSync({ copy }: ChannelSyncProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLUListElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState<{ width: number; ribbons: Ribbon[] } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const runPulse = useRef<((only?: number) => void) | null>(null);

  // 依四張卡的實際位置算緞帶；只在桌機寬度、版面變動時重算
  useEffect(() => {
    const zone = zoneRef.current;
    const tiles = tilesRef.current;
    if (!zone || !tiles) return;
    const measure = () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        setGeometry(null);
        return;
      }
      const box = zone.getBoundingClientRect();
      const sx = box.width / 2;
      const ribbons = Array.from(tiles.children).map((li, i) => {
        const r = (li as HTMLElement).getBoundingClientRect();
        return buildRibbon(sx, r.left + r.width / 2 - box.left, ZONE_H, 0.12 + i * 0.21);
      });
      setGeometry({ width: box.width, ribbons });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(zone);
    return () => observer.disconnect();
  }, []);

  // 編排：展開 → 同步光 → 四燈齊亮；之後定期再同步一次
  useEffect(() => {
    const svg = svgRef.current;
    const tiles = tilesRef.current;
    if (!svg || !tiles || !geometry) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const masks = svg.querySelectorAll<SVGPathElement>('[data-reveal]');
    const pulses = svg.querySelectorAll<SVGPathElement>('[data-pulse]');
    const source = svg.querySelector<SVGGElement>('[data-source]');
    const dots = tiles.querySelectorAll<HTMLElement>('[data-sync-dot]');
    const rings = tiles.querySelectorAll<HTMLElement>('[data-sync-ring]');

    const ctx = gsap.context(() => {
      const light = (targets: HTMLElement[], ringTargets: HTMLElement[]) => {
        gsap.fromTo(targets, { scale: 1 }, { scale: 1.7, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1 });
        gsap.fromTo(ringTargets, { scale: 1, opacity: 0.55 }, { scale: 3.4, opacity: 0, duration: 1.1, ease: 'power2.out' });
      };
      const pulse = (only?: number) => {
        const lanes = only === undefined ? Array.from(pulses) : [pulses[only]];
        const lit = only === undefined ? Array.from(dots) : [dots[only]];
        const ring = only === undefined ? Array.from(rings) : [rings[only]];
        gsap.killTweensOf(lanes);
        gsap.fromTo(
          lanes,
          { strokeDashoffset: 0.14, opacity: 1 },
          {
            strokeDashoffset: -1,
            duration: 1.25,
            ease: 'power1.inOut',
            onComplete: () => {
              gsap.set(lanes, { opacity: 0 });
            },
          },
        );
        gsap.delayedCall(1.08, () => light(lit, ring));
      };
      runPulse.current = reduce ? null : pulse;

      if (reduce) {
        gsap.set(masks, { strokeDashoffset: 0 });
        gsap.set(source, { opacity: 1 });
        return;
      }

      gsap.set(masks, { strokeDashoffset: 1 });
      gsap.set(pulses, { opacity: 0 });
      gsap.set(source, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });

      // 定期同步只在卡片在畫面內時跑；可見狀態獨立追蹤，開場還沒播完就捲走也不會在背景空轉
      let repeat: gsap.core.Tween | null = null;
      let onScreen = true;
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          repeat = gsap.delayedCall(PULSE_EVERY_S, function loop() {
            pulse();
            repeat = gsap.delayedCall(PULSE_EVERY_S, loop);
            if (!onScreen) repeat.pause();
          });
          if (!onScreen) repeat.pause();
        },
      });
      tl.to(source, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' })
        .to(masks, { strokeDashoffset: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08 }, '-=0.2')
        .add(() => pulse(), '-=0.75');

      ScrollTrigger.create({
        trigger: svg,
        start: 'top 72%',
        once: true,
        onEnter: () => tl.play(),
      });
      // 離開畫面就停掉定期同步，回來再接上
      ScrollTrigger.create({
        trigger: tiles,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          onScreen = self.isActive;
          if (!repeat) return;
          if (onScreen) repeat.resume();
          else repeat.pause();
        },
      });
    }, svg);

    return () => {
      runPulse.current = null;
      ctx.revert();
    };
  }, [geometry]);

  // 手機與平板：卡片進場後四燈一起亮
  const onTilesShown = () => {
    if (geometry || !tilesRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dots = tilesRef.current.querySelectorAll<HTMLElement>('[data-sync-dot]');
    const rings = tilesRef.current.querySelectorAll<HTMLElement>('[data-sync-ring]');
    gsap.fromTo(dots, { scale: 1 }, { scale: 1.7, duration: 0.28, yoyo: true, repeat: 1, delay: 0.6 });
    gsap.fromTo(rings, { scale: 1, opacity: 0.55 }, { scale: 3.4, opacity: 0, duration: 1.1, delay: 0.6 });
  };

  const enterTile = (i: number) => {
    setHovered(i);
    runPulse.current?.(i);
  };

  return (
    <section id="brands" className="relative overflow-hidden bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} spacing="mb-14 md:mb-20 lg:mb-6" />

        <div ref={zoneRef} className="relative hidden lg:block" style={{ height: ZONE_H }} aria-hidden>
          {geometry && (
            <svg
              ref={svgRef}
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${geometry.width} ${ZONE_H}`}
              fill="none"
            >
              <defs>
                <linearGradient id="ribbon-fill" x1="0" y1="0" x2="0" y2={ZONE_H} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.34" />
                  <stop offset="55%" stopColor="#93C5FD" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.34" />
                </linearGradient>
                <linearGradient id="ribbon-back" x1="0" y1="0" x2="0" y2={ZONE_H} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#0891B2" stopOpacity="0.34" />
                </linearGradient>
                <linearGradient id="ribbon-pulse" x1="0" y1="0" x2="0" y2={ZONE_H} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <radialGradient id="ribbon-source">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                </radialGradient>
                {geometry.ribbons.map((ribbon, i) => (
                  <mask key={i} id={`ribbon-mask-${i}`} maskUnits="userSpaceOnUse" x="0" y="-20" width={geometry.width} height={ZONE_H + 40}>
                    <path
                      data-reveal
                      d={ribbon.spine}
                      pathLength={1}
                      stroke="white"
                      strokeWidth={60}
                      strokeLinecap="round"
                      strokeDasharray="1 1"
                    />
                  </mask>
                ))}
              </defs>

              {geometry.ribbons.map((ribbon, i) => {
                const lit = hovered === i;
                return (
                  <g key={i} mask={`url(#ribbon-mask-${i})`}>
                    {ribbon.segments.map((segment, j) => (
                      <path
                        key={j}
                        d={segment.d}
                        fill={segment.back ? 'url(#ribbon-back)' : 'url(#ribbon-fill)'}
                        className="transition-opacity duration-500"
                        opacity={hovered === null || lit ? 1 : 0.45}
                      />
                    ))}
                    <path
                      d={ribbon.edge}
                      stroke="white"
                      strokeOpacity={lit ? 0.95 : 0.7}
                      strokeWidth={1}
                      className="transition-[stroke-opacity] duration-500"
                    />
                    {ribbon.segments.map((segment, j) => (
                      <path
                        key={j}
                        d={segment.d}
                        fill="#2563EB"
                        className="transition-opacity duration-500"
                        opacity={lit ? 0.14 : 0}
                      />
                    ))}
                  </g>
                );
              })}

              {geometry.ribbons.map((ribbon, i) => (
                <path
                  key={i}
                  data-pulse
                  d={ribbon.spine}
                  pathLength={1}
                  stroke="url(#ribbon-pulse)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="0.14 1"
                  strokeDashoffset={0.14}
                  opacity={0}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.75))' }}
                />
              ))}

              <g data-source>
                <circle cx={geometry.width / 2} cy={0} r={22} fill="url(#ribbon-source)" />
                <circle cx={geometry.width / 2} cy={0} r={4.5} fill="white" stroke="#2563EB" strokeWidth={1.5} />
              </g>
            </svg>
          )}
        </div>

        <motion.ul
          ref={tilesRef}
          variants={list}
          {...inView}
          onAnimationComplete={onTilesShown}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {copy.channels.map((channel, i) => {
            const Icon = CHANNEL_ICONS[i];
            return (
              <motion.li
                key={channel.name}
                variants={item}
                onMouseEnter={() => enterTile(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative flex flex-col rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_8px_32px_rgba(16,24,40,0.08)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_18px_48px_rgba(37,99,235,0.16)] md:p-7"
              >
                {/* 卡片上緣的亮線：緞帶接上來的那一點 */}
                <span
                  className="pointer-events-none absolute inset-x-8 top-0 hidden h-px bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100 lg:block"
                  aria-hidden
                />
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101828] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden>
                      <span data-sync-ring className="absolute inset-0 rounded-full bg-[#06B6D4] opacity-0" />
                      <span data-sync-dot className="relative h-1.5 w-1.5 rounded-full bg-[#06B6D4]" />
                    </span>
                    {copy.status}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-[#101828]">{channel.name}</h3>
                <p className="mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{clauseWrap(channel.desc)}</p>
              </motion.li>
            );
          })}
        </motion.ul>

        <div className="mt-12 text-center">
          <MoreLink href="/business">{copy.link}</MoreLink>
        </div>
      </div>
    </section>
  );
}
