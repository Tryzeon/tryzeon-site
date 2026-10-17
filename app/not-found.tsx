import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Notice } from '@/components/Notice';

export const metadata: Metadata = {
  title: '找不到頁面',
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/', label: '回到首頁', primary: true },
  { href: '/business', label: '品牌合作', primary: false },
  { href: '/download', label: '下載 App', primary: false },
] as const;

export default function NotFound() {
  return (
    <Notice
      emblem={<SearchX className="h-9 w-9 text-lilac" strokeWidth={1.4} />}
      title="找不到這個頁面"
      lede="網址可能打錯了，或這個頁面已經移除。"
      homeLink={false}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-7 py-3.5 ${
              link.primary
                ? 'btn-primary'
                : 'focus-ring inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] font-semibold text-pearl transition-colors duration-300 hover:bg-white/[0.1]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </Notice>
  );
}
