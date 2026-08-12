/**
 * 短連結解析的 client。
 *
 * `short-links`（Supabase edge function）擁有查表、User-Agent 判定與開啟事件記錄，
 * 並回傳要把使用者送去哪裡。本站只負責轉送。
 */

/**
 * `expired` 與 `unavailable` 必須分開：把後端故障顯示成「連結已失效」，等於告訴店家的
 * 客人他的立牌沒用 —— 而重新掃一次就會好。上游用狀態碼區分這兩者（404 vs 5xx）。
 */
export type ShortLinkResolution =
  | { state: 'ok'; url: string }
  | { state: 'expired' }
  | { state: 'unavailable' };

const UNAVAILABLE: ShortLinkResolution = { state: 'unavailable' };

/**
 * 解析一個短連結 code。
 *
 * `cache: 'no-store'` 是正確性依賴，不只是新鮮度：每次呼叫都會在 upstream 記一筆開啟
 * 事件。加上快取會讓掃碼數少算。請不要把它換成 revalidate。
 */
export async function resolveShortLink(
  code: string,
  userAgent: string,
): Promise<ShortLinkResolution> {
  const endpoint = process.env.SHORT_LINKS_URL;
  if (!endpoint) {
    return UNAVAILABLE;
  }

  try {
    const upstream = await fetch(`${endpoint}/${encodeURIComponent(code)}`, {
      headers: { 'user-agent': userAgent },
      cache: 'no-store',
    });

    if (upstream.status === 404) {
      return { state: 'expired' };
    }
    if (!upstream.ok) {
      console.error(`short link upstream failed: ${upstream.status}`);
      return UNAVAILABLE;
    }

    const body = (await upstream.json()) as Record<string, unknown>;
    return typeof body.url === 'string' && body.url.length > 0
      ? { state: 'ok', url: body.url }
      : UNAVAILABLE;
  } catch (err) {
    console.error('short link upstream unreachable:', err);
    return UNAVAILABLE;
  }
}
