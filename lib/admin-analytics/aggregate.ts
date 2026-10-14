import { publicImageUrl } from '../images.ts';
import type { AnalyticsPeriod, BrandAnalytics, FunnelCounts, ProductAnalytics } from './types.ts';

/** 純計算：吃 view 已經按店／商品／月聚合好的列，不碰資料庫，所以能用固定資料測。 */
export interface MonthRow {
  year: number;
  month: number;
}

export interface StoreMonthRow extends MonthRow, FunnelCounts {
  storeId: string;
}

export interface ProductMonthRow extends MonthRow, FunnelCounts {
  productId: string;
}

export interface ScanMonthRow extends MonthRow {
  storeId: string;
  scanCount: number;
}

export interface StoreRow {
  id: string;
  name: string | null;
  logoPath: string | null;
}

export interface ProductRow {
  id: string;
  name: string;
  imagePath: string | null;
}

const ZERO: FunnelCounts = { viewCount: 0, tryonCount: 0, purchaseClickCount: 0 };

export function inPeriod(row: MonthRow, period: AnalyticsPeriod): boolean {
  return period.kind === 'all' || (row.year === period.year && row.month === period.month);
}

function sumBy<R extends FunnelCounts>(rows: readonly R[], key: (row: R) => string): Map<string, FunnelCounts> {
  const totals = new Map<string, FunnelCounts>();
  for (const row of rows) {
    const total = totals.get(key(row)) ?? ZERO;
    totals.set(key(row), {
      viewCount: total.viewCount + row.viewCount,
      tryonCount: total.tryonCount + row.tryonCount,
      purchaseClickCount: total.purchaseClickCount + row.purchaseClickCount,
    });
  }
  return totals;
}

/** 已刪除的商品沒有名字，排在所有有名字的後面（等同 SQL 的 NULLS LAST）。 */
function compareNullableNames(a: string | null, b: string | null): number {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  return a.localeCompare(b);
}

/** 每家店一列，零流量的店也在；瀏覽數降冪，同分照店名。 */
export function brandAnalytics(
  stores: readonly StoreRow[],
  storeMonths: readonly StoreMonthRow[],
  scanMonths: readonly ScanMonthRow[],
  period: AnalyticsPeriod,
): BrandAnalytics[] {
  const funnels = sumBy(storeMonths.filter((row) => inPeriod(row, period)), (row) => row.storeId);
  const scans = new Map<string, number>();
  for (const row of scanMonths) {
    if (inPeriod(row, period)) scans.set(row.storeId, (scans.get(row.storeId) ?? 0) + row.scanCount);
  }
  return stores
    .map((store) => ({
      storeId: store.id,
      storeName: store.name ?? '店家',
      logoUrl: publicImageUrl(store.logoPath),
      scanCount: scans.get(store.id) ?? 0,
      ...(funnels.get(store.id) ?? ZERO),
    }))
    .sort((a, b) => b.viewCount - a.viewCount || a.storeName.localeCompare(b.storeName));
}

/** 有事件的商品各一列；已刪除的商品保留數字、名稱為 null。 */
export function productAnalytics(
  productMonths: readonly ProductMonthRow[],
  products: readonly ProductRow[],
  period: AnalyticsPeriod,
): ProductAnalytics[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const funnels = sumBy(productMonths.filter((row) => inPeriod(row, period)), (row) => row.productId);
  return [...funnels.entries()]
    .map(([productId, funnel]) => {
      const product = byId.get(productId);
      return {
        productId,
        productName: product?.name ?? null,
        imageUrl: publicImageUrl(product?.imagePath ?? null),
        ...funnel,
      };
    })
    .sort((a, b) => b.viewCount - a.viewCount || compareNullableNames(a.productName, b.productName));
}

/** 出現過的月份，去重，新到舊。 */
export function analyticsMonths(rows: readonly MonthRow[]): AnalyticsPeriod[] {
  const seen = new Map<string, AnalyticsPeriod>();
  for (const { year, month } of rows) seen.set(`${year}-${month}`, { kind: 'month', year, month });
  return [...seen.values()].sort((a, b) =>
    a.kind === 'month' && b.kind === 'month' ? b.year - a.year || b.month - a.month : 0,
  );
}
