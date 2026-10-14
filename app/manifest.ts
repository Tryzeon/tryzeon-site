import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tryzeon — 為時尚產業而生的 AI',
    short_name: 'Tryzeon',
    description: '連結消費者與時尚品牌的時尚 AI 生態系。',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#FAFAFA',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
    categories: ['fashion', 'technology', 'shopping'],
    lang: 'zh-TW',
    dir: 'ltr',
  };
}
