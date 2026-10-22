import type { MetadataRoute } from 'next';
import { localePath } from '@/lib/i18n';
import { languageAlternates } from '@/lib/page-metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tryzeon.com';
  const currentDate = new Date();

  const pages = [
    { path: '/', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/business', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/download', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/delete-account', changeFrequency: 'yearly' as const, priority: 0.2 },
  ];

  // 首頁維持不帶結尾斜線的 https://tryzeon.com
  const url = (path: string) => `${baseUrl}${path === '/' ? '' : path}`;

  // 有英文版的頁面各多一筆 /en/...，兩筆都附上 hreflang 對照
  return pages.flatMap((page) => {
    const languages = languageAlternates(page.path);
    const entry = (path: string) => ({
      url: url(path),
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(languages && {
        alternates: { languages: { 'zh-TW': url(languages['zh-TW']), en: url(languages.en) } },
      }),
    });
    return languages ? [entry(page.path), entry(localePath('en', page.path))] : [entry(page.path)];
  });
}
