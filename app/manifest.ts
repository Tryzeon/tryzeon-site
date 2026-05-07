import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tryzeon - 重新定義你的時尚新生活',
    short_name: 'Tryzeon',
    description: '一張照片即可虛擬試穿，讓時尚購物更智能、更有趣',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
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
