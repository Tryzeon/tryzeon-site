/**
 * 短連結解析的 client 與它的傳遞格式。
 *
 * `short-links`（Supabase edge function）擁有查表、User-Agent 判定與開啟事件記錄，
 * 並回傳目的地與送達方式；使用者看得到的落地頁由本站算繪，因為呈現層屬於擁有設計
 * 系統的這一端。
 *
 * 唯一的呼叫端是 `proxy.ts`。決策必須在算繪開始前做完：一旦 `generateMetadata` 完成、
 * 回應開始串流，Server Component 裡的 `redirect()` 就無法再設狀態碼，只能降級成一整頁
 * HTML 加上延遲的 meta refresh —— 那是最不該變慢的那條路徑。
 */

export interface ShortLinkStore {
  /** 店家名稱。null 表示店家沒有設定，顯示用的預設值由本站決定。 */
  name: string | null;
  /** 只用於 og:image —— 頁面上不放遠端圖片，CSP 的 img-src 不允許。 */
  logoUrl: string | null;
}

/**
 * `expired` 與 `unavailable` 必須分開：把後端故障顯示成「連結已失效」，等於告訴店家的
 * 客人他的立牌沒用 —— 而重新掃一次就會好。上游用狀態碼區分這兩者（404 vs 5xx）。
 */
export type ShortLinkResolution =
  | {
    state: 'ok';
    url: string;
    delivery: 'redirect' | 'interstitial';
    store: ShortLinkStore;
  }
  | { state: 'expired' }
  | { state: 'unavailable' };

const UNAVAILABLE: ShortLinkResolution = { state: 'unavailable' };

/**
 * proxy 把落地頁需要的資料塞進這一個 request header 交給頁面。
 *
 * 只用一個鍵、而且無條件設定，是為了讓用戶端傳來的同名 header 一定被覆蓋 —— 攤平成
 * 多個鍵並條件式設定的話，沒被設到的那些就會留著呼叫者捏造的值。
 */
export const SHORT_LINK_HEADER = 'x-shortlink';

/** 落地頁需要的資料。狀態不必傳：能算繪到頁面就必然是 interstitial。 */
export interface ShortLinkView {
  url: string;
  store: ShortLinkStore;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function parseStore(value: unknown): ShortLinkStore {
  const raw = (value ?? {}) as Record<string, unknown>;
  return { name: asString(raw.name), logoUrl: asString(raw.logoUrl) };
}

/** header 只能放 latin-1，而店名是中文。 */
export function encodeView(view: ShortLinkView): string {
  return encodeURIComponent(JSON.stringify(view));
}

/** header 不存在或壞掉代表 proxy 沒跑過 —— 回 null，頁面據此顯示故障而非失效。 */
export function decodeView(raw: string | null): ShortLinkView | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>;
    const url = asString(parsed.url);
    return url ? { url, store: parseStore(parsed.store) } : null;
  } catch {
    return null;
  }
}

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
    const url = asString(body.url);
    if (!url) {
      return UNAVAILABLE;
    }

    return {
      state: 'ok',
      url,
      delivery: body.delivery === 'interstitial' ? 'interstitial' : 'redirect',
      store: parseStore(body.store),
    };
  } catch (err) {
    console.error('short link upstream unreachable:', err);
    return UNAVAILABLE;
  }
}
