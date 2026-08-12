import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Home, Link2Off, RefreshCw } from 'lucide-react';

/**
 * 掃到店家 QR 但連結沒有帶到目的地時看到的兩種畫面。
 *
 * 兩者共用同一層玻璃外殼。走 MASTER.md 的淺色系統（`AppDownload` 的深色底是既有
 * 例外，不沿用），主色只用 blue→cyan。不放遠端圖片 —— CSP 的 img-src 只允許自家與
 * unsplash，而安全標頭不為單一功能放寬。
 */
function Notice({ icon: Icon, title, lede }: {
  icon: LucideIcon;
  title: string;
  lede: string;
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
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/60 bg-white/70 shadow-[0_8px_32px_rgba(16,24,40,0.10)]">
              <Icon className="h-9 w-9 text-[#2563EB]" strokeWidth={1.4} />
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
      icon={Link2Off}
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
      icon={RefreshCw}
      title="暫時無法開啟"
      lede="伺服器忙線或連線中斷。請稍後重新掃一次，連結本身沒有問題。"
    />
  );
}
