// App 商店連結與平台判定的單一事實來源。
// 商店網址原本散落在 /store 與 /product 兩個 fallback 頁裡硬編，改版時容易漏改。

export const APP_STORE_URL =
  'https://apps.apple.com/tw/app/tryzeon-%E9%87%8D%E6%96%B0%E5%AE%9A%E7%BE%A9%E4%BD%A0%E7%9A%84%E6%99%82%E5%B0%9A%E6%96%B0%E7%94%9F%E6%B4%BB/id6757691600';

export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.tryzeon.app';

export type Platform = 'ios' | 'android' | 'other';

// iPadOS 13+ 預設回報 "Macintosh; Intel Mac OS X" 的桌機 UA，server 端無從分辨
// （只有 client 的 maxTouchPoints 能判斷）。這類請求會落到 'other'，交給
// /download 頁面讓使用者自己選 — 寧可多一次點擊，也不要把 Mac 使用者丟進 App Store。
export function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();

  if (ua.includes('android')) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';

  return 'other';
}
