import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Noto_Serif_TC } from "next/font/google";
import { NavigationProgress } from "@/components/NavigationProgress";
import { WebVitals } from "@/components/WebVitals";
import { SkipToContent } from "@/components/Accessibility";
import { CustomCursor } from "@/components/CustomCursor";
import { PointerFx } from "@/components/PointerFx";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { OG_ALT, OG_SIZE } from "@/lib/page-metadata";
import "./globals.css";

// Swapped Outfit → Geist (Vercel's open-source typeface) for sharper editorial feel
// matching Apple/Linear/Stripe-tier sites. Variable kept as --font-outfit for
// downstream compatibility (tailwind config + globals.css unchanged).
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
// 900 必須載：display 標題全是 font-black，缺 900 時中英混排（「關於 Tryzeon」
// 「一套 AI 試穿」）英文會掉到 700，比旁邊的宋體 900 細一級
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});
// 中文 editorial 大標 — Playfair 只有拉丁字符，中文大標靠思源宋體撐住
// 雜誌編輯感。serif font stack 中排在 Playfair 之後：英文吃 Playfair、
// 中文 fallback 到宋體。CJK 字型 Google Fonts 自動按 unicode-range 切片，
// 只會下載頁面用到的字。
// 只載實際用到的字重（600 內文引言 / 900 display）；fallback 指定各 OS 的
// 本機宋體，讓 CJK 切片下載期間的 FOUT 停留在宋體家族內（Android 沒有本機
// 宋體，仍會先閃黑體，屬平台限制）
const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  variable: "--font-serif-tc",
  weight: ["600", "900"],
  display: "swap",
  fallback: ["Songti TC", "Noto Serif CJK TC", "PMingLiU", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tryzeon.com'),
  title: {
    default: "Tryzeon - 為時尚產業而生的 AI",
    template: "%s | Tryzeon"
  },
  description: "Tryzeon 是為時尚產業打造的垂直型 AI（Vertical Fashion AI）。品牌上架一次，商品同步到 Tryzeon App、LINE 官方帳號、品牌官網與門市 QR Code；消費者以 AI 虛擬試穿、動態試穿影片與 AI Fashion Agent 做穿搭決策。",
  keywords: [
    "AI 虛擬試穿", "虛擬換裝", "時尚科技", "Tryzeon",
    "AI 試穿技術", "電商解決方案", "服飾科技",
    "OOTD 推薦", "穿搭 AI", "動態試穿影片",
    "virtual try-on", "fashion tech", "AI fashion",
    "Vertical Fashion AI", "時尚 AI 生態系", "AI 穿搭推薦"
  ],
  authors: [{ name: "Tryzeon Team", url: "https://tryzeon.com" }],
  creator: "Tryzeon",
  publisher: "Tryzeon",
  category: "Technology",
  classification: "Fashion Technology",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://tryzeon.com",
    title: "Tryzeon - 為時尚產業而生的 AI",
    description: "連結消費者與時尚品牌的時尚 AI 生態系——上架一次，四個通路同步。",
    siteName: "Tryzeon",
    images: [
      {
        url: '/opengraph-image',
        ...OG_SIZE,
        alt: OG_ALT,
        type: 'image/png',
      },
    ],

  },
  twitter: {
    card: "summary_large_image",
    site: "@tryzeon",
    creator: "@tryzeon",
    title: "Tryzeon - 為時尚產業而生的 AI",
    description: "連結消費者與時尚品牌的時尚 AI 生態系——上架一次，四個通路同步。",
    images: {
      url: '/twitter-image',
      alt: OG_ALT,
    },
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Tryzeon',
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08090F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://tryzeon.com/#organization',
        name: 'Tryzeon',
        legalName: '創然科技有限公司',
        url: 'https://tryzeon.com',
        logo: 'https://tryzeon.com/icon.png',
        description: '為時尚產業打造的垂直型 AI（Vertical Fashion AI），連結消費者與時尚品牌的時尚 AI 生態系。',
        contactPoint: { '@type': 'ContactPoint', email: 'contact@tryzeon.com', contactType: 'Customer Service' },
        sameAs: ['https://www.instagram.com/tryzeon', 'https://www.linkedin.com/company/tryzeon'],
        taxID: '82970406',
        foundingDate: '2026-08-12',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'TW',
          addressRegion: '臺南市',
          addressLocality: '新市區',
          streetAddress: '南科三路17號2樓之1A163室',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://tryzeon.com/#website',
        name: 'Tryzeon',
        url: 'https://tryzeon.com',
        publisher: { '@id': 'https://tryzeon.com/#organization' },
        inLanguage: 'zh-TW',
      },
    ],
  };

  return (
    <html data-scroll-behavior="smooth" lang="zh-TW" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${notoSerifTC.variable}`}>
      <head>
        {/* 網站本身就是深色：請 Dark Reader 之類的擴充功能不要再反轉一次配色 */}
        <meta name="darkreader-lock" />
        {/* Consolidated JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <SmoothScrollProvider>
          <SkipToContent />
          <NavigationProgress />
          {process.env.NODE_ENV === 'development' && <WebVitals />}
          <CustomCursor />
          <PointerFx />
          <div className="noise-overlay" />
          <main id="main-content">
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
