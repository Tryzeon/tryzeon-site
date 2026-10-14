/**
 * 公開圖片主機。寫死而不是環境變數：`next.config.js` 的 CSP `img-src` 與
 * `images.remotePatterns` 已各寫死一次，第三處跟著它們走比多一個會漂移的設定安全。
 */
export const IMAGES_BASE_URL = 'https://images.tryzeon.com';

export function publicImageUrl(path: string | null): string | null {
  return path ? `${IMAGES_BASE_URL}/${path}` : null;
}
