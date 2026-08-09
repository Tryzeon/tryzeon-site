import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Video, Shirt, TrendingUp, Store, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import BusinessPageClient from './BusinessPageClient';

export const metadata: Metadata = {
  title: '品牌合作 — 為服飾品牌打造的 AI 虛擬試穿解決方案',
  description:
    'Tryzeon 為中小型服飾品牌提供 AI 虛擬試穿、動態影片生成與時尚趨勢數據分析。pay-per-use：每 5 次試穿 NT$1、前 3 個月免費，零前期投入。試穿數據回饋精準進貨，降低庫存風險。',
  alternates: { canonical: 'https://tryzeon.com/business' },
  openGraph: {
    type: 'website',
    url: 'https://tryzeon.com/business',
    title: '品牌合作 — 為服飾品牌打造的 AI 虛擬試穿解決方案',
    description:
      'Tryzeon B2B 解決方案：AI 虛擬試穿串連門市、品牌官網與 App，pay-per-use 零固定成本，前 3 個月免費導入。',
  },
};

export const revalidate = 3600;

// 一律使用 Tryzeon 自身可佐證的事實，不引用無來源的外部研究數字
// （對外用語紅線：84% 不得使用、退貨率宣稱禁止、轉換率須具名來源）
const stats = [
  { value: 'NT$1', label: '每 5 次試穿', desc: 'pay-per-use，用多少付多少' },
  { value: '3 個月', label: '免費導入期', desc: '零前期投入、不收月費，先驗證成效' },
  { value: '8 成', label: '品牌願依試穿流量付費', desc: '實地訪談 100 家品牌、20 家深度受訪' },
  { value: 'NT$ 數萬', label: '一次模特兒＋棚拍成本', desc: 'AI 生成試穿影像可直接取代此支出' },
];

const valueProps = [
  {
    icon: Sparkles,
    title: 'AI 虛擬試穿',
    desc: '消費者上傳照片即可試穿您的服飾，提升下單信心。流量計價：依被試穿次數付費，銷售越好、成本配比越合理。',
  },
  {
    icon: Video,
    title: '動態試穿影片',
    desc: '靜態商品照一鍵生成動態走秀影片，補足 IG/TikTok 行銷素材，無需多次棚拍。',
  },
  {
    icon: Shirt,
    title: '虛擬試衣間',
    desc: '上架您的服飾到 Tryzeon 試衣間，讓消費者跨品牌組搭，提升交叉銷售機會。',
  },
  {
    icon: TrendingUp,
    title: '時尚趨勢數據分析',
    desc: '從試穿與互動數據洞察消費者偏好，精準進貨、降低庫存風險、優化行銷投放。',
  },
  {
    icon: Store,
    title: 'OOTD 智能推薦',
    desc: 'AI 依 5W1H 為消費者推薦穿搭，當缺合適服飾時自動推薦您的商品，創造額外導購。',
  },
];

const pricingHighlights = [
  '按實際試穿次數計費：每 5 次試穿 NT$1，不收月費、不收上架費',
  '前 3 個月免費導入，零前期投入驗證成效',
  '手機就能完成上架：多模態自動預填、語音輸入、Excel 批次匯入',
  '專屬技術窗口協助上架與素材轉換',
];

export default function BusinessPage() {
  return (
    <BusinessPageClient>
      <section id="hero" className="relative pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.3em] text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">
            For Fashion Brands
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#101828] tracking-tight mb-6 md:mb-8 leading-[1.05]">
            低成本提升視覺吸引力<br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              與電商轉換率
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-[#475467] font-medium leading-relaxed max-w-3xl mx-auto mb-10 text-balance">
            Tryzeon 是專為中小型服飾品牌打造的 AI 虛擬試穿解決方案。<br />
            流量計價、無前期投入、整合您現有的電商系統。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScu_hKsOTUVcuB0R3sKnRh9cAbn7zchO7W8izdgG1N9-WC9AQ/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066CC] text-white rounded-full font-semibold hover:bg-[#0055AA] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              立即申請合作
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@tryzeon.com?subject=Tryzeon%20%E5%93%81%E7%89%8C%E5%90%88%E4%BD%9C%E8%A9%A2%E5%95%8F"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#101828] rounded-full font-semibold hover:bg-[#F2F4F7] transition-all duration-300 shadow-lg hover:shadow-xl border border-[#E4E7EC]"
            >
              <Mail className="w-5 h-5" />
              直接聯絡業務
            </a>
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-6xl font-extrabold text-[#101828] tracking-tighter mb-3">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm font-mono font-bold uppercase tracking-[0.15em] text-[#2563EB] mb-2">
                  {s.label}
                </div>
                <p className="text-[#667085] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 md:py-32 bg-[#F2F4F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-4 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">
              Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#101828] tracking-tight">
              為品牌量身打造的五大能力
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {valueProps.map((vp) => {
              const Icon = vp.icon;
              return (
                <div
                  key={vp.title}
                  className="bg-white rounded-3xl p-8 md:p-10 border border-[#E4E7EC] hover:border-[#2563EB]/20 hover:shadow-neo-lg transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#101828] mb-3 tracking-tight">
                    {vp.title}
                  </h3>
                  <p className="text-[#475467] leading-relaxed">{vp.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-4 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">
              Pricing Model
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#101828] tracking-tight mb-4">
              流量計價，無前期投入
            </h2>
            <p className="text-lg md:text-xl text-[#475467] max-w-2xl mx-auto leading-relaxed">
              我們依「商品在 Tryzeon 上實際被試穿的次數」收費。試穿越多代表導購機會越強，您的成本與獲利同向成長。
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#F2F4F7] to-white rounded-3xl p-8 md:p-12 border border-[#E4E7EC]">
            <ul className="space-y-4 md:space-y-5">
              {pricingHighlights.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span className="text-base md:text-lg text-[#101828] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="cta" className="py-24 md:py-40 bg-[#0A0A0B] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            準備好把虛擬試穿<br />接入您的品牌了嗎？
          </h2>
          <p className="text-base md:text-xl text-[#98A2B3] mb-10 max-w-2xl mx-auto leading-relaxed">
            填寫合作申請表，我們將在 3 個工作天內聯絡您，安排免費試用方案。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScu_hKsOTUVcuB0R3sKnRh9cAbn7zchO7W8izdgG1N9-WC9AQ/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#101828] rounded-full font-semibold hover:bg-[#F2F4F7] transition-all duration-300 shadow-lg"
            >
              申請合作
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/15"
            >
              回到首頁
            </Link>
          </div>
        </div>
      </section>
    </BusinessPageClient>
  );
}
