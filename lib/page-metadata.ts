import type { Metadata } from 'next';
import { copy } from '@/lib/copy';

// 分享卡（app/_og/card.tsx）的 alt 與尺寸；layout 與各子頁的 openGraph 共用
export const OG_ALT = copy.meta.ogCard.alt;
export const OG_SIZE = { width: 1200, height: 630 };

interface PageMetadataInput {
  /** 站內路徑，例如 '/business' */
  path: string;
  /** <title>（會套 layout 的 "%s | Tryzeon" 模板） */
  title: string;
  /** true：<title> 不套 layout 的模板（標題本身已含品牌名時用） */
  absoluteTitle?: boolean;
  description: string;
  /** 分享卡標題；省略時用 `${title} — Tryzeon` */
  shareTitle?: string;
  /** 分享卡描述；省略時用 description */
  shareDescription?: string;
}

/**
 * 子頁的 metadata。Next 的 openGraph 是整塊覆寫而不是合併 —— 子頁只要寫了
 * openGraph，就會丟掉 layout 的分享圖與 locale，所以一律從這裡補齊。
 * twitter:* 不另外寫：Next 會從 openGraph 自動補上標題、描述與圖片，有圖時 card 預設為 summary_large_image。
 */
export function pageMetadata({ path, title, absoluteTitle, description, shareTitle, shareDescription }: PageMetadataInput): Metadata {
  const ogTitle = shareTitle ?? `${title} — Tryzeon`;
  const ogDescription = shareDescription ?? description;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName: 'Tryzeon',
      url: path,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: '/opengraph-image', ...OG_SIZE, alt: OG_ALT }],
    },
  };
}
