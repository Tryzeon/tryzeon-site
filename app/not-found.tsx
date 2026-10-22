import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/pages/NotFoundPage';
import { getCopy } from '@/lib/get-copy';

export const metadata: Metadata = {
  title: getCopy('zh-TW').notice.notFound.metaTitle,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage locale="zh-TW" />;
}
