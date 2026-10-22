import { getCopy } from '@/lib/get-copy';
import { OG_SIZE } from '@/lib/page-metadata';
import { renderOgCard } from '../_og/card';

// /en 的分享卡；與 app/opengraph-image.tsx 相同，只換成英文字
export const alt = getCopy('en').meta.ogCard.alt;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgCard('en');
}
