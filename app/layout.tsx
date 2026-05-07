import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { NavigationProgress } from "@/components/NavigationProgress";
import { WebVitals } from "@/components/WebVitals";
import { SkipToContent } from "@/components/Accessibility";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tryzeon.com'),
  title: {
    default: "Tryzeon - 重新定義你的時尚新生活",
    template: "%s | Tryzeon"
  },
  description: "一張照片即刻生成虛擬試穿影片。Tryzeon 運用 AI 技術提供虛擬試穿、動態影片生成、智慧穿搭推薦，重新定義時尚購物體驗。適用於服飾品牌與電商平台。",
  keywords: [
    "AI 虛擬試穿", "虛擬換裝", "時尚科技", "Tryzeon",
    "AI 試穿技術", "電商解決方案", "服飾科技",
    "OOTD 推薦", "穿搭 AI", "動態試穿影片",
    "virtual try-on", "fashion tech", "AI fashion"
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
  alternates: {
    canonical: 'https://tryzeon.com',
    languages: {
      'zh-TW': 'https://tryzeon.com',
      'en-US': 'https://tryzeon.com/en',
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: ["en_US"],
    url: "https://tryzeon.com",
    title: "Tryzeon - 重新定義你的時尚新生活",
    description: "一張照片即刻生成虛擬試穿影片，重新定義時尚購物體驗。",
    siteName: "Tryzeon",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Tryzeon - 重新定義你的時尚新生活',
        type: 'image/png',
      },
    ],

  },
  twitter: {
    card: "summary_large_image",
    site: "@tryzeon",
    creator: "@tryzeon",
    title: "Tryzeon - 重新定義你的時尚新生活",
    description: "一張照片即刻生成虛擬試穿影片，重新定義時尚購物體驗。",
    images: {
      url: '/twitter-image',
      alt: 'Tryzeon - 重新定義你的時尚新生活',
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
        url: 'https://tryzeon.com',
        logo: 'https://tryzeon.com/icon',
        description: '運用 AI 技術提供虛擬試穿解決方案，重新定義時尚購物體驗。',
        contactPoint: { '@type': 'ContactPoint', email: 'tryzeon.team@gmail.com', contactType: 'Customer Service' },
        sameAs: ['https://www.instagram.com/tryzeon', 'https://www.linkedin.com/company/tryzeon'],
        foundingDate: '2024',
        address: { '@type': 'PostalAddress', addressCountry: 'TW', addressLocality: 'Taipei' },
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
    <html lang="zh-TW" className={outfit.variable}>
      <head>
        {/* Preload critical images */}
        <link rel="preload" href="/images/slides/slide-1-brand-introduction.jpg" as="image" type="image/jpeg" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Consolidated JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <SkipToContent />
        <NavigationProgress />
        <WebVitals />
        <CustomCursor />
        <div className="noise-overlay" />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
