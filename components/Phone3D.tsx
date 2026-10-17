import type { ReactNode, Ref } from 'react';
import { PhoneFrame } from '@/components/PhoneFrame';

// 機身側邊：四片不透明的切片疊在正面後方，轉動時看得到約 8px 的厚度
const SLICES = [
  { z: -2, tone: 'bg-[#EEF0F3]' },
  { z: -4, tone: 'bg-[#E4E7EC]' },
  { z: -6, tone: 'bg-[#D9DDE3]' },
  { z: -8, tone: 'bg-[#CDD2DA]' },
] as const;

interface PhoneBodyProps {
  children: ReactNode;
  className?: string;
  /** 正面（PhoneFrame）的 ref，給需要量手機位置的元件（SilkField 的 route） */
  faceRef?: Ref<HTMLDivElement>;
}

/**
 * PhoneBody：有厚度的 3D 手機機身（preserve-3d 組件）。
 * 結構：背後切片 → 正面 PhoneFrame（只有螢幕那層裁切）→ 邊框虹彩光（只畫在外緣，不蓋截圖）。
 * 父層需要 perspective；本身與祖先不可加 opacity／filter／overflow，否則 3D 會被壓平。
 */
export function PhoneBody({ children, className = '', faceRef }: PhoneBodyProps) {
  return (
    <div className={`relative [transform-style:preserve-3d] ${className}`}>
      {SLICES.map((slice) => (
        <span
          key={slice.z}
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-[2.6rem] ${slice.tone}`}
          style={{ transform: `translateZ(${slice.z}px)` }}
        />
      ))}
      <div ref={faceRef} className="relative">
        <PhoneFrame className="w-full">{children}</PhoneFrame>
        <span aria-hidden className="phone-rim pointer-events-none absolute inset-0 rounded-[2.6rem]" />
      </div>
    </div>
  );
}

interface Phone3DProps {
  children: ReactNode;
  /** 寬度等外框 class */
  className?: string;
  /** 靜止時的偏擺（rotateY，度） */
  yaw?: number;
  /** 掛載時的 3D 落定動畫（CSS keyframe，第一次繪製就開始，不等 hydration） */
  settle?: boolean;
  faceRef?: Ref<HTMLDivElement>;
}

/**
 * Phone3D：perspective 舞台＋姿態＋機身。
 * 姿態吃 --tilt-x／--tilt-y（由 usePointerTilt 寫在任一祖先上），所以游標一動整支手機跟著轉。
 */
export function Phone3D({ children, className = '', yaw = 0, settle = false, faceRef }: Phone3DProps) {
  return (
    <div className={`phone3d ${className}`} style={{ ['--yaw' as string]: `${yaw}deg` }}>
      <div className="phone3d-pose">
        <div className={settle ? 'phone3d-settle' : 'phone3d-still'}>
          <PhoneBody faceRef={faceRef}>{children}</PhoneBody>
        </div>
      </div>
    </div>
  );
}
