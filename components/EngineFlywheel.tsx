'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useInView, type Variants } from 'framer-motion';
import { SectionHeader } from '@/components/SectionHeader';
import type { AboutCopy } from '@/lib/copy';
import { EASE } from '@/lib/motion';

const RING_R = 36;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;
// 光點繞一圈的時間；每經過一個節點（每 1/4 圈）點亮那一站
const LAP_MS = 8000;
// 光點後面的漸層尾巴長度（角度）
const TAIL_DEG = 40;
const TAIL_START = {
  x: (50 - RING_R * Math.sin((TAIL_DEG * Math.PI) / 180)).toFixed(2),
  y: (50 - RING_R * Math.cos((TAIL_DEG * Math.PI) / 180)).toFixed(2),
};
// 進場：圓環畫完、節點依序出現之後才開始繞圈
const RING_DRAW_S = 1.2;
const NODE_STAGGER_S = 0.15;
const LOOP_DELAY_MS = (RING_DRAW_S + 4 * NODE_STAGGER_S + 0.3) * 1000;

// 節點順時針：上 → 右 → 下 → 左（對應 copy.nodes 順序，也是光點經過的順序）
const NODE_POSITIONS = [
  'left-1/2 top-[14%]',
  'left-[86%] top-1/2',
  'left-1/2 top-[86%]',
  'left-[14%] top-1/2',
] as const;

// 節點之間的順時針箭頭，角度自 12 點鐘方向順時針量
const ARROW_ANGLES = [45, 135, 225, 315] as const;

function arrowTransform(deg: number): string {
  const rad = (deg * Math.PI) / 180;
  const x = 50 + RING_R * Math.sin(rad);
  const y = 50 - RING_R * Math.cos(rad);
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg})`;
}

const nodeEnter: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE, delay: RING_DRAW_S * 0.6 + i * NODE_STAGGER_S },
  }),
};

interface EngineFlywheelProps {
  copy: AboutCopy['engine'];
}

/**
 * AI 引擎（/about）：置中標題＋飛輪圖。
 * 進場時圓環順時針畫出、四個節點依序出現；之後一個光點沿圓環慢慢繞行，
 * 經過哪一站就點亮哪一站，表達「通路整合 → 真實數據 → 引擎優化 → 精準推薦」的循環。
 * 光點只在區塊可見時跑；偏好減少動態的使用者看到的是靜態圖。
 * 節點是 HTML <ol>，螢幕閱讀器依序讀出循環。
 */
export function EngineFlywheel({ copy }: EngineFlywheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<SVGGElement>(null);
  const entered = useInView(wheelRef, { once: true, amount: 0.3 });
  const visible = useInView(wheelRef, { amount: 0 });
  const [looping, setLooping] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const lapStart = useRef<number | null>(null);

  // 進場動畫跑完才開始繞圈；減少動態時不繞
  useEffect(() => {
    if (!entered) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => setLooping(true), LOOP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [entered]);

  useAnimationFrame((time) => {
    if (!looping || !visible || !cometRef.current) {
      lapStart.current = null;
      return;
    }
    if (lapStart.current === null) lapStart.current = time;
    const deg = (((time - lapStart.current) % LAP_MS) / LAP_MS) * 360;
    cometRef.current.setAttribute('transform', `rotate(${deg.toFixed(2)} 50 50)`);
    const station = Math.floor(deg / 90);
    setActive((prev) => (prev === station ? prev : station));
  });

  return (
    <section id="engine" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} />

        <div ref={wheelRef} className="relative mx-auto aspect-square w-full max-w-[540px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="engine-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              {/* 尾巴從透明漸到實色：漸層釘在尾巴起點（-TAIL_DEG）到光點（12 點鐘），跟著整組一起旋轉 */}
              <linearGradient
                id="engine-tail"
                gradientUnits="userSpaceOnUse"
                x1={TAIL_START.x}
                y1={TAIL_START.y}
                x2="50"
                y2={50 - RING_R}
              >
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id="engine-glow">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 底軌 */}
            <circle cx="50" cy="50" r={RING_R} fill="none" stroke="#101828" strokeOpacity="0.07" strokeWidth="0.6" />

            {/* 進場：從 12 點鐘順時針畫出漸層圓環 */}
            <motion.circle
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              stroke="url(#engine-ring)"
              strokeWidth="0.6"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              initial={{ pathLength: 0 }}
              animate={entered ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: RING_DRAW_S, ease: EASE }}
            />

            {ARROW_ANGLES.map((deg, i) => (
              <motion.path
                key={deg}
                d="M -1.6 -1.8 L 1.2 0 L -1.6 1.8"
                fill="none"
                stroke="#2563EB"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={arrowTransform(deg)}
                initial={{ opacity: 0 }}
                animate={entered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: RING_DRAW_S * ((i + 0.5) / 4) }}
              />
            ))}

            {/* 繞行的光點＋尾巴；整組以圓心旋轉，0° 在 12 點鐘 */}
            <g ref={cometRef} className={`transition-opacity duration-700 ${looping ? 'opacity-100' : 'opacity-0'}`}>
              <circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                stroke="url(#engine-tail)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray={`${((TAIL_DEG / 360) * CIRCUMFERENCE).toFixed(2)} ${CIRCUMFERENCE.toFixed(2)}`}
                transform={`rotate(${-90 - TAIL_DEG} 50 50)`}
              />
              <circle cx="50" cy={50 - RING_R} r="5" fill="url(#engine-glow)" />
              <circle cx="50" cy={50 - RING_R} r="1.3" fill="#2563EB" stroke="white" strokeWidth="0.5" />
            </g>
          </svg>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            aria-hidden
          >
            <span className="block font-serif text-3xl md:text-4xl font-black text-[#101828]">Tryzeon</span>
          </motion.div>

          <ol aria-label={copy.title} className="absolute inset-0">
            {copy.nodes.map((node, i) => {
              const isActive = active === i;
              return (
                <li key={node} className={`absolute -translate-x-1/2 -translate-y-1/2 ${NODE_POSITIONS[i]}`}>
                  <motion.span
                    variants={nodeEnter}
                    custom={i}
                    initial="hidden"
                    animate={entered ? 'show' : 'hidden'}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border bg-white/90 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-semibold text-[#101828] backdrop-blur-xl transition-[border-color,box-shadow] duration-500 ${
                      isActive
                        ? 'border-[#2563EB]/40 shadow-[0_8px_28px_rgba(37,99,235,0.22)]'
                        : 'border-white/60 shadow-[0_8px_24px_rgba(16,24,40,0.08)]'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] transition-colors duration-500 ${
                        isActive ? 'bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white' : 'text-[#1D4ED8]'
                      }`}
                    >
                      0{i + 1}
                    </span>
                    {node}
                  </motion.span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
