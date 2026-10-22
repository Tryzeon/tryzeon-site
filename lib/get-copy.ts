import { copy, type SiteCopy } from '@/lib/copy';
import { copyEn } from '@/lib/copy.en';
import { brandFaqGroups, faqItems, type BrandFaqGroups, type FaqItems } from '@/lib/faq-data';
import { brandFaqGroupsEn, faqItemsEn } from '@/lib/faq-data.en';
import type { Locale } from '@/lib/i18n';

// server 元件與頁面取文案的入口；client 元件用 components/useCopy.ts
export function getCopy(locale: Locale): SiteCopy {
  return locale === 'en' ? copyEn : copy;
}

export function getFaq(locale: Locale): { faqItems: FaqItems; brandFaqGroups: BrandFaqGroups } {
  return locale === 'en'
    ? { faqItems: faqItemsEn, brandFaqGroups: brandFaqGroupsEn }
    : { faqItems, brandFaqGroups };
}
