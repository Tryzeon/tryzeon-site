import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { LiffLanding, ShortLinkUnavailable } from '@/components/ShortLinkScreens';
import { SHORT_LINK_HEADER, decodeView, type ShortLinkView } from '@/lib/short-link';

export const dynamic = 'force-dynamic';


async function readView(): Promise<ShortLinkView | null> {
  return decodeView((await headers()).get(SHORT_LINK_HEADER));
}

export async function generateMetadata(): Promise<Metadata> {
  const view = await readView();

  // 每家店的 QR 落地頁不該被索引，但 og:* 仍要有 —— 連結被貼到 LINE 或社群時要有
  // 預覽卡，而抓預覽的 crawler 不看 robots。
  const robots = { index: false, follow: false };

  if (!view) {
    return { title: '暫時無法開啟', robots };
  }

  const name = view.store.name ?? 'Tryzeon 合作店家';
  const description = `在 LINE 上虛擬試穿 ${name} 的商品。`;

  return {
    title: name,
    description,
    robots,
    openGraph: {
      title: name,
      description,
      type: 'website',
      images: view.store.logoUrl ? [{ url: view.store.logoUrl }] : undefined,
    },
  };
}

export default async function ShortLinkPage() {
  const view = await readView();

  // header 不存在代表 proxy 沒跑過，那是設定問題而不是連結失效。
  if (!view) {
    return <ShortLinkUnavailable />;
  }

  return (
    <LiffLanding storeName={view.store.name} liffUrl={view.url} />
  );
}
