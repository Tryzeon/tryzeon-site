import { AppDownload } from '@/components/AppDownload';

export const metadata = {
  title: '下載 Tryzeon App',
  description: '透過 Tryzeon App 開啟完整的 AI 虛擬試穿體驗。',
};

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
