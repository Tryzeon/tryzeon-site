export type AnalyticsPeriod =
  | { kind: 'all' }
  | { kind: 'month'; year: number; month: number };

export interface FunnelCounts {
  viewCount: number;
  tryonCount: number;
  purchaseClickCount: number;
}

/** 分母為 0 時是 null，UI 顯示「—」而不是 0%。 */
export interface FunnelRates {
  tryonRate: number | null;
  clickRate: number | null;
  conversionRate: number | null;
}

export interface BrandAnalytics extends FunnelCounts {
  storeId: string;
  storeName: string;
  logoUrl: string | null;
  scanCount: number;
}

export interface ProductAnalytics extends FunnelCounts {
  productId: string;
  productName: string | null;
  imageUrl: string | null;
}
