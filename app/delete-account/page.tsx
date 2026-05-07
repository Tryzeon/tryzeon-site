import Link from 'next/link';
import { Settings, UserX, AlertCircle, Home, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '刪除帳號',
  description: '了解如何在 Tryzeon App 中刪除您的帳號與個人資料。',
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] relative">
      {/* Subtle top gradient */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-[#F2F4F7] to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          回到首頁
        </Link>

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-[#E4E7EC] mb-8">
            <UserX className="w-8 h-8 text-[#F04438]" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#101828] mb-6 tracking-tight">
            刪除您的帳號
          </h1>
          <p className="text-lg text-[#667085] max-w-xl leading-relaxed font-medium">
            我們很遺憾看到您離開。若您決定不再使用 Tryzeon，可以隨時透過 App 內建的功能完全刪除您的帳號與個人資料。
          </p>
        </div>

        {/* Steps Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#E4E7EC] mb-8">
          <h2 className="text-xl font-bold text-[#101828] mb-10 tracking-tight">
            如何在 App 中刪除帳號
          </h2>

          <div className="space-y-10">
            {[
              {
                step: 1,
                icon: <Settings className="w-5 h-5 text-[#667085]" />,
                title: '前往設定',
                desc: '開啟 Tryzeon App，在首頁或個人檔案頁面中找到並進入「設定」(Settings)。',
              },
              {
                step: 2,
                icon: <UserX className="w-5 h-5 text-[#667085]" />,
                title: '選擇刪除帳號',
                desc: '在設定選單中，點擊「刪除帳號」(Delete Account) 選項。',
              },
              {
                step: 3,
                icon: <CheckCircle2 className="w-5 h-5 text-[#667085]" />,
                title: '確認刪除',
                desc: '依照畫面上的提示確認您的操作。一旦確認，您的帳號便會被永久刪除。',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F2F4F7] text-[#2563EB] flex items-center justify-center font-bold text-base border border-[#E4E7EC]">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-bold text-[#101828] flex items-center gap-2 mb-2">
                    {item.icon}
                    {item.title}
                  </h3>
                  <p className="text-[#667085] leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Card */}
        <div className="bg-[#FEF3F2] rounded-2xl p-6 border border-[#FECDCA] mb-16">
          <div className="flex gap-4">
            <AlertCircle className="w-5 h-5 text-[#F04438] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#7A271A] mb-2 text-sm">刪除資料是不可逆的</h4>
              <p className="text-sm text-[#912018]/80 leading-relaxed">
                執行帳號刪除後，您在 Tryzeon 上的所有資訊（包含虛擬試穿紀錄、個人設定、與商家互動紀錄等）將被永久且完全刪除，無法復原。如果未來需要繼續使用，您必須重新註冊一個新帳號。
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#101828] rounded-full font-semibold hover:bg-[#F2F4F7] transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#E4E7EC] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          >
            <Home className="w-5 h-5" />
            回到首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
