import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tryzeon — 為時尚產業而生的 AI',
    short_name: 'Tryzeon',
    description: '連結消費者與時尚品牌的時尚 AI 生態系。',
    start_url: '/',
    display: 'standalone',
    background_color: '#08090F',
    theme_color: '#08090F',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['fashion', 'technology', 'shopping'],
    lang: 'zh-TW',
    dir: 'ltr',
  };
}
