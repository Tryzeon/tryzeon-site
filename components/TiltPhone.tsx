'use client';

import { useRef } from 'react';
import { AppScreen } from '@/components/AppScreen';
import { usePointerTilt } from '@/components/usePointerTilt';
import type { AppImageName } from '@/lib/app-images';

interface TiltPhoneProps {
  name: AppImageName;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** 一支跟著游標在 3D 空間裡轉向的手機，背後一團光、腳下一圈全像光環 */
export function TiltPhone({ name, sizes, priority = false, className = '' }: TiltPhoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerTilt(ref, { rx: 3, ry: -10 });

  return (
    <div className="relative [perspective:1600px]">
      <div ref={ref} className="relative [transform-style:preserve-3d] [transform:rotateX(var(--rx,3deg))_rotateY(var(--ry,-10deg))]">
        <div
          className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,rgba(185,167,255,0.36),rgba(110,231,240,0.1)_55%,transparent)] blur-2xl [transform:translateZ(-160px)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-full h-[200px] w-[150%] [transform:translate(-50%,-62%)_translateZ(-60px)_rotateX(80deg)]"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-full border border-lilac/30 shadow-[0_0_60px_rgba(185,167,255,0.35),inset_0_0_60px_rgba(110,231,240,0.2)]" />
        </div>
        <AppScreen name={name} sizes={sizes} priority={priority} className={className} />
      </div>
    </div>
  );
}
