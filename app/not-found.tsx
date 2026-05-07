import Link from 'next/link';
import { Home, ArrowRight, Sparkles, HelpCircle, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-6 py-20">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-[120px] md:text-[180px] font-bold text-[#1D1D1F]/10 leading-none tracking-tighter select-none">
            404
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-4 tracking-tight -mt-16 md:-mt-24">
          找不到頁面
        </h2>
        <p className="text-[#86868B] text-lg mb-10 leading-relaxed max-w-md mx-auto">
          抱歉，您訪問的頁面不存在或已被移除。<br />讓我們帶您回到正確的方向。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066CC] text-white rounded-full font-semibold hover:bg-[#0055AA] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            返回首頁
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1D1D1F] rounded-full font-semibold hover:bg-[#F5F5F7] transition-all duration-300 shadow-lg hover:shadow-xl border border-black/5"
          >
            探索產品功能
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/#features"
            className="group p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-all duration-300 border border-black/5"
          >
            <div className="w-10 h-10 bg-[#0066CC]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0066CC]/20 transition-colors">
              <Sparkles className="w-5 h-5 text-[#0066CC]" />
            </div>
            <h3 className="font-semibold text-[#1D1D1F] mb-1">產品功能</h3>
            <p className="text-sm text-[#86868B]">五大核心 AI 技術</p>
          </Link>

          <Link
            href="/#faq"
            className="group p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-all duration-300 border border-black/5"
          >
            <div className="w-10 h-10 bg-[#0066CC]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0066CC]/20 transition-colors">
              <HelpCircle className="w-5 h-5 text-[#0066CC]" />
            </div>
            <h3 className="font-semibold text-[#1D1D1F] mb-1">常見問題</h3>
            <p className="text-sm text-[#86868B]">查看使用說明</p>
          </Link>

          <a
            href="mailto:tryzeon.team@gmail.com"
            className="group p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-all duration-300 border border-black/5"
          >
            <div className="w-10 h-10 bg-[#0066CC]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0066CC]/20 transition-colors">
              <Mail className="w-5 h-5 text-[#0066CC]" />
            </div>
            <h3 className="font-semibold text-[#1D1D1F] mb-1">聯絡我們</h3>
            <p className="text-sm text-[#86868B]">取得協助與支援</p>
          </a>
        </div>
      </div>
    </div>
  );
}
