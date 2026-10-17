import Image from 'next/image';
import { SiteLink } from '@/components/SiteLink';
import { copy } from '@/lib/copy';

const LINK =
  'rounded-sm text-sm font-medium text-[#475467] transition-colors hover:text-[#101828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]';

/**
 * 淺色頁尾：品牌一句話＋四欄連結＋法務列，最底下是一個超大的 Tryzeon 字標——
 * 游標經過時，一團珠光在字裡跟著走（--mx/--my 由 SpotlightTracker 寫入）。
 */
export function Footer() {
  const { footer } = copy;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#FAFAFA] text-[#101828]">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 md:px-12 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-t border-[#101828]/10 pt-14 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pr-12">
            <p className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Image src="/images/logo/tryzeon_logomark.png" alt="" width={843} height={661} sizes="41px" className="h-7 w-auto" />
              Tryzeon
            </p>
            <p className="mb-0 max-w-sm font-medium leading-relaxed text-[#475467]">{footer.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="col-span-1">
              <h2 className="mb-5 text-sm font-semibold tracking-normal text-[#101828]">{column.title}</h2>
              <ul className="space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a href={link.href} className={LINK}>
                        {link.label}
                      </a>
                    ) : link.href.startsWith('https://') ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                        {link.label}
                      </a>
                    ) : (
                      <SiteLink href={link.href} className={LINK}>
                        {link.label}
                      </SiteLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#101828]/10 pt-8 text-xs text-[#475467] md:flex-row">
          <div className="text-center md:text-left">
            <p className="mb-0">{footer.copyright.replace('{year}', String(year))}</p>
            <p className="mb-0 mt-1">{footer.company}</p>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footer.legal.map((link) => (
              <li key={link.href}>
                <SiteLink
                  href={link.href}
                  className="rounded-sm transition-colors hover:text-[#101828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  {link.label}
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 超大字標（裝飾）：下緣故意切出畫面 */}
      <div data-spotlight className="footer-wordmark select-none" aria-hidden>
        Tryzeon
      </div>
    </footer>
  );
}
