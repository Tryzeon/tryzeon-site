/**
 * 商品預覽資料，只服務 `/product/{id}` 的 og:*。
 *
 * 走 Supabase REST 而不是 `@supabase/supabase-js`：這裡只有一個 anon 讀取，為它加一個
 * 依賴不划算。`products` 的 RLS 是 `Anyone can view all products`，所以 anon key 夠用。
 *
 * 圖片主機寫死而不是再開一個環境變數 —— `next.config.js` 的 CSP `img-src` 與
 * `images.remotePatterns` 已經各寫死一次，第三處跟著它們走比多一個會漂移的設定安全。
 */

const IMAGES_BASE_URL = 'https://images.tryzeon.com';

/**
 * 預覽卡的圖固定 1200×630。這個尺寸決定 LINE / Messenger 顯示的是滿版大卡還是角落小
 * 縮圖 —— 不是美觀問題。原圖是直式（實測 0.61–1.19），所以用 `fit=pad` 補底色而不是
 * `fit=cover`：服飾照被裁掉領口或裙襬比左右留白難看得多。底色取設計系統的 `#FAFAFA`。
 * 轉檔由 Cloudflare Image Resizing 做，這個 zone 已經開了。
 */
const OG_TRANSFORM =
  'cdn-cgi/image/width=1200,height=630,fit=pad,background=%23FAFAFA';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const SELECT = 'name,price,image_paths,store_profiles!products_store_id_fkey(name)';

/** PostgREST 對非 UUID 的 `id=eq.` 回 400，先擋掉省一次往返與一則假錯誤。 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ProductPreview {
  name: string;
  storeName: string | null;
  price: number | null;
  imageUrl: string | null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function parseRow(value: unknown): ProductPreview | null {
  const row = (value ?? {}) as Record<string, unknown>;
  const name = asString(row.name);
  if (!name) return null;

  const paths = Array.isArray(row.image_paths) ? row.image_paths : [];
  const path = asString(paths[0]);
  const store = (row.store_profiles ?? {}) as Record<string, unknown>;

  return {
    name,
    storeName: asString(store.name),
    price: typeof row.price === 'number' ? row.price : null,
    imageUrl: path ? `${IMAGES_BASE_URL}/${OG_TRANSFORM}/${path}` : null,
  };
}

/**
 * 讀一個商品的預覽資料。任何失敗都回 null，由呼叫端退回通用文案 —— 這頁是 Universal
 * Link 的落地點，不能因為抓不到商品就 404 或丟例外。
 */
export async function fetchProductPreview(id: string): Promise<ProductPreview | null> {
  const baseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey || !UUID.test(id)) {
    return null;
  }

  try {
    const res = await fetch(
      `${baseUrl}/rest/v1/products?id=eq.${id}&select=${SELECT}`,
      { headers: { apikey: anonKey }, next: { revalidate: 3600 } },
    );
    if (!res.ok) {
      console.error(`product preview lookup failed: ${res.status}`);
      return null;
    }

    const rows = (await res.json()) as unknown;
    return Array.isArray(rows) && rows.length > 0 ? parseRow(rows[0]) : null;
  } catch (err) {
    console.error('product preview upstream unreachable:', err);
    return null;
  }
}
