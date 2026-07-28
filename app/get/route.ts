import { APP_STORE_URL, GOOGLE_PLAY_URL, detectPlatform } from '@/lib/app-links';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// /get — 一條到處都能貼的短連結：手機直達對應商店，桌機（含無法辨識的 iPad
// 桌機模式）落到 /download 讓使用者自己選。
export function GET(request: Request): Response {
  const platform = detectPlatform(request.headers.get('user-agent') ?? '');

  const location =
    platform === 'ios' ? APP_STORE_URL : platform === 'android' ? GOOGLE_PLAY_URL : '/download';

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      'Cache-Control': 'no-store',
      Vary: 'User-Agent',
      'X-Robots-Tag': 'noindex',
    },
  });
}
