import type { Metadata } from 'next';

import { ShortLinkExpired } from '@/components/ShortLinkScreens';

// 掃到失效 QR 的落點。單張 QR 的失效狀態不該進搜尋索引。
export const metadata: Metadata = {
  title: '連結已失效',
  robots: { index: false, follow: false },
};

export default function LinkExpiredPage() {
  return <ShortLinkExpired />;
}
