'use client';

import { useRef } from 'react';
import { AppScreen } from '@/components/AppScreen';
import { usePointerTilt } from '@/components/usePointerTilt';
import type { AppImageName } from '@/lib/app-images';

// 三支手機的扇形站位：左右兩支往後退、往外轉；滑過時再展開一點
const POSES = [
  'lg:[transform:translateX(18%)_translateZ(-120px)_rotateY(28deg)] lg:group-hover:[transform:translateX(-6%)_translateZ(-60px)_rotateY(18deg)]',
  'lg:[transform:translateZ(40px)] lg:group-hover:[transform:translateZ(90px)]',
  'lg:[transform:translateX(-18%)_translateZ(-120px)_rotateY(-28deg)] lg:group-hover:[transform:translateX(6%)_translateZ(-60px)_rotateY(-18deg)]',
] as const;

interface PhoneFanProps {
  names: readonly AppImageName[];
}

/**
 * 品牌後台的三張實機畫面，在桌機排成 3D 扇形、跟著游標轉向，滑過時展開。
 * 手機與平板維持平排（不做 3D）。
 */
export function PhoneFan({ names }: PhoneFanProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  usePointerTilt(stageRef, { rx: 4, ry: -10, ampX: 10, ampY: 6 });

  return (
    <div className="relative [perspective:1800px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(185,167,255,0.3),transparent)] blur-3xl"
        aria-hidden
      />
      <div
        ref={stageRef}
        className="group flex justify-center gap-3 md:gap-4 lg:gap-0 lg:[transform-style:preserve-3d] lg:[transform:rotateX(var(--rx,4deg))_rotateY(var(--ry,-10deg))]"
      >
        {names.map((name, i) => (
          <div
            key={name}
            className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${POSES[i] ?? ''} ${i === 1 ? 'lg:z-10' : ''}`}
          >
            <AppScreen
              name={name}
              sizes="(min-width: 1024px) 190px, (min-width: 768px) 200px, 28vw"
              className="w-[28vw] max-w-[200px] lg:w-[190px] lg:max-w-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
