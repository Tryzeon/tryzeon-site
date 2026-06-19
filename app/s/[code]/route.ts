export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const RESOLVE_LINK_URL = process.env.RESOLVE_LINK_URL;
const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tryzeon.com';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
): Promise<Response> {
  const { code } = await params;

  if (!RESOLVE_LINK_URL) {
    return Response.redirect(FALLBACK_URL, 302);
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
    return Response.redirect(location ?? FALLBACK_URL, 302);
  } catch {
    return Response.redirect(FALLBACK_URL, 302);
  }
}
