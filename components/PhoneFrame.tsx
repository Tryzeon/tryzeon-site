import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * 純 CSS 手機外框。截圖本身已含狀態列，所以不畫瀏海。
 * 內容區比例鎖在實機截圖的 900:1957，children 以 fill／object-cover 填滿。
 */
export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`relative rounded-[2.6rem] border border-[#101828]/10 bg-white p-[7px] shadow-[0_32px_80px_rgba(16,24,40,0.16),0_8px_24px_rgba(16,24,40,0.08)] ${className}`}
    >
      <div className="relative aspect-[900/1957] overflow-hidden rounded-[2.2rem] bg-[#F2F4F7]">{children}</div>
    </div>
  );
}
