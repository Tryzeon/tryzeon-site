'use client';

import { usePathname } from 'next/navigation';
import type { SiteCopy } from '@/lib/copy';
import { getCopy } from '@/lib/get-copy';
import { localeFromPathname, type Locale } from '@/lib/i18n';

/** 目前頁面的語言，由網址判斷（/en 開頭是英文） */
export function useLocale(): Locale {
  return localeFromPathname(usePathname());
}

/** client 元件取文案的入口；server 元件改用 lib/get-copy 的 getCopy(locale) */
export function useCopy(): SiteCopy {
  return getCopy(useLocale());
}
