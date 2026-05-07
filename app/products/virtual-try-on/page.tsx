import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Wand2, Eye, ArrowRight, ShieldCheck } from 'lucide-react';
import VirtualTryOnPageClient from './VirtualTryOnPageClient';

export const metadata: Metadata = {
  title: 'AI 虛擬試穿 — 一張照片，秒速試穿任何服飾',
  description:
    'Tryzeon AI 虛擬試穿：上傳一張全身照，AI 自動辨識身形並生成逼真的試穿效果。降低退貨率 25%、提升轉換率 30%，無需離開家就能體驗各種風格。',
  alternates: { canonical: 'https://tryzeon.com/products/virtual-try-on' },
  openGraph: {
    type: 'website',
    url: 'https://tryzeon.com/products/virtual-try-on',
    title: 'AI 虛擬試穿 — 一張照片，秒速試穿任何服飾',
    description: '上傳照片，AI 立即生成試穿效果。',
  },
};

export const revalidate = 3600;

const steps = [
  {
    icon: Camera,
    title: '上傳一張全身照',
    desc: 'AI 自動辨識身形特徵與姿勢，無需多角度拍攝。',
  },
  {
    icon: Wand2,
    title: '選擇想試穿的服飾',
    desc: '從合作品牌的試衣間挑選，或上傳自己看上的款式。',
  },
  {
    icon: Eye,
    title: '即時生成試穿效果',
    desc: '幾秒內看到逼真的試穿成果，可儲存、分享、生成動態影片。',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '虛擬試穿的準確度如何？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '我們使用團隊自家研發的專屬 AI 時尚模型，根據市場研究，導入虛擬試穿後，轉換率提升 30%、退貨率降低 20-30%。',
      },
    },
    {
      '@type': 'Question',
      name: '我的照片和個人資料安全嗎？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '所有上傳的照片都經過加密處理，僅用於生成試穿效果，不會用於其他用途。您可以隨時刪除您的照片和資料。',
      },
    },
    {
      '@type': 'Question',
      name: '目前支援哪些服飾類型？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '目前支援上衣、褲子、裙子、洋裝等常見服飾類型，並持續擴充更多品類與配件。',
      },
    },
  ],
};

export default function VirtualTryOnPage() {
  return (
    <VirtualTryOnPageClient>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative pt-32 md:pt-40 pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.3em] text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">
            Virtual Try-On
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#101828] tracking-tight mb-6 md:mb-8 leading-[1.05]">
            一張照片<br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              秒速試穿任何服飾
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-[#475467] font-medium leading-relaxed max-w-3xl mx-auto mb-10 text-balance">
            上傳一張全身照，AI 自動生成逼真的試穿效果。<br />
            告別試穿煩惱，遇見最美的自己。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066CC] text-white rounded-full font-semibold hover:bg-[#0055AA] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              下載 App 試穿
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#101828] rounded-full font-semibold hover:bg-[#F2F4F7] transition-all duration-300 shadow-lg hover:shadow-xl border border-[#E4E7EC]"
            >
              查看其他產品
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-neo-xl">
            <Image
              src="/images/slides/slide-3-dynamic-video.jpg"
              alt="AI 虛擬試穿效果展示"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-[#F2F4F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-4 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">
              How It Works
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#101828] tracking-tight">
              三步驟，啟動虛擬試穿
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white rounded-3xl p-8 md:p-10 border border-[#E4E7EC]">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[#98A2B3] font-mono font-bold text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#2563EB]" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#101828] mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-[#475467] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-4 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">
              Privacy First
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#101828] tracking-tight mb-6">
              你的照片，<br />永遠由你掌控
            </h2>
            <p className="text-base md:text-lg text-[#475467] leading-relaxed mb-6">
              上傳的照片經過加密處理，僅用於生成試穿效果，不會被儲存於公開資料庫，也不用於訓練第三方模型。
            </p>
            <p className="text-base md:text-lg text-[#475467] leading-relaxed">
              你可以隨時在 App 中刪除照片與生成結果。詳細政策請見
              <Link href="/privacy" className="text-[#2563EB] hover:underline font-semibold mx-1">
                隱私權政策
              </Link>
              。
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#F2F4F7] to-white rounded-3xl p-8 md:p-12 border border-[#E4E7EC]">
            <ShieldCheck className="w-12 h-12 text-[#2563EB] mb-6" />
            <ul className="space-y-3 text-[#101828]">
              <li>• 端對端加密傳輸</li>
              <li>• 試穿結果僅你可見</li>
              <li>• 隨時刪除照片與紀錄</li>
              <li>• 不用於第三方模型訓練</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-[#0A0A0B] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            開始你的 AI 試穿之旅
          </h2>
          <p className="text-base md:text-xl text-[#98A2B3] mb-10 max-w-2xl mx-auto leading-relaxed">
            iOS 與 Android 雙平台支援，免費下載立即體驗。
          </p>
          <Link
            href="/store"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#101828] rounded-full font-semibold hover:bg-[#F2F4F7] transition-all duration-300 shadow-lg"
          >
            下載 Tryzeon App
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </VirtualTryOnPageClient>
  );
}
