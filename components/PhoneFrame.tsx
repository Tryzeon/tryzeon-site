import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * 純 CSS 手機外框：鈦金屬漸層邊、深色內框、薰衣草色的環境光。截圖本身已含狀態列，所以不畫瀏海。
 * 內容區比例鎖在實機截圖的 900:1957，children 以 fill／object-cover 填滿。
 */
export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`relative rounded-[2.7rem] bg-gradient-to-b from-[#4A4C5C] via-[#1C1D26] to-[#33354A] p-[1.5px] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95),0_0_90px_-30px_rgba(185,167,255,0.45)] ${className}`}
    >
      <div className="rounded-[2.6rem] bg-[#0A0B10] p-[6px]">
        <div className="relative aspect-[900/1957] overflow-hidden rounded-[2.2rem] bg-night-2">
          {children}
          {/* 玻璃面的一道斜向反光 */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.05)_100%)]"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
