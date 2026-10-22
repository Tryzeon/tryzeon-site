import type { Metadata } from 'next';
import { DownloadPage } from '@/components/pages/DownloadPage';
import { getCopy } from '@/lib/get-copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'zh-TW',
  path: '/download',
  ...getCopy('zh-TW').meta.download,
});

export const revalidate = 3600;

export default function Page() {
  return <DownloadPage locale="zh-TW" />;
}
