import type { Metadata } from 'next';

import { HomePage } from '@/components/pages/HomePage';
import { getCopy } from '@/lib/get-copy';
import { languageAlternates } from '@/lib/page-metadata';

export const revalidate = 3600;

// 首頁的 canonical 從 root layout 移來這裡 —— 放在 layout 會被每一頁繼承。
export const metadata: Metadata = {
  title: { absolute: getCopy('zh-TW').meta.home.title },
  alternates: { canonical: '/', languages: languageAlternates('/') },
};

export default function TryzeonLanding() {
  return <HomePage locale="zh-TW" />;
}
