import type { SupabaseClient } from '@supabase/supabase-js';

import { analyticsMonths, brandAnalytics, productAnalytics } from './aggregate.ts';
import {
  fetchIsAdmin,
  readProductMonths,
  readProducts,
  readScanMonths,
  readStore,
  readStoreMonths,
  readStores,
} from './data.ts';
import { resolvePeriod } from './period.ts';
import type { AnalyticsPeriod, BrandAnalytics, ProductAnalytics } from './types.ts';

/**
 * RLS 對非 admin 不會報錯，只會回空集合（或店主自己的那幾列），所以先明確問一次
 * is_admin()；頁面靠這個錯誤決定顯示「無存取權限」。
 */
export class AdminAccessDeniedError extends Error {
  constructor() {
    super('admin access denied');
    this.name = 'AdminAccessDeniedError';
  }
}

export interface OverviewData {
  months: AnalyticsPeriod[];
  period: AnalyticsPeriod;
  brands: BrandAnalytics[];
}

export interface BrandData {
  months: AnalyticsPeriod[];
  period: AnalyticsPeriod;
  brand: BrandAnalytics;
  products: ProductAnalytics[];
}

async function assertAdmin(client: SupabaseClient): Promise<void> {
  if (!(await fetchIsAdmin(client))) throw new AdminAccessDeniedError();
}

/** 兩個 view 都是「每店每月一列」，全期讀完也只有店數 × 月數列，所以一次讀完、在記憶體裡切期間。 */
export async function fetchOverview(
  client: SupabaseClient,
  rawPeriod: string | undefined,
): Promise<OverviewData> {
  await assertAdmin(client);
  const [stores, storeMonths, scanMonths] = await Promise.all([
    readStores(client),
    readStoreMonths(client),
    readScanMonths(client),
  ]);
  const months = analyticsMonths([...storeMonths, ...scanMonths]);
  const period = resolvePeriod(rawPeriod, months);
  return { months, period, brands: brandAnalytics(stores, storeMonths, scanMonths, period) };
}

/** 店家不存在回 null，交給頁面 notFound()。月份清單維持全站一致，所以仍讀店級 view。 */
export async function fetchBrand(
  client: SupabaseClient,
  storeId: string,
  rawPeriod: string | undefined,
): Promise<BrandData | null> {
  await assertAdmin(client);
  const [store, storeMonths, scanMonths, productMonths, products] = await Promise.all([
    readStore(client, storeId),
    readStoreMonths(client),
    readScanMonths(client),
    readProductMonths(client, storeId),
    readProducts(client, storeId),
  ]);
  if (!store) return null;
  const months = analyticsMonths([...storeMonths, ...scanMonths]);
  const period = resolvePeriod(rawPeriod, months);
  return {
    months,
    period,
    brand: brandAnalytics([store], storeMonths, scanMonths, period)[0],
    products: productAnalytics(productMonths, products, period),
  };
}
