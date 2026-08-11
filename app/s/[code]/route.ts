import { resolveShortLink } from '@/lib/short-link';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryzeon.com';

function redirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
): Promise<Response> {
  const { code } = await params;
  const url = await resolveShortLink(code, request.headers.get('user-agent') ?? '');

  return redirect(url ?? FALLBACK_URL);
}
