import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/pages/NotFoundPage';
import { getCopy } from '@/lib/get-copy';

// /en 底下的 404。沒有對應頁面的網址由 app/en/[...rest] 呼叫 notFound() 帶到這裡
export const metadata: Metadata = {
  title: getCopy('en').notice.notFound.metaTitle,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage locale="en" />;
}
