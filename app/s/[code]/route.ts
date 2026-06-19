export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const RESOLVE_LINK_URL = process.env.RESOLVE_LINK_URL;
const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryzeon.com';

function redirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: location, 'Cache-Control': 'no-store' },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
): Promise<Response> {
  const { code } = await params;

  if (!RESOLVE_LINK_URL) {
    return redirect(FALLBACK_URL);
  }

  try {
    const upstream = await fetch(
      `${RESOLVE_LINK_URL}/${encodeURIComponent(code)}`,
      {
        headers: { 'user-agent': request.headers.get('user-agent') ?? '' },
        redirect: 'manual',
      },
    );

    const location = upstream.headers.get('location');
    return redirect(location ?? FALLBACK_URL);
  } catch {
    return redirect(FALLBACK_URL);
  }
}
