import { NextResponse, type NextRequest } from 'next/server';

import { SHORT_LINK_HEADER, encodeView, resolveShortLink } from '@/lib/short-link';
import { refreshSession } from '@/lib/supabase/proxy';

/**
 * 短連結的決策點。
 *
 * 為什麼在 proxy 而不是在 `/s/[code]` 頁面裡：`generateMetadata` 一完成，回應就開始
 * 串流，此時 Server Component 呼叫 `redirect()` 已經無法設狀態碼，Next 只能改用一整頁
 * HTML 加上延遲一秒的 meta refresh。LINE 內開啟是這條流程最該快的路徑，不能讓它多
 * 下載一份文件再等一秒。proxy 在算繪開始前就決定，所以那條路徑是乾淨的 302。
 *
 * 這裡有四種出口，只有 interstitial 需要算繪；其餘三種都是 302，其中失效與故障導向
 * 既有的靜態頁。**這個函式跑在每一個 `/s/*` 上，包括那條本來就會成功的 LINE 路徑**，
 * 所以請保持它極簡。
 */
export const config = {
  matcher: ['/s/:code+', '/admin/:path*'],
};

/** 掃碼與後台的回應都取決於請求者，且不該被任何中間層留下來。 */
function withNoStore(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return handleAdmin(request);
  }
  return handleShortLink(request);
}

async function handleShortLink(request: NextRequest): Promise<NextResponse> {
  const code = request.nextUrl.pathname.split('/').filter(Boolean).pop() ?? '';
  const resolution = await resolveShortLink(code, request.headers.get('user-agent') ?? '');

  if (resolution.state === 'expired') {
    return withNoStore(NextResponse.redirect(new URL('/link-expired', request.url), 302));
  }
  if (resolution.state === 'unavailable') {
    return withNoStore(NextResponse.redirect(new URL('/link-unavailable', request.url), 302));
  }
  if (resolution.delivery === 'redirect') {
    return withNoStore(NextResponse.redirect(resolution.url, 302));
  }

  // 無條件覆寫，所以呼叫者自己帶的同名 header 拿不到任何作用。
  const headers = new Headers(request.headers);
  headers.set(
    SHORT_LINK_HEADER,
    encodeView({ url: resolution.url, store: resolution.store }),
  );

  return withNoStore(NextResponse.next({ request: { headers } }));
}

/** 登入頁與 OAuth callback 是唯二不需要 session 的 /admin 路徑。 */
const ADMIN_PUBLIC_PATHS: ReadonlySet<string> = new Set(['/admin/login', '/admin/auth/callback']);

/** 302 也要帶上剛刷新的 session cookie，否則瀏覽器和伺服器的 session 會脫節。 */
function redirectWithCookies(request: NextRequest, path: string, from: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(new URL(path, request.url), 302);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return withNoStore(redirect);
}

async function handleAdmin(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const { response, user } = await refreshSession(request);

  if (!user && !ADMIN_PUBLIC_PATHS.has(pathname)) {
    return redirectWithCookies(request, '/admin/login', response);
  }
  if (user && pathname === '/admin/login') {
    return redirectWithCookies(request, '/admin', response);
  }
  return withNoStore(response);
}
