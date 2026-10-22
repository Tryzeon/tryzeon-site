import Link from 'next/link';
import type { ReactNode } from 'react';
import { Home } from 'lucide-react';
import { getCopy } from '@/lib/get-copy';
import { localePath, type Locale } from '@/lib/i18n';

interface NoticeProps {
  /** 玻璃方框裡的東西：Lucide 圖示或店家 logo */
  emblem: ReactNode;
  title: string;
  lede: string;
  children?: ReactNode;
  /** 底部「回到官方網站」連結；頁面本身已有更好的出口時可關掉 */
  homeLink?: boolean;
  /** 返回連結的語言與目標；只有中文的畫面（短連結、App fallback）省略 */
  locale?: Locale;
}

/**
 * 單一訊息的全頁畫面（短連結落地／失效、404、錯誤、App fallback）共用的淺色玻璃外殼。
 * 走 MASTER.md：#FAFAFA 底、blue→cyan 光暈、glass-card、宋體標題。
 */
export function Notice({ emblem, title, lede, children, homeLink = true, locale = 'zh-TW' }: NoticeProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_65%)] animate-mesh-float" />
        <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_65%)] animate-mesh-float [animation-delay:4s]" />
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 py-20">
        <div className="glass-card rounded-3xl px-8 py-12 text-center sm:px-12">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/70 shadow-[0_8px_32px_rgba(16,24,40,0.10)]">
              {emblem}
            </div>
          </div>

          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#475467]">Tryzeon</p>

          <h1 className="cjk-punct mb-4 font-serif text-3xl font-black leading-tight tracking-[-0.01em] text-[#101828] sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto max-w-sm text-base leading-relaxed text-[#475467]">{lede}</p>

          {children && <div className="mt-10">{children}</div>}
        </div>

        {homeLink && (
          <div className="mt-8 text-center">
            <Link
              href={localePath(locale, '/')}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-[#475467] transition-colors duration-300 hover:text-[#101828] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              <Home className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              {getCopy(locale).notice.home}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
