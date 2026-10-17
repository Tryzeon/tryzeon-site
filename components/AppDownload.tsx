import type { Metadata } from 'next';
import { Smartphone } from 'lucide-react';
import { Notice } from '@/components/Notice';
import { StoreBadges } from '@/components/StoreBadges';

/** /store、/product 共用的 metadata（/product 查不到商品時也退回這份） */
export const APP_FALLBACK_METADATA: Metadata = {
  title: '下載 Tryzeon App',
  description: '透過 Tryzeon App 開啟完整的 AI 虛擬試穿體驗。',
  robots: { index: false, follow: true },
};

/** Universal Link / App Link 沒被 App 接走時的 fallback（/store、/product） */
export function AppDownload() {
  return (
    <Notice
      emblem={<Smartphone className="h-9 w-9 text-lilac" strokeWidth={1.4} />}
      title="透過 App 開啟完整體驗"
      lede="此頁面為 Tryzeon 應用程式專屬內容。請下載 App 以享受完整的 AI 虛擬試穿體驗。"
    >
      <StoreBadges />
    </Notice>
  );
}
