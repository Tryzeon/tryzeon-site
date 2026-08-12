import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Home, Link2Off, MessageCircle, RefreshCw, Store } from 'lucide-react';

/**
 * 掃到店家 QR 之後、在 LINE 之外看到的三種畫面。
 *
 * 三者共用同一層玻璃外殼。走 MASTER.md 的淺色系統（`AppDownload` 的深色底是既有
 * 例外，不沿用），主色只用 blue→cyan。不放遠端圖片 —— CSP 的 img-src 只允許自家與
 * unsplash，而安全標頭不為單一功能放寬。
 */
function Notice({ emblem, title, lede, children }: {
  /** 玻璃方框裡的東西：錯誤頁放 Lucide 圖示，落地頁放店家 logo。 */
  emblem: ReactNode;
  title: string;
  lede: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA]">
      {/* Aurora bloom backdrop — blue→cyan only, slow drift */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_65%)] animate-mesh-float" />
        <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_65%)] animate-mesh-float [animation-delay:4s]" />
        <div className="absolute inset-0 dot-grid" />
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 py-20">
        <div className="glass-card rounded-3xl px-8 py-12 text-center sm:px-12">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/70 shadow-[0_8px_32px_rgba(16,24,40,0.10)]">
              {emblem}
            </div>
          </div>

          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#475467]">
            Tryzeon
          </p>

          <h1 className="cjk-punct mb-4 text-3xl font-black leading-tight tracking-tight text-[#101828] sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto max-w-sm text-base leading-relaxed text-[#475467]">
            {lede}
          </p>

          {children && <div className="mt-10">{children}</div>}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-[#475467] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#101828] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <Home className="h-4 w-4" strokeWidth={1.8} />
            回到官方網站
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * 未知或已停用的 code。措辭刻意不同於站上的 404：掃 QR 的人沒有「訪問一個不存在的
 * 頁面」，他手上那張印刷品失效了，而下一步是去問店家。
 */
export function ShortLinkExpired() {
  return (
    <Notice
      emblem={<Link2Off className="h-9 w-9 text-[#2563EB]" strokeWidth={1.4} />}
      title="連結已失效"
      lede="這個連結不存在或已停用。如果是從店家的 QR Code 掃來的，請向店家確認。"
    />
  );
}

/**
 * 後端故障或逾時。與 {@link ShortLinkExpired} 分開是有意義的：把故障說成「已失效」，
 * 等於告訴店家的客人他的立牌沒用 —— 而重新整理就會好。
 */
export function ShortLinkUnavailable() {
  return (
    <Notice
      emblem={<RefreshCw className="h-9 w-9 text-[#2563EB]" strokeWidth={1.4} />}
      title="暫時無法開啟"
      lede="伺服器忙線或連線中斷。請稍後重新掃一次，連結本身沒有問題。"
    />
  );
}

interface LiffLandingProps {
  /** 店家名稱。null 時退回通用標題，不猜。 */
  storeName: string | null;
  /** 店家 logo。null 時退回通用圖示。 */
  logoUrl: string | null;
  liffUrl: string;
}

/**
 * 在 LINE 之外掃到店家 QR 時的落地頁。存在的理由是那一次點擊：universal link 只有一次
 * 觸發機會，而自動跳轉用不掉它。
 */
export function LiffLanding({ storeName, logoUrl, liffUrl }: LiffLandingProps) {
  return (
    <Notice
      emblem={logoUrl
        ? (
          // next/image 會依 width 產出縮圖並轉成 avif/webp（next.config.js 已設定），
          // 所以原檔多大都不會整份送到手機上。host 要同時在 CSP 的 img-src 與
          // images.remotePatterns 裡。
          <Image
            src={logoUrl}
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        )
        : <Store className="h-9 w-9 text-[#2563EB]" strokeWidth={1.4} />}
      title={storeName ?? 'Tryzeon 合作店家'}
      lede="在 LINE 中開啟，即可試穿這家店的商品。"
    >
      {/*
        必須是 <a href>，不能改成自動跳轉。Apple 的 DTS 明講 301/302 導向 universal link
        在 iOS 18.3 之後不再開啟 App（developer.apple.com/forums/thread/780496），LINE 也
        不保證外部瀏覽器能喚起 LIFF，並建議改由使用者點擊觸發
        （developers.line.biz/en/tips/2026/05/07/line-launch-issue/）。
      */}
      <a
        href={liffUrl}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-8 py-4 font-semibold text-white shadow-[0_8px_32px_rgba(37,99,235,0.25)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
        在 LINE 中開啟
      </a>
    </Notice>
  );
}
