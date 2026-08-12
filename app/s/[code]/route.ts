import { resolveShortLink } from '@/lib/short-link';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
  const resolution = await resolveShortLink(code, request.headers.get('user-agent') ?? '');

  switch (resolution.state) {
    case 'ok':
      return redirect(resolution.url);
    case 'expired':
      return redirect('/link-expired');
    case 'unavailable':
      return redirect('/link-unavailable');
  }
}
