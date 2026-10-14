import { APP_FALLBACK_METADATA, AppDownload } from '@/components/AppDownload';

export const metadata = APP_FALLBACK_METADATA;

// Universal Link / App Link 的 fallback（AASA 宣告 /store/*）。
// optional catch-all 讓沒帶 slug 的 /store 也能落地，不會掉到 404。
export default function StoreRedirectPage() {
  return <AppDownload />;
}
