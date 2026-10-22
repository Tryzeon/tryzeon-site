import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getCopy } from '@/lib/get-copy';
import { OG_SIZE, ogImagePath } from '@/lib/page-metadata';

const { meta } = getCopy('en');

// /en 子樹的預設 metadata，覆寫 root layout 的中文版（子頁的 pageMetadata 再各自覆寫）
export const metadata: Metadata = {
  title: {
    default: meta.site.title,
    template: '%s | Tryzeon',
  },
  description: meta.site.description,
  keywords: [...meta.site.keywords],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/en',
    title: meta.site.title,
    description: meta.site.shareDescription,
    siteName: 'Tryzeon',
    alternateLocale: 'zh_TW',
    images: [{ url: ogImagePath('en'), ...OG_SIZE, alt: meta.ogCard.alt, type: 'image/png' }],
  },
};

interface EnLayoutProps {
  children: ReactNode;
}

// <html lang> 在 root layout 固定是 zh-TW（改它要拆成兩個 root layout），英文子樹在元素層級標 lang
export default function EnLayout({ children }: EnLayoutProps) {
  return <div lang="en">{children}</div>;
}
