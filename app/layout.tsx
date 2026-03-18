import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import { NavigationProgress } from "@/components/NavigationProgress";
import { WebVitals } from "@/components/WebVitals";
import { SkipToContent } from "@/components/Accessibility";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

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
        alt: 'Tryzeon - AI 虛擬試穿技術',
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
      alt: 'Tryzeon - AI 虛擬試穿技術',
    },
  },
  verification: {
    google: "your-google-verification-code",
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
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://tryzeon.com/#organization',
    name: 'Tryzeon',
    alternateName: 'Tryzeon AI Fashion',
    description: '運用 AI 技術提供虛擬試穿解決方案，重新定義時尚購物體驗。',
    url: 'https://tryzeon.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://tryzeon.com/logo.png',
      width: 512,
      height: 512,
    },
    image: 'https://tryzeon.com/og-image.jpg',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'tryzeon.team@gmail.com',
      contactType: 'Customer Service',
      areaServed: 'TW',
      availableLanguage: ['zh-TW', 'en'],
    },
    sameAs: [
      'https://www.instagram.com/tryzeon',
      'https://www.linkedin.com/company/tryzeon',
    ],
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TW',
      addressLocality: 'Taipei',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://tryzeon.com/#website',
    name: 'Tryzeon',
    url: 'https://tryzeon.com',
    description: 'AI 虛擬試穿技術｜時尚科技新創',
    publisher: {
      '@id': 'https://tryzeon.com/#organization',
    },
    inLanguage: ['zh-TW', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://tryzeon.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tryzeon AI Virtual Try-On',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI 驅動的虛擬試穿解決方案，適用於服飾品牌與電商平台。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TWD',
      description: '免費諮詢與試用',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'AI 虛擬試穿',
      '動態影片生成',
      '智慧穿搭推薦',
      '數據分析儀表板',
    ],
  };

  return (
    <html lang="zh-TW" className={`${playfair.variable} ${outfit.variable}`}>
      <head>
        {/* Preload critical pages */}
        <link rel="prefetch" href="/experience" as="document" />
        <link rel="prefetch" href="/products" as="document" />
        <link rel="prefetch" href="/join" as="document" />

        {/* Preload critical images */}
        <link rel="preload" href="/images/slides/slide-hero.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/brand-hero.jpg" as="image" type="image/jpeg" />

        {/* Preload WebP images for modern browsers */}
        <link rel="preload" href="/images/slides/slide-hero.webp" as="image" type="image/webp" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
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
