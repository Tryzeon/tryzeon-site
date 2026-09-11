import type { FunnelCounts, FunnelRates } from './types.ts';

function ratio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : numerator / denominator;
}

export function funnelRates(counts: FunnelCounts): FunnelRates {
  return {
    tryonRate: ratio(counts.tryonCount, counts.viewCount),
    clickRate: ratio(counts.purchaseClickCount, counts.tryonCount),
    conversionRate: ratio(counts.purchaseClickCount, counts.viewCount),
  };
}

export function sumFunnel(rows: readonly FunnelCounts[]): FunnelCounts {
  return rows.reduce<FunnelCounts>(
    (total, row) => ({
      viewCount: total.viewCount + row.viewCount,
      tryonCount: total.tryonCount + row.tryonCount,
      purchaseClickCount: total.purchaseClickCount + row.purchaseClickCount,
    }),
    { viewCount: 0, tryonCount: 0, purchaseClickCount: 0 },
  );
}

export function formatRate(rate: number | null): string {
  return rate === null ? '—' : `${(rate * 100).toFixed(1)}%`;
}

export function formatCount(count: number): string {
  return new Intl.NumberFormat('zh-TW').format(count);
}
