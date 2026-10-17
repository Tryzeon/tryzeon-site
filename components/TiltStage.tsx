'use client';

import { useRef, type ReactNode } from 'react';
import { usePointerTilt } from '@/lib/use-pointer-tilt';

interface TiltStageProps {
  children: ReactNode;
  className?: string;
  /** 最大旋轉角度（度） */
  max?: number;
  relativeTo?: 'window' | 'element';
}

/** 讓 server 頁面也能用游標微轉：在這個 div 上寫入 --tilt-x／--tilt-y／--light-x／--light-y */
export function TiltStage({ children, className = '', max = 4, relativeTo = 'element' }: TiltStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerTilt(ref, { max, relativeTo });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
