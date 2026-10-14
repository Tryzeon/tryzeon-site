import { OG_ALT, OG_SIZE } from '@/lib/page-metadata';
import { renderOgCard } from './_og/card';

// 不設 runtime='edge'：內容固定，build 時產生一次靜態 PNG，不必每次被爬時重畫、重抓字型
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgCard();
}
