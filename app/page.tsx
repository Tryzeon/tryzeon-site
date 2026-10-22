import type { Metadata } from 'next';

import HomePageClient from "@/components/HomePageClient";
import { copy } from "@/lib/copy";
import { faqItems } from "@/lib/faq-data";

export const revalidate = 3600;

// 首頁的 canonical 從 root layout 移來這裡 —— 放在 layout 會被每一頁繼承。
export const metadata: Metadata = {
  title: { absolute: copy.meta.home.title },
  alternates: { canonical: '/' },
};

export default function TryzeonLanding() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
