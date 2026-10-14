'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * WebVitals - 開發環境的 Core Web Vitals 提示（layout 只在 development 掛載）。
 * 評級用 web-vitals 自帶的 rating，不另維護閾值表。
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (metric.rating !== 'good') {
      console.warn(`[web-vitals] ${metric.name} ${metric.rating}:`, metric.value);
    }
  });

  return null;
}
