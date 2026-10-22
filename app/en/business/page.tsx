import type { Metadata } from 'next';
import { BusinessPage } from '@/components/pages/BusinessPage';
import { getCopy } from '@/lib/get-copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/business',
  ...getCopy('en').meta.business,
});

export const revalidate = 3600;

export default function Page() {
  return <BusinessPage locale="en" />;
}
