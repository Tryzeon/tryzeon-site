import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Video, Shirt, TrendingUp, Store, ArrowRight } from 'lucide-react';
import ProductsPageClient from './ProductsPageClient';

export const metadata: Metadata = {
  title: '產品 — AI 時尚科技五大核心技術',
  description:
    'Tryzeon 五大核心技術：AI 虛擬試穿、動態試穿影片、個人雲端衣櫃、時尚趨勢數據分析、虛擬試衣間。重新定義時尚購物體驗。',
  alternates: { canonical: 'https://tryzeon.com/products' },
  openGraph: {
    type: 'website',
    url: 'https://tryzeon.com/products',
    title: 'Tryzeon 產品 — AI 時尚科技五大核心技術',
    description: '一張照片即可虛擬試穿，AI 重塑時尚購物體驗。',
  },
};

export const revalidate = 3600;

const products = [
  {
    href: '/products/virtual-try-on',
    icon: Sparkles,
    title: 'AI 虛擬試穿',
    en: 'Virtual Try-On',
    desc: '一張照片即可生成虛擬試穿效果，秒速確認尺寸與風格，讓購物決策更有信心。',
    cta: '深入了解',
  },
  {
    href: '/products',
    anchor: '#video',
    icon: Video,
    title: 'AI 動態試穿影片',
    en: 'Dynamic Try-On Video',
    desc: '靜態商品照一鍵生成 10-15 秒動態走秀影片，看見服飾行走、旋轉時的真實樣貌。',
    cta: '查看示範',
  },
  {
    href: '/products',
    anchor: '#wardrobe',
    icon: Shirt,
    title: '個人雲端衣櫃 & AI 推薦',
    en: 'Smart Wardrobe',
    desc: '數位化管理個人衣物，AI 依 5W1H（人時地事物）推薦穿搭，缺合適服飾時自動引導試穿。',
    cta: '了解推薦邏輯',
  },
  {
    href: '/products',
    anchor: '#analytics',
    icon: TrendingUp,
    title: '時尚趨勢數據分析',
    en: 'Trend Analytics',
    desc: '從試穿與互動數據洞察消費者偏好，協助品牌精準進貨、降低庫存與紡織資源浪費。',
    cta: '查看分析能力',
  },
  {
    href: '/products',
    anchor: '#try-on-room',
    icon: Store,
    title: '虛擬試衣間',
    en: 'Try-On Room',
    desc: '合作品牌將服飾上架到試衣間，消費者跨品牌組搭試穿，發現新風格、創造交叉銷售。',
    cta: '探索試衣間',
  },
];

export default function ProductsPage() {
  return (
    <ProductsPageClient>
      <section className="relative pt-32 md:pt-40 pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.3em] text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">
            Products
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#101828] tracking-tight mb-6 md:mb-8 leading-[1.05]">
            五大核心技術<br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              引領時尚數位革命
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-[#475467] font-medium leading-relaxed max-w-3xl mx-auto text-balance">
            從消費者試穿到品牌數據洞察，Tryzeon 提供完整的 AI 時尚基礎建設。
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {products.map((p, i) => {
              const Icon = p.icon;
              const isFirst = i === 0;
              return (
                <Link
                  key={p.title}
                  href={p.anchor ? `${p.href}${p.anchor}` : p.href}
                  id={p.anchor?.replace('#', '')}
                  className={`group block bg-white rounded-3xl p-8 md:p-12 border border-[#E4E7EC] hover:border-[#2563EB]/20 hover:shadow-neo-lg transition-all duration-500 ${
                    isFirst ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Icon className="w-7 h-7 text-[#2563EB]" />
                    </div>
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-[#98A2B3]">
                      {p.en}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#101828] mb-4 tracking-tight">
                    {p.title}
                  </h2>
                  <p className="text-[#475467] leading-relaxed mb-6 max-w-xl">{p.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[#2563EB] font-semibold">
                    {p.cta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-[#0A0A0B] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            想體驗完整功能？
          </h2>
          <p className="text-base md:text-xl text-[#98A2B3] mb-10 max-w-2xl mx-auto leading-relaxed">
            下載 Tryzeon App，開始你的 AI 虛擬試穿之旅。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#101828] rounded-full font-semibold hover:bg-[#F2F4F7] transition-all duration-300 shadow-lg"
            >
              下載 App
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/15"
            >
              品牌合作方案
            </Link>
          </div>
        </div>
      </section>
    </ProductsPageClient>
  );
}
