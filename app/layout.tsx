import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Noto_Serif_TC } from "next/font/google";
import { NavigationProgress } from "@/components/NavigationProgress";
import { WebVitals } from "@/components/WebVitals";
import { SkipToContent } from "@/components/Accessibility";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { copy } from "@/lib/copy";
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
    default: copy.meta.site.title,
    template: "%s | Tryzeon"
  },
  description: copy.meta.site.description,
  keywords: [...copy.meta.site.keywords],
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
    title: copy.meta.site.title,
    description: copy.meta.site.shareDescription,
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
  themeColor: "#FFFFFF",
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
        description: copy.meta.site.orgDescription,
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
        inLanguage: ['zh-TW', 'en'],
      },
    ],
  };

  return (
    <html data-scroll-behavior="smooth" lang="zh-TW" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${notoSerifTC.variable}`}>
      <head>
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
          <main id="main-content">
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
