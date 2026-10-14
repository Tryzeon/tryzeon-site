import { formatCount, formatRate, funnelRates, sumFunnel } from './rates.ts';
import type { BrandAnalytics, FunnelCounts, FunnelRates } from './types.ts';

export interface KpiTile {
  label: string;
  value: string;
  hint: string | null;
}

function countTiles(counts: FunnelCounts, scanCount: number): KpiTile[] {
  return [
    { label: '掃碼', value: formatCount(scanCount), hint: null },
    { label: '瀏覽', value: formatCount(counts.viewCount), hint: null },
    { label: '試穿', value: formatCount(counts.tryonCount), hint: null },
    { label: '導購點擊', value: formatCount(counts.purchaseClickCount), hint: null },
  ];
}

function rateTiles(rates: FunnelRates): KpiTile[] {
  return [
    { label: '試穿率', value: formatRate(rates.tryonRate), hint: '試穿 ÷ 瀏覽' },
    { label: '導購率', value: formatRate(rates.clickRate), hint: '導購點擊 ÷ 試穿' },
    { label: '整體轉換', value: formatRate(rates.conversionRate), hint: '導購點擊 ÷ 瀏覽' },
  ];
}

export function overviewTiles(brands: readonly BrandAnalytics[]): KpiTile[] {
  const totals = sumFunnel(brands);
  const scans = brands.reduce((sum, brand) => sum + brand.scanCount, 0);
  return [...countTiles(totals, scans), ...rateTiles(funnelRates(totals))];
}

export function brandTiles(brand: BrandAnalytics): KpiTile[] {
  return [...countTiles(brand, brand.scanCount), ...rateTiles(funnelRates(brand))];
}
