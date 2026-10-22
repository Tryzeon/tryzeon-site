import type { Metadata } from 'next';

import { HomePage } from '@/components/pages/HomePage';
import { getCopy } from '@/lib/get-copy';
import { languageAlternates } from '@/lib/page-metadata';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: getCopy('en').meta.home.title },
  alternates: { canonical: '/en', languages: languageAlternates('/') },
};

export default function TryzeonLanding() {
  return <HomePage locale="en" />;
}
