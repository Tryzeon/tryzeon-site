import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';

import { AppDownload } from '@/components/AppDownload';

export const metadata: Metadata = {
  title: '下載 Tryzeon App — iOS 與 Android 雙平台',
  description:
    '免費下載 Tryzeon App，一張照片即可 AI 虛擬試穿。支援 iOS 與 Android，立即開始你的 AI 試穿之旅。',
  alternates: { canonical: 'https://tryzeon.com/download' },
  openGraph: {
    type: 'website',
    url: 'https://tryzeon.com/download',
    title: '下載 Tryzeon App',
    description: '免費下載 Tryzeon App，一張照片即可 AI 虛擬試穿。iOS 與 Android 雙平台支援。',
  },
};

export const revalidate = 3600;

export default function DownloadPage() {
  return (
    <AppDownload
      title={
        <>
          下載 Tryzeon{' '}
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#06B6D4] bg-clip-text text-transparent">
            開始 AI 試穿
          </span>
        </>
      }
      description="一張全身照，AI 立刻生成逼真試穿效果。iOS 與 Android 雙平台支援，免費下載立即體驗。"
      homeHref="/products"
      homeLabel="先看看產品功能"
      homeIcon={Sparkles}
    />
  );
}
