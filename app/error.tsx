'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-6">
      <div
        className="max-w-lg w-full text-center"
        style={{
          animation: 'errorFadeUp 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
          opacity: 0,
        }}
      >
        <style jsx>{`
          @keyframes errorFadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-4 tracking-tight">
          糟糕！發生了一些錯誤
        </h1>
        <p className="text-[#86868B] text-lg mb-10 leading-relaxed">
          我們正在努力修復這個問題。<br />請稍後再試或返回首頁。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066CC] text-white rounded-full font-semibold hover:bg-[#0055AA] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5" />
            重試
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1D1D1F] rounded-full font-semibold hover:bg-[#F5F5F7] transition-all duration-300 shadow-lg hover:shadow-xl border border-black/5"
          >
            <Home className="w-5 h-5" />
            返回首頁
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-10 p-6 bg-red-50 border border-red-100 rounded-2xl text-left">
            <p className="text-sm font-mono text-red-700 break-all leading-relaxed">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-3 font-medium">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
