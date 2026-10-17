'use client';

import { useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import { PhoneFrame } from '@/components/PhoneFrame';
import { usePointerTilt } from '@/components/usePointerTilt';
import { APP_IMAGES } from '@/lib/app-images';
import { copy } from '@/lib/copy';

// 一個 8 秒的循環：全身照 → 光束由上往下掃過 → 試穿結果。時間軸在 globals.css 的 @keyframes tryonScan
const SCAN_LOOP = 'tryonScan 8s linear -0.4s infinite both';

const photoStyle: CSSProperties = {
  clipPath: 'inset(calc(var(--scan) * 1%) 0 0 0)',
  opacity: 'var(--veil)',
};
const beamStyle: CSSProperties = { top: 'calc(var(--scan) * 1%)', opacity: 'var(--beam)' };

function InputCard({ name, sizes, className = '' }: { name: 'modelA' | 'productWhiteShirt'; sizes: string; className?: string }) {
  const image = APP_IMAGES[name];
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(185,167,255,0.5)] ${className}`}>
      <Image
        src={image.src}
        alt={copy.images[name]}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

/**
 * Hero 的試穿示範：一支在 3D 空間裡、跟著游標微微轉向的手機。
 * 畫面先是模特的全身照，一道蛋白石色的光束掃過，T 恤就換成了商品的白襯衫——
 * 兩張素材的構圖本來就對齊，所以光束經過的地方是「原地換上」。
 * 左側漂著兩張輸入（全身照＋商品平拍），光點沿著細線流進手機。
 */
export function TryOnScan() {
  const tiltRef = useRef<HTMLDivElement>(null);

  usePointerTilt(tiltRef);

  return (
    <div className="relative [perspective:1600px]">
      <div
        ref={tiltRef}
        className="relative [transform-style:preserve-3d] [transform:rotateX(var(--rx,2deg))_rotateY(var(--ry,-8deg))]"
      >
        {/* 手機後方的光暈 */}
        <div
          className="pointer-events-none absolute -inset-20 rounded-full bg-[radial-gradient(closest-side,rgba(185,167,255,0.38),rgba(110,231,240,0.12)_55%,transparent)] blur-2xl [transform:translateZ(-180px)]"
          aria-hidden
        />

        {/* 全像投影台：手機腳下一圈旋轉的光環 */}
        <div
          className="pointer-events-none absolute left-1/2 top-full h-[220px] w-[150%] [transform:translate(-50%,-62%)_translateZ(-60px)_rotateX(80deg)]"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-full border border-lilac/30 shadow-[0_0_60px_rgba(185,167,255,0.35),inset_0_0_60px_rgba(110,231,240,0.2)]" />
          <div className="absolute inset-[12%] rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(185,167,255,0.6),transparent_30%,rgba(110,231,240,0.5)_60%,transparent_75%)] opacity-70 [mask:radial-gradient(closest-side,transparent_82%,#000_84%,#000_100%)] motion-safe:animate-[auroraSpin_9s_linear_infinite]" />
        </div>

        <PhoneFrame className="hero-enter w-[64vw] max-w-[280px] [animation-delay:0.2s] lg:w-[min(300px,calc((100svh_-_15rem)_*_0.46))] lg:max-w-none xl:w-[min(330px,calc((100svh_-_15rem)_*_0.46))]">
          <div className="absolute inset-0" style={{ animation: SCAN_LOOP }}>
            {/* 試穿結果：LCP */}
            <Image
              src={APP_IMAGES.tryonSimple.src}
              alt={copy.images.tryonSimple}
              width={APP_IMAGES.tryonSimple.width}
              height={APP_IMAGES.tryonSimple.height}
              sizes="(min-width: 1280px) 330px, (min-width: 1024px) 300px, min(64vw, 280px)"
              priority
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* 全身照：被光束由上往下揭開 */}
            <div className="absolute inset-0" style={photoStyle} aria-hidden>
              <Image
                src={APP_IMAGES.modelA.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 330px, (min-width: 1024px) 300px, min(64vw, 280px)"
                priority
                className="object-cover"
              />
            </div>
            {/* 光束上方：剛生成的區域留一層淡淡的光 */}
            <div
              className="pointer-events-none absolute inset-x-0 h-[14%] -translate-y-full bg-gradient-to-b from-transparent to-lilac/25 mix-blend-screen"
              style={beamStyle}
              aria-hidden
            />
            {/* 光束下方：AI 正在分析的網格帶 */}
            <div
              className="pointer-events-none absolute inset-x-0 h-[18%] mix-blend-screen [background-image:linear-gradient(rgba(185,167,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(110,231,240,0.45)_1px,transparent_1px)] [background-size:12px_12px] [mask-image:linear-gradient(to_bottom,#000,transparent)]"
              style={beamStyle}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 h-[2px] -translate-y-1/2 [background:var(--opal)] shadow-[0_0_14px_3px_rgba(201,184,255,0.85),0_0_60px_12px_rgba(110,231,240,0.4)]"
              style={beamStyle}
              aria-hidden
            />
          </div>
        </PhoneFrame>

        {/* 桌機：兩張輸入卡漂在手機左前方，光點沿細線流進手機 */}
        <div className="absolute right-full top-1/2 hidden -translate-y-1/2 [transform-style:preserve-3d] lg:block">
          <div className="mr-10 [transform:translateZ(90px)] xl:mr-14">
            <div className="hero-enter flex w-24 flex-col items-center [animation-delay:0.75s] xl:w-28">
              <InputCard name="modelA" sizes="112px" className="w-full motion-safe:animate-[floatY_6s_ease-in-out_infinite]" />
              <span className="my-3 font-serif text-2xl leading-none text-lilac" aria-hidden>
                +
              </span>
              <InputCard
                name="productWhiteShirt"
                sizes="112px"
                className="w-full motion-safe:animate-[floatY_6s_ease-in-out_-3s_infinite]"
              />
            </div>
          </div>
          <svg
            className="hero-enter pointer-events-none absolute right-0 top-1/2 h-40 w-10 -translate-y-1/2 overflow-visible [animation-delay:1s] xl:w-14"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="hero-link" x1="0" x2="1">
                <stop offset="0%" stopColor="#C9B8FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6EE7F0" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {['M0 18 C 55 18, 45 50, 100 50', 'M0 82 C 55 82, 45 50, 100 50'].map((d) => (
              <g key={d}>
                <path d={d} fill="none" stroke="url(#hero-link)" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={100} />
                <path
                  d={d}
                  fill="none"
                  stroke="#EDE7FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={100}
                  strokeDasharray="6 94"
                  className="motion-safe:animate-[beamFlow_2.4s_linear_infinite]"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* 手機版：兩張小卡貼在手機上緣兩側 */}
        <div className="absolute -left-9 top-10 w-[72px] [transform:translateZ(60px)] lg:hidden">
          <div className="hero-enter [animation-delay:0.75s]">
            <InputCard name="modelA" sizes="72px" />
          </div>
        </div>
        <div className="absolute -right-9 top-10 w-[72px] [transform:translateZ(60px)] lg:hidden">
          <div className="hero-enter [animation-delay:0.85s]">
            <InputCard name="productWhiteShirt" sizes="72px" />
          </div>
        </div>
      </div>
    </div>
  );
}
