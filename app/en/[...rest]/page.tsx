import { notFound } from 'next/navigation';

// /en 底下沒有的網址：交給 app/en/not-found.tsx，顯示英文 404（否則會落到根目錄的中文 404）
export default function EnCatchAll() {
  notFound();
}
