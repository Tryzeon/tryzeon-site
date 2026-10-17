'use client';

import dynamic from 'next/dynamic';

const SilkCanvas = dynamic(() => import('@/components/three/SilkCanvas').then((m) => m.SilkCanvas), { ssr: false });

interface SilkBackdropProps {
  variant?: 'hero' | 'soft';
  /** center：中央壓暗給置中文字；left：左半壓暗給靠左文字 */
  focus?: 'center' | 'left';
}

/**
 * 子頁首屏／結尾用的絲綢背景（server component 頁面也能直接放）。
 * 父層需 relative + overflow-hidden；WebGL 載入前先有一層同色系柔光墊底。
 */
export function SilkBackdrop({ variant = 'soft', focus = 'center' }: SilkBackdropProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[70vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(185,167,255,0.14),transparent)] blur-3xl" />
      </div>
      <SilkCanvas variant={variant} />
      <div
        className={`pointer-events-none absolute inset-0 ${
          focus === 'center'
            ? 'bg-[radial-gradient(60%_55%_at_50%_45%,rgba(8,9,15,0.9),rgba(8,9,15,0.45)_70%,rgba(8,9,15,0.15))]'
            : 'bg-[linear-gradient(90deg,rgba(8,9,15,0.92)_0%,rgba(8,9,15,0.7)_35%,rgba(8,9,15,0)_65%)] max-lg:bg-[rgba(8,9,15,0.55)]'
        }`}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" aria-hidden />
    </>
  );
}
