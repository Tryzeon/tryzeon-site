import type { MetadataRoute } from 'next';
import { copy } from '@/lib/copy';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: copy.meta.manifest.name,
    short_name: 'Tryzeon',
    description: copy.meta.manifest.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#FAFAFA',
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
