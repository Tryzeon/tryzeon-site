import type { Metadata } from 'next';
import { copy } from '@/lib/copy';
import { getCopy } from '@/lib/get-copy';
import { OG_LOCALE, localePath, type Locale } from '@/lib/i18n';

// 分享卡（app/_og/card.tsx）的 alt 與尺寸；layout 與各子頁的 openGraph 共用
export const OG_ALT = copy.meta.ogCard.alt;
export const OG_SIZE = { width: 1200, height: 630 };

/** 各語言的分享圖路徑（app/opengraph-image.tsx、app/en/opengraph-image.tsx） */
export function ogImagePath(locale: Locale): string {
  return locale === 'en' ? '/en/opengraph-image' : '/opengraph-image';
}

/**
 * 有英文版的頁面互相標 hreflang；x-default 指向中文版（預設語言、不加前綴）。
 * 只有中文的頁面回 undefined，不輸出任何 alternate。
 */
export function languageAlternates(path: string): Record<string, string> | undefined {
  const en = localePath('en', path);
  if (en === path) return undefined;
  return { 'zh-TW': path, en, 'x-default': path };
}

interface PageMetadataInput {
  locale: Locale;
  /** 站內路徑（不含語言前綴），例如 '/business'；英文版自動變成 '/en/business' */
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
export function pageMetadata({ locale, path, title, absoluteTitle, description, shareTitle, shareDescription }: PageMetadataInput): Metadata {
  const url = localePath(locale, path);
  const ogTitle = shareTitle ?? `${title} — Tryzeon`;
  const ogDescription = shareDescription ?? description;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale],
      alternateLocale: languageAlternates(path) ? OG_LOCALE[locale === 'en' ? 'zh-TW' : 'en'] : undefined,
      siteName: 'Tryzeon',
      url,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImagePath(locale), ...OG_SIZE, alt: getCopy(locale).meta.ogCard.alt }],
    },
  };
}
