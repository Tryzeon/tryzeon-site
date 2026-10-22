// 語言與網址的對應。中文是預設語言、沒有前綴；英文在 /en 底下，只涵蓋 LOCALIZED_PATHS 這幾頁。
// 純函式、不 import 任何東西，server、client 與 node 斷言檔都能直接用。
export const LOCALES = ['zh-TW', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** 有英文版的頁面；其餘（法律頁、短連結、App fallback、/admin）只有中文 */
export const LOCALIZED_PATHS = ['/', '/business', '/about', '/download'] as const;

const EN_PREFIX = '/en';

export const HTML_LANG: Record<Locale, string> = { 'zh-TW': 'zh-TW', en: 'en' };
export const OG_LOCALE: Record<Locale, string> = { 'zh-TW': 'zh_TW', en: 'en_US' };

function isEnPath(pathname: string): boolean {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`);
}

function isLocalized(path: string): boolean {
  return (LOCALIZED_PATHS as readonly string[]).includes(path);
}

export function localeFromPathname(pathname: string): Locale {
  return isEnPath(pathname) ? 'en' : 'zh-TW';
}

/** '/en' → '/'、'/en/about' → '/about'；不是英文路徑就原樣回傳 */
export function stripLocale(pathname: string): string {
  if (!isEnPath(pathname)) return pathname;
  const rest = pathname.slice(EN_PREFIX.length);
  return rest === '' || rest === '/' ? '/' : rest;
}

/**
 * 站內連結換成該語言的版本（保留 #hash）。只改有英文版的頁面；
 * 外部連結、mailto、只有中文的頁面與已經是英文的路徑都原樣回傳。
 */
export function localePath(locale: Locale, href: string): string {
  if (locale === 'zh-TW' || !href.startsWith('/') || isEnPath(href)) return href;
  const hashAt = href.indexOf('#');
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : href.slice(hashAt);
  if (!isLocalized(path)) return href;
  return `${path === '/' ? EN_PREFIX : `${EN_PREFIX}${path}`}${hash}`;
}

/** 語言切換鈕的目標；目前頁沒有另一個語言的版本時回 null */
export function switchLocaleHref(pathname: string, target: Locale): string | null {
  const path = stripLocale(pathname);
  if (!isLocalized(path)) return null;
  return target === 'en' ? localePath('en', path) : path;
}
