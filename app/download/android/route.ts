import { GOOGLE_PLAY_URL } from '@/lib/app-links';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export function GET(): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: GOOGLE_PLAY_URL,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
