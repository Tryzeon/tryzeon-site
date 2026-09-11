import { formatPeriodParam } from './period.ts';
import { funnelRates } from './rates.ts';
import type { AnalyticsPeriod, BrandAnalytics, FunnelRates, ProductAnalytics } from './types.ts';

export interface FunnelLead {
  label: string;
  href: string | null;
  imageUrl: string | null;
  icon: 'store' | 'product';
  muted: boolean;
}

export interface FunnelRow {
  id: string;
  lead: FunnelLead;
  counts: Record<string, number>;
  rates: FunnelRates;
}

export interface CountColumn {
  key: string;
  label: string;
}

export interface RateColumn {
  key: keyof FunnelRates;
  label: string;
  hint: string;
}

export type SortDirection = 'asc' | 'desc';

function isRateKey(key: string, rates: FunnelRates): key is keyof FunnelRates {
  return key in rates;
}

export function sortValue(row: FunnelRow, key: string): number | null {
  return isRateKey(key, row.rates) ? row.rates[key] : (row.counts[key] ?? 0);
}

/** null（分母為 0）永遠排最後，不管升降冪。 */
export function compareSortValues(a: number | null, b: number | null, direction: SortDirection): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return direction === 'desc' ? b - a : a - b;
}

export const RATE_COLUMNS: readonly RateColumn[] = [
  { key: 'tryonRate', label: '試穿率', hint: '試穿 ÷ 瀏覽' },
  { key: 'clickRate', label: '導購率', hint: '導購點擊 ÷ 試穿' },
  { key: 'conversionRate', label: '整體轉換', hint: '導購點擊 ÷ 瀏覽' },
];

export const BRAND_COUNT_COLUMNS: readonly CountColumn[] = [
  { key: 'scanCount', label: '掃碼' },
  { key: 'viewCount', label: '瀏覽' },
  { key: 'tryonCount', label: '試穿' },
  { key: 'purchaseClickCount', label: '導購點擊' },
];

export const PRODUCT_COUNT_COLUMNS: readonly CountColumn[] = BRAND_COUNT_COLUMNS.filter(
  (column) => column.key !== 'scanCount',
);

export function brandHref(storeId: string, period: AnalyticsPeriod): string {
  return `/admin/brands/${storeId}?period=${formatPeriodParam(period)}`;
}

export function brandRows(brands: readonly BrandAnalytics[], period: AnalyticsPeriod): FunnelRow[] {
  return brands.map((brand) => ({
    id: brand.storeId,
    lead: {
      label: brand.storeName,
      href: brandHref(brand.storeId, period),
      imageUrl: brand.logoUrl,
      icon: 'store',
      muted: false,
    },
    counts: {
      scanCount: brand.scanCount,
      viewCount: brand.viewCount,
      tryonCount: brand.tryonCount,
      purchaseClickCount: brand.purchaseClickCount,
    },
    rates: funnelRates(brand),
  }));
}

export function productRows(products: readonly ProductAnalytics[]): FunnelRow[] {
  return products.map((product) => ({
    id: product.productId,
    lead: {
      label: product.productName ?? '已刪除商品',
      href: null,
      imageUrl: product.imageUrl,
      icon: 'product',
      muted: product.productName === null,
    },
    counts: {
      viewCount: product.viewCount,
      tryonCount: product.tryonCount,
      purchaseClickCount: product.purchaseClickCount,
    },
    rates: funnelRates(product),
  }));
}
