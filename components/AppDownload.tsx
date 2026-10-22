import type { Metadata } from 'next';
import { Smartphone } from 'lucide-react';
import { Notice } from '@/components/Notice';
import { StoreBadges } from '@/components/StoreBadges';
import { copy } from '@/lib/copy';

const { appFallback } = copy.notice;

/** /store、/product 共用的 metadata（/product 查不到商品時也退回這份） */
export const APP_FALLBACK_METADATA: Metadata = {
  title: appFallback.metaTitle,
  description: appFallback.metaDescription,
  robots: { index: false, follow: true },
};

/** Universal Link / App Link 沒被 App 接走時的 fallback（/store、/product） */
export function AppDownload() {
  return (
    <Notice
      emblem={<Smartphone className="h-9 w-9 text-[#2563EB]" strokeWidth={1.4} />}
      title={appFallback.title}
      lede={appFallback.lede}
    >
      <StoreBadges />
    </Notice>
  );
}
