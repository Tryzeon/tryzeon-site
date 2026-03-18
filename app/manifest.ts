import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tryzeon - 重新定義你的時尚新生活',
    short_name: 'Tryzeon',
    description: '一張照片即可虛擬試穿，讓時尚購物更智能、更有趣',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#B8A094',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['fashion', 'technology', 'ai', 'shopping'],
    lang: 'zh-TW',
    dir: 'ltr',
  };
}
