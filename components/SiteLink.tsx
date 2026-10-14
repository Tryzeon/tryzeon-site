'use client';

import type { ComponentProps, MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { samePageTarget } from '@/lib/section-nav';

/** 點到目前這一頁的連結：就地平滑捲到該段或頂端。回傳是否已處理 */
export function scrollWithinPage(e: MouseEvent<HTMLAnchorElement>, href: string, pathname: string): boolean {
  const target = samePageTarget(href, pathname);
  if (target === 'top') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }
  const el = target ? document.getElementById(target.id) : null;
  if (!el) return false;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

interface SiteLinkProps extends ComponentProps<typeof Link> {
  href: string;
}

/** next/link ＋ 同頁平滑捲動。站內導覽連結（導覽列、頁尾、目錄）一律用它 */
export function SiteLink({ href, onClick, ...rest }: SiteLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        scrollWithinPage(e, href, pathname);
      }}
      {...rest}
    />
  );
}
