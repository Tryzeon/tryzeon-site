import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';
import { getCopy } from '@/lib/get-copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/about',
  absoluteTitle: true,
  ...getCopy('en').meta.about,
});

export const revalidate = 3600;

export default function Page() {
  return <AboutPage locale="en" />;
}
