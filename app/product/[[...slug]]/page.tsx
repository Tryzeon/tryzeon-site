import type { Metadata } from 'next';

import { AppDownload } from '@/components/AppDownload';
import { fetchProductPreview } from '@/lib/product-preview';

/** 沒帶 id、查不到、或後端故障時的文案 —— 這頁必須永遠算得出來。 */
const FALLBACK: Metadata = {
  title: '下載 Tryzeon App',
  description: '透過 Tryzeon App 開啟完整的 AI 虛擬試穿體驗。',
};

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
  if (!product) return FALLBACK;

  const title = product.storeName ? `${product.name}｜${product.storeName}` : product.name;
  const price = product.price === null ? '' : `NT$${product.price} · `;
  const description = `${price}用 Tryzeon App 虛擬試穿這件商品。`;
  const url = `/product/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
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
  return (
    <AppDownload
      title={
        <>
          透過 App{' '}
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#06B6D4] bg-clip-text text-transparent">
            開啟完整體驗
          </span>
        </>
      }
      description="此頁面為 Tryzeon 應用程式專屬內容。請下載 App 以享受完整的 AI 虛擬試穿與購物體驗。"
      glowTint="rgba(96,165,250,0.08)"
    />
  );
}
