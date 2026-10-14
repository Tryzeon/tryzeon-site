import type { AnalyticsPeriod } from './types.ts';

const MONTH_PARAM = /^(\d{4})-(\d{2})$/;

/** 任何看不懂的值都當成全期累計，不丟錯：這只是網址參數。 */
export function parsePeriod(raw: string | undefined): AnalyticsPeriod {
  const match = raw ? MONTH_PARAM.exec(raw) : null;
  if (!match) {
    return { kind: 'all' };
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    return { kind: 'all' };
  }
  return { kind: 'month', year, month };
}

export function formatPeriodParam(period: AnalyticsPeriod): string {
  return period.kind === 'all'
    ? 'all'
    : `${period.year}-${String(period.month).padStart(2, '0')}`;
}

export function periodLabel(period: AnalyticsPeriod): string {
  return period.kind === 'all'
    ? '全期累計'
    : `${period.year} 年 ${period.month} 月`;
}

export interface PeriodOption {
  value: string;
  label: string;
}

export function periodOptions(months: readonly AnalyticsPeriod[]): PeriodOption[] {
  const all: AnalyticsPeriod = { kind: 'all' };
  return [all, ...months].map((period) => ({
    value: formatPeriodParam(period),
    label: periodLabel(period),
  }));
}

/** 沒帶參數時預設最新有資料的月份；指定的月份沒資料也退回最新月份；完全沒資料才是全期。 */
export function resolvePeriod(
  raw: string | undefined,
  months: readonly AnalyticsPeriod[],
): AnalyticsPeriod {
  const requested = raw === undefined ? null : parsePeriod(raw);
  if (requested?.kind === 'all') return requested;
  if (
    requested &&
    months.some((m) => m.kind === 'month' && m.year === requested.year && m.month === requested.month)
  ) {
    return requested;
  }
  return months[0] ?? { kind: 'all' };
}
