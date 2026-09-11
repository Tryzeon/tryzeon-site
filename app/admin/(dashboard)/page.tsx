import { Suspense } from 'react';

import { AccessDenied } from '@/components/admin/AccessDenied';
import { DashboardBodySkeleton, SelectorBone } from '@/components/admin/DashboardSkeleton';
import { FunnelTable } from '@/components/admin/FunnelTable';
import { KpiTiles } from '@/components/admin/KpiTiles';
import { PeriodSelector } from '@/components/admin/PeriodSelector';
import { PendingBody } from '@/components/admin/PeriodTransition';
import { formatPeriodParam, periodOptions } from '@/lib/admin-analytics/period';
import { AdminAccessDeniedError, fetchOverview, type OverviewData } from '@/lib/admin-analytics/queries';
import { requireSession } from '@/lib/admin-analytics/session';
import { BRAND_COUNT_COLUMNS, RATE_COLUMNS, brandRows } from '@/lib/admin-analytics/table';
import { overviewTiles } from '@/lib/admin-analytics/tiles';

interface OverviewPageProps {
  searchParams: Promise<{ period?: string }>;
}

interface SectionProps {
  data: Promise<OverviewData>;
}

async function settle(data: Promise<OverviewData>): Promise<OverviewData | null> {
  try {
    return await data;
  } catch (err) {
    if (err instanceof AdminAccessDeniedError) return null;
    throw err;
  }
}

async function OverviewSelector({ data }: SectionProps) {
  const overview = await settle(data);
  if (!overview) return null;
  return (
    <PeriodSelector
      value={formatPeriodParam(overview.period)}
      options={periodOptions(overview.months)}
    />
  );
}

async function OverviewBody({ data }: SectionProps) {
  const overview = await settle(data);
  if (!overview) return <AccessDenied />;
  const { period, brands } = overview;

  return (
    <>
      <KpiTiles tiles={overviewTiles(brands)} />
      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neo-steel">
          各品牌漏斗
        </h2>
        <FunnelTable
          leadLabel="品牌"
          countColumns={BRAND_COUNT_COLUMNS}
          rateColumns={RATE_COLUMNS}
          rows={brandRows(brands, period)}
          defaultSortKey="viewCount"
        />
      </section>
    </>
  );
}

/**
 * 資料只抓一次，兩個區塊各自等同一個 promise。選單所在的 Suspense 不帶 key，換期間時
 * 舊選單留在原位；內容區的 Suspense 以期間為 key，直接載入網址時串流出骨架，
 * client 端換期間則由 PendingBody 立刻換成骨架。
 */
export default async function AdminOverviewPage({ searchParams }: OverviewPageProps) {
  const { period: rawPeriod } = await searchParams;
  const { supabase } = await requireSession();
  const data = fetchOverview(supabase, rawPeriod);
  data.catch(() => undefined);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-neo-blue">Dashboard</p>
          <h1 className="mt-2 font-serif text-3xl font-black text-neo-ink cjk-punct md:text-4xl">
            品牌成效總覽
          </h1>
          <p className="mt-2 text-sm text-neo-steel">每一家品牌從掃碼到導購的完整漏斗。</p>
        </div>
        <Suspense fallback={<SelectorBone />}>
          <OverviewSelector data={data} />
        </Suspense>
      </div>

      <Suspense key={rawPeriod ?? ''} fallback={<DashboardBodySkeleton />}>
        <PendingBody>
          <OverviewBody data={data} />
        </PendingBody>
      </Suspense>
    </div>
  );
}
