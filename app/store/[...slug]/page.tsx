import Link from 'next/link';
import { Smartphone, Home, Sparkles, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: '下載 Tryzeon App',
  description: '透過 Tryzeon App 開啟完整的 AI 虛擬試穿體驗。',
};

export default function StoreRedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0A0B]">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_60%)] animate-mesh-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_60%)] animate-mesh-float [animation-delay:4s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,58,237,0.06)_0%,transparent_70%)] animate-mesh-float [animation-delay:8s]" />
        <div className="absolute inset-0 dot-grid-dark" />
      </div>

      <div className="max-w-2xl w-full text-center px-6 py-20 relative z-10">
        {/* Glassmorphism App Icon */}
        <div className="mb-10 flex justify-center">
          <div className="w-28 h-28 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-[0_8px_32px_rgba(37,99,235,0.2)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 via-transparent to-[#06B6D4]/10 opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <Smartphone className="w-14 h-14 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          透過 App{' '}
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#06B6D4] bg-clip-text text-transparent">
            開啟完整體驗
          </span>
        </h1>

        <p className="text-[#98A2B3] text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto font-medium">
          此頁面為 Tryzeon 應用程式專屬內容。請下載 App 以享受完整的 AI 虛擬試穿與購物體驗。
        </p>

        {/* Download Buttons — Glass Cards */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="https://apps.apple.com/tw/app/tryzeon-%E9%87%8D%E6%96%B0%E5%AE%9A%E7%BE%A9%E4%BD%A0%E7%9A%84%E6%99%82%E5%B0%9A%E6%96%B0%E7%94%9F%E6%B4%BB/id6757691600"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] text-white/50 mb-1">Download on the</span>
              <span className="text-lg font-semibold -mt-1">App Store</span>
            </div>
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.tryzeon.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true">
              <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.832L19.8 12l-2.102 1.125-2.538-2.538 2.538-2.538v.826zM5.864 2.658l10.937 6.333-2.302 2.302-8.635-8.635z"/>
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] text-white/50 mb-1">GET IT ON</span>
              <span className="text-lg font-semibold -mt-1">Google Play</span>
            </div>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mb-12 text-white/40 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 虛擬試穿</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>免費使用</span>
          </div>
        </div>

        {/* Home Link */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/70 hover:text-white rounded-full font-medium transition-all duration-300 border border-white/5 hover:border-white/15 hover:bg-white/5"
        >
          <Home className="w-5 h-5" />
          回到官方網站
        </Link>
      </div>
    </div>
  );
}
