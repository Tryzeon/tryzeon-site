import type { SupabaseClient } from '@supabase/supabase-js';

import type { ProductMonthRow, ProductRow, ScanMonthRow, StoreMonthRow, StoreRow } from './aggregate.ts';

/**
 * 用使用者自己的 session 打 PostgREST，能不能讀由 RLS 決定。數字全部來自資料庫端
 * 已經按月聚合好的 view（migration 20260911020000），這裡只讀列、不算數。
 */

/** Supabase 預設的 db.max_rows；沒有上限的讀取都分頁。 */
export const PAGE_SIZE = 1000;

type Row = Record<string, unknown>;

export interface PageResult {
  data: unknown[] | null;
  error: { message: string } | null;
}

/**
 * from/to 是含頭尾的列位移。每個呼叫端都必須以唯一鍵排序：LIMIT/OFFSET 沒有
 * ORDER BY 時在不同語句間順序不穩，分頁會漏列或重複。
 */
export async function readAll<T>(
  page: (from: number, to: number) => PromiseLike<PageResult>,
  parseRow: (row: Row) => T | null,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await page(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    for (const raw of data ?? []) {
      const row = parseRow(asRow(raw));
      if (row !== null) rows.push(row);
    }
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

function asRow(value: unknown): Row {
  return typeof value === 'object' && value !== null ? (value as Row) : {};
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asMonth(row: Row): { year: number; month: number } | null {
  return typeof row.year === 'number' && typeof row.month === 'number'
    ? { year: row.year, month: row.month }
    : null;
}

export async function fetchIsAdmin(client: SupabaseClient): Promise<boolean> {
  const { data, error } = await client.rpc('is_admin');
  if (error) throw new Error(`is_admin failed: ${error.message}`);
  return data === true;
}

function parseStore(row: Row): StoreRow | null {
  const id = asString(row.id);
  return id ? { id, name: asString(row.name), logoPath: asString(row.logo_path) } : null;
}

export function readStores(client: SupabaseClient): Promise<StoreRow[]> {
  return readAll(
    (from, to) => client.from('store_profiles').select('id, name, logo_path').order('id').range(from, to),
    parseStore,
  );
}

export async function readStore(client: SupabaseClient, storeId: string): Promise<StoreRow | null> {
  const { data, error } = await client
    .from('store_profiles')
    .select('id, name, logo_path')
    .eq('id', storeId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data === null ? null : parseStore(asRow(data));
}

export function readProducts(client: SupabaseClient, storeId: string): Promise<ProductRow[]> {
  return readAll(
    (from, to) =>
      client.from('products').select('id, name, image_paths').eq('store_id', storeId).order('id').range(from, to),
    (row) => {
      const id = asString(row.id);
      const name = asString(row.name);
      if (!id || !name) return null;
      const paths = Array.isArray(row.image_paths) ? row.image_paths : [];
      return { id, name, imagePath: asString(paths[0]) };
    },
  );
}

const FUNNEL_COLUMNS = 'year, month, view_count, tryon_count, purchase_click_count';

function parseFunnel(row: Row) {
  const month = asMonth(row);
  return month && {
    ...month,
    viewCount: asNumber(row.view_count),
    tryonCount: asNumber(row.tryon_count),
    purchaseClickCount: asNumber(row.purchase_click_count),
  };
}

export function readStoreMonths(client: SupabaseClient): Promise<StoreMonthRow[]> {
  return readAll(
    (from, to) =>
      client
        .from('analytics_store_monthly_summary')
        .select(`store_id, ${FUNNEL_COLUMNS}`)
        .order('store_id')
        .order('year')
        .order('month')
        .range(from, to),
    (row) => {
      const storeId = asString(row.store_id);
      const funnel = parseFunnel(row);
      return storeId && funnel ? { storeId, ...funnel } : null;
    },
  );
}

export function readProductMonths(client: SupabaseClient, storeId: string): Promise<ProductMonthRow[]> {
  return readAll(
    (from, to) =>
      client
        .from('analytics_product_monthly_summary')
        .select(`product_id, ${FUNNEL_COLUMNS}`)
        .eq('store_id', storeId)
        .order('product_id')
        .order('year')
        .order('month')
        .range(from, to),
    (row) => {
      const productId = asString(row.product_id);
      const funnel = parseFunnel(row);
      return productId && funnel ? { productId, ...funnel } : null;
    },
  );
}

export function readScanMonths(client: SupabaseClient, storeId?: string): Promise<ScanMonthRow[]> {
  return readAll(
    (from, to) => {
      let query = client.from('scan_store_monthly_summary').select('store_id, year, month, scan_count');
      if (storeId) query = query.eq('store_id', storeId);
      return query.order('store_id').order('year').order('month').range(from, to);
    },
    (row) => {
      const scanStoreId = asString(row.store_id);
      const month = asMonth(row);
      return scanStoreId && month ? { storeId: scanStoreId, ...month, scanCount: asNumber(row.scan_count) } : null;
    },
  );
}
