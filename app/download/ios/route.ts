import { APP_STORE_URL } from '@/lib/app-links';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export function GET(): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: APP_STORE_URL,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
