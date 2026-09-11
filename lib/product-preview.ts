/**
 * 商品預覽資料，只服務 `/product/{id}` 的 og:*。
 *
 * 走 Supabase REST 而不是 `@supabase/supabase-js`：這裡只有一個 anon 讀取，為它加一個
 * 依賴不划算。`products` 的 RLS 是 `Anyone can view all products`，所以 anon key 夠用。
 */

import { publicImageUrl } from '@/lib/images';
import { isUuid } from '@/lib/uuid';

const SELECT = 'name,price,image_paths,store_profiles!products_store_id_fkey(name)';

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
    imageUrl: publicImageUrl(path),
  };
}

/**
 * 讀一個商品的預覽資料。任何失敗都回 null，由呼叫端退回通用文案 —— 這頁是 Universal
 * Link 的落地點，不能因為抓不到商品就 404 或丟例外。
 */
export async function fetchProductPreview(id: string): Promise<ProductPreview | null> {
  const baseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey || !isUuid(id)) {
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
