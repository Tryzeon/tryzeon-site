/**
 * 短連結解析的 client。
 *
 * `short-links`（Supabase edge function）擁有查表、User-Agent 判定與開啟事件記錄，
 * 並回傳要把使用者送去哪裡。本站只負責轉送。
 */

/**
 * 解析一個短連結 code，回傳目的地；未知、已停用或後端故障都回 null。
 *
 * `cache: 'no-store'` 是正確性依賴，不只是新鮮度：每次呼叫都會在 upstream 記一筆開啟
 * 事件。加上快取會讓掃碼數少算。請不要把它換成 revalidate。
 */
export async function resolveShortLink(
  code: string,
  userAgent: string,
): Promise<string | null> {
  const endpoint = process.env.SHORT_LINKS_URL;
  if (!endpoint) {
    return null;
  }

  try {
    const upstream = await fetch(`${endpoint}/${encodeURIComponent(code)}`, {
      headers: { 'user-agent': userAgent },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return null;
    }

    const body = (await upstream.json()) as Record<string, unknown>;
    return typeof body.url === 'string' && body.url.length > 0 ? body.url : null;
  } catch {
    return null;
  }
}
