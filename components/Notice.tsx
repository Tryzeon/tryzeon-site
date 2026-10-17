import Link from 'next/link';
import type { ReactNode } from 'react';
import { Home } from 'lucide-react';

interface NoticeProps {
  /** 玻璃方框裡的東西：Lucide 圖示或店家 logo */
  emblem: ReactNode;
  title: string;
  lede: string;
  children?: ReactNode;
  /** 底部「回到官方網站」連結；頁面本身已有更好的出口時可關掉 */
  homeLink?: boolean;
}

/**
 * 單一訊息的全頁畫面（短連結落地／失效、404、錯誤、App fallback）共用的淺色玻璃外殼。
 * 夜色底、薰衣草＋水青兩團光暈、深色 glass-card、宋體標題。
 */
export function Notice({ emblem, title, lede, children, homeLink = true }: NoticeProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(185,167,255,0.12)_0%,transparent_65%)] animate-mesh-float" />
        <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(110,231,240,0.08)_0%,transparent_65%)] animate-mesh-float [animation-delay:4s]" />
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 py-20">
        <div className="glass-card rounded-3xl px-8 py-12 text-center sm:px-12">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] shadow-[0_0_40px_-8px_rgba(185,167,255,0.4)]">
              {emblem}
            </div>
          </div>

          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-haze">Tryzeon</p>

          <h1 className="cjk-punct mb-4 font-serif text-3xl font-black leading-tight tracking-[-0.01em] text-pearl sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto max-w-sm text-base leading-relaxed text-haze">{lede}</p>

          {children && <div className="mt-10">{children}</div>}
        </div>

        {homeLink && (
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-haze transition-colors duration-300 hover:text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac"
            >
              <Home className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              回到官方網站
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
