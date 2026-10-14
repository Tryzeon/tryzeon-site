import type { Metadata } from 'next';

import { APP_FALLBACK_METADATA, AppDownload } from '@/components/AppDownload';
import { fetchProductPreview } from '@/lib/product-preview';

interface ProductPageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * 商品連結被貼進 LINE / Messenger 時的預覽卡。抓預覽的是對方的伺服器爬蟲，不受
 * Universal Link 攔截影響 —— 店家裝了 App 會直接被帶進 App，但預覽卡照樣要正確。
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const id = (await params).slug?.[0];
  const product = id ? await fetchProductPreview(id) : null;
  // 沒帶 id、查不到、或後端故障時退回通用文案 —— 這頁必須永遠算得出來
  if (!product) return APP_FALLBACK_METADATA;

  const title = product.storeName ? `${product.name}｜${product.storeName}` : product.name;
  const price = product.price === null ? '' : `NT$${product.price} · `;
  const description = `${price}用 Tryzeon App 虛擬試穿這件商品。`;
  const url = `/product/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // 商品預覽卡給聊天軟體爬蟲讀；頁面本身是 App 的 fallback，不進搜尋索引
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

// Universal Link / App Link 的 fallback（AASA 宣告 /product/*）。
// optional catch-all 讓沒帶 slug 的 /product 也能落地，不會掉到 404。
export default function ProductRedirectPage() {
  return <AppDownload />;
}
