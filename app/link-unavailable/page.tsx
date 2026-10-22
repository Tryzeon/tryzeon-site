import type { Metadata } from 'next';

import { ShortLinkUnavailable } from '@/components/ShortLinkScreens';
import { copy } from '@/lib/copy';

// 解析後端故障時的落點，與「已失效」分開：把故障說成失效等於告訴店家的客人他的
// 立牌沒用，而重新掃一次就會好。
export const metadata: Metadata = {
  title: copy.notice.shortLink.unavailable.title,
  robots: { index: false, follow: false },
};

export default function LinkUnavailablePage() {
  return <ShortLinkUnavailable />;
}
