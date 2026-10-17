'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useAnimationFrame, useInView, useSpring, type Variants } from 'framer-motion';
import { SectionHeader } from '@/components/SectionHeader';
import type { AboutCopy } from '@/lib/copy';
import { EASE, FINE_POINTER_QUERY, TILT_SPRING } from '@/lib/motion';

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

// 3D：圓環平面往後倒（手機 40°、桌機 58°），節點與中央字再反向轉回來、直立面向讀者。
// Tailwind 要看到完整 class 字串，所以兩組角度各寫死一份
const PLANE_TILT = '[transform:rotateX(40deg)] lg:[transform:rotateX(58deg)]';
const UPRIGHT = '[transform:rotateX(-40deg)] lg:[transform:rotateX(-58deg)]';
// 斜放的圓環投影後上窄下寬（遠端縮、近端放大），內容的視覺中心比平面中心偏下。
// 舞台高度只留內容本身（四站標籤＋光盤）加 ~20px 餘裕，平面中心放在 47%（手機）/ 43%（桌機），
// perspective-origin 與傾斜軸心跟著放在同一點，投影才與置中時一樣、不會歪
const STAGE_FRAME =
  'aspect-[1/0.78] max-w-[560px] [perspective-origin:50%_47%] lg:aspect-[1/0.52] lg:max-w-[660px] lg:[perspective-origin:50%_43%]';
const STAGE_PIVOT = 'origin-[50%_47%] lg:origin-[50%_43%]';
const PLANE_CENTER = 'top-[47%] lg:top-[43%]';
// 游標在飛輪上移動時，整組再傾斜的最大角度
const GROUP_TILT_MAX = 6;

// 節點之間的順時針箭頭（貼在環上的小刻記，線寬與圓環相同），角度自 12 點鐘方向順時針量
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
 * AI 引擎（/about）：置中標題＋3D 飛輪。
 * 圓環平面在 perspective 舞台裡往後倒（rotateX），四個節點放在斜環上的位置、各自反向轉回直立；
 * 進場時圓環順時針畫出、節點依序出現；之後一個光點沿圓環慢慢繞行，經過哪一站就點亮哪一站，
 * 表達「通路整合 → 真實數據 → 專屬模型 → 精準推薦」的循環。光點在後半圈（遠）縮小變淡、
 * 前半圈（近）放大，加深遠近感。游標在飛輪上移動時整組 spring 傾斜 ±6°（精準指標才有）。
 * 光點只在區塊可見時跑；偏好減少動態的使用者看到的是靜態圖、四站全部點亮。
 * 節點是 HTML <ol>，螢幕閱讀器依序讀出循環。
 */
export function EngineFlywheel({ copy }: EngineFlywheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const tiltEnabled = useRef(false);
  const [allLit, setAllLit] = useState(false);
  const tiltX = useSpring(0, TILT_SPRING);
  const tiltY = useSpring(0, TILT_SPRING);
  const entered = useInView(wheelRef, { once: true, amount: 0.3 });
  const visible = useInView(wheelRef, { amount: 0 });
  const [looping, setLooping] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const lapStart = useRef<number | null>(null);

  // 進場動畫跑完才開始繞圈；減少動態時不繞，改成四站全亮的靜態圖
  useEffect(() => {
    if (!entered) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAllLit(true);
      return;
    }
    const timer = setTimeout(() => setLooping(true), LOOP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [entered]);

  // 整組傾斜只在能 hover 的精準指標、非 reduced motion 時啟用
  useEffect(() => {
    const mq = window.matchMedia(`${FINE_POINTER_QUERY} and (prefers-reduced-motion: no-preference)`);
    const sync = () => {
      tiltEnabled.current = mq.matches;
      if (!mq.matches) {
        tiltX.set(0);
        tiltY.set(0);
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [tiltX, tiltY]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled.current || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    const py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    tiltY.set(px * GROUP_TILT_MAX);
    tiltX.set(-py * GROUP_TILT_MAX);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  useAnimationFrame((time) => {
    if (!looping || !visible || !cometRef.current || !headRef.current) {
      lapStart.current = null;
      return;
    }
    if (lapStart.current === null) lapStart.current = time;
    const deg = (((time - lapStart.current) % LAP_MS) / LAP_MS) * 360;
    cometRef.current.setAttribute('transform', `rotate(${deg.toFixed(2)} 50 50)`);
    // 光點頭：位置跟著角度走；12 點鐘在斜環的最遠端（depth 0），6 點鐘最近（depth 1）
    const rad = (deg * Math.PI) / 180;
    const depth = (1 - Math.cos(rad)) / 2;
    const x = 50 + RING_R * Math.sin(rad);
    const y = 50 - RING_R * Math.cos(rad);
    headRef.current.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(0.8 + 0.3 * depth).toFixed(3)})`);
    headRef.current.setAttribute('opacity', (0.6 + 0.4 * depth).toFixed(3));
    const station = Math.floor(deg / 90);
    setActive((prev) => (prev === station ? prev : station));
  });

  return (
    <section id="engine" className="relative bg-[#FAFAFA] py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader title={copy.title} lede={copy.lede} spacing="mb-10" />

        {/* perspective 舞台 → 跟游標傾斜的整組 → 往後倒的圓環平面（正方形，垂直置中） */}
        <div
          ref={wheelRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={`relative mx-auto w-full [perspective:1400px] ${STAGE_FRAME}`}
        >
          <motion.div
            style={{ rotateX: tiltX, rotateY: tiltY }}
            className={`absolute inset-0 [transform-style:preserve-3d] ${STAGE_PIVOT}`}
          >
            <div
              className={`absolute left-0 mt-[-50%] aspect-square w-full [transform-style:preserve-3d] ${PLANE_CENTER} ${PLANE_TILT}`}
            >
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
                  <radialGradient id="engine-floor">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.16" />
                    <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 環內的淡藍光盤：讓斜放的平面讀得出是一個「面」 */}
                <circle cx="50" cy="50" r={RING_R + 6} fill="url(#engine-floor)" />

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
                    d="M -0.96 -1.08 L 0.72 0 L -0.96 1.08"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform={arrowTransform(deg)}
                    initial={{ opacity: 0 }}
                    animate={entered ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: RING_DRAW_S * ((i + 0.5) / 4) }}
                  />
                ))}

                {/* 繞行的光點：尾巴整組以圓心旋轉（0° 在 12 點鐘）；光點頭另外定位，依遠近縮放與變淡 */}
                <g className={`transition-opacity duration-700 ${looping ? 'opacity-100' : 'opacity-0'}`}>
                  <g ref={cometRef}>
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
                  </g>
                  <g ref={headRef} transform={`translate(50 ${50 - RING_R}) scale(0.8)`} opacity="0.6">
                    <circle cx="0" cy="0" r="5" fill="url(#engine-glow)" />
                    <circle cx="0" cy="0" r="1.3" fill="#2563EB" stroke="white" strokeWidth="0.5" />
                  </g>
                </g>
              </svg>

              {/* 中央字：放在平面中心、反向轉回直立 */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
                aria-hidden
              >
                <div className={UPRIGHT}>
                  <motion.span
                    className="block font-serif text-3xl md:text-4xl font-black text-[#101828]"
                    initial={{ opacity: 0 }}
                    animate={entered ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                  >
                    Tryzeon
                  </motion.span>
                </div>
              </div>

              <ol aria-label={copy.title} className="absolute inset-0 [transform-style:preserve-3d]">
                {copy.nodes.map((node, i) => {
                  const isActive = allLit || active === i;
                  return (
                    <li
                      key={node}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] ${NODE_POSITIONS[i]}`}
                    >
                      <div className={UPRIGHT}>
                        <motion.span
                          variants={nodeEnter}
                          custom={i}
                          initial="hidden"
                          animate={entered ? 'show' : 'hidden'}
                          className={`flex items-center gap-2 whitespace-nowrap rounded-full border bg-white/95 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-semibold text-[#101828] transition-[border-color,box-shadow] duration-500 ${
                            isActive
                              ? 'border-[#2563EB]/40 shadow-[0_8px_28px_rgba(37,99,235,0.22)]'
                              : 'border-[#101828]/[0.06] shadow-[0_8px_24px_rgba(16,24,40,0.08)]'
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
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
