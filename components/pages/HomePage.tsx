import HomePageClient from '@/components/HomePageClient';
import { getFaq } from '@/lib/get-copy';
import type { Locale } from '@/lib/i18n';

interface HomePageProps {
  locale: Locale;
}

/** / 與 /en 共用：FAQPage JSON-LD（server）＋首頁本體（client，語言從網址判斷） */
export function HomePage({ locale }: HomePageProps) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getFaq(locale).faqItems.map((item) => ({
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
