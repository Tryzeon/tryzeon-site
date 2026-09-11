import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { AccessDenied } from '@/components/admin/AccessDenied';
import { DashboardBodySkeleton, HeadingBones, SelectorBone } from '@/components/admin/DashboardSkeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { FunnelTable } from '@/components/admin/FunnelTable';
import { KpiTiles } from '@/components/admin/KpiTiles';
import { PeriodSelector } from '@/components/admin/PeriodSelector';
import { PendingBody } from '@/components/admin/PeriodTransition';
import { formatPeriodParam, periodOptions } from '@/lib/admin-analytics/period';
import { AdminAccessDeniedError, type BrandData, fetchBrand } from '@/lib/admin-analytics/queries';
import { requireSession } from '@/lib/admin-analytics/session';
import { PRODUCT_COUNT_COLUMNS, RATE_COLUMNS, productRows } from '@/lib/admin-analytics/table';
import { brandTiles } from '@/lib/admin-analytics/tiles';
import { isUuid } from '@/lib/uuid';

interface BrandPageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ period?: string }>;
}

interface SectionProps {
  data: Promise<BrandData | null>;
}

type Settled = { kind: 'ok'; brand: BrandData } | { kind: 'denied' };

/** 找不到店家就在這裡 notFound()，兩個區塊都會被同一個 not-found 頁取代。 */
async function settle(data: Promise<BrandData | null>): Promise<Settled> {
  try {
    const brand = await data;
    if (!brand) notFound();
    return { kind: 'ok', brand };
  } catch (err) {
    if (err instanceof AdminAccessDeniedError) return { kind: 'denied' };
    throw err;
  }
}

async function BrandHeading({ data }: SectionProps) {
  const settled = await settle(data);
  if (settled.kind === 'denied') return null;
  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] text-neo-blue">品牌</p>
      <h1 className="mt-2 font-serif text-3xl font-black text-neo-ink cjk-punct md:text-4xl">
        {settled.brand.brand.storeName}
      </h1>
    </div>
  );
}

async function BrandSelector({ data }: SectionProps) {
  const settled = await settle(data);
  if (settled.kind === 'denied') return null;
  return (
    <PeriodSelector
      value={formatPeriodParam(settled.brand.period)}
      options={periodOptions(settled.brand.months)}
    />
  );
}

async function BrandBody({ data }: SectionProps) {
  const settled = await settle(data);
  if (settled.kind === 'denied') return <AccessDenied />;
  const { brand, products } = settled.brand;

  return (
    <>
      <KpiTiles tiles={brandTiles(brand)} />
      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neo-steel">
          商品漏斗
        </h2>
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <FunnelTable
            leadLabel="商品"
            countColumns={PRODUCT_COUNT_COLUMNS}
            rateColumns={RATE_COLUMNS}
            rows={productRows(products)}
            defaultSortKey="viewCount"
          />
        )}
      </section>
    </>
  );
}

export default async function AdminBrandPage({ params, searchParams }: BrandPageProps) {
  const { storeId } = await params;
  const { period: rawPeriod } = await searchParams;
  if (!isUuid(storeId)) {
    notFound();
  }

  const { supabase } = await requireSession();
  const data = fetchBrand(supabase, storeId, rawPeriod);
  data.catch(() => undefined);
  const backParam = rawPeriod === undefined ? '' : `?period=${rawPeriod}`;

  return (
    <div className="space-y-8">
      <Link
        href={`/admin${backParam}`}
        className="group inline-flex items-center gap-2 rounded text-sm font-medium text-neo-steel transition-colors hover:text-neo-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        回到總覽
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Suspense fallback={<HeadingBones />}>
          <BrandHeading data={data} />
        </Suspense>
        <Suspense fallback={<SelectorBone />}>
          <BrandSelector data={data} />
        </Suspense>
      </div>

      <Suspense key={rawPeriod ?? ''} fallback={<DashboardBodySkeleton />}>
        <PendingBody>
          <BrandBody data={data} />
        </PendingBody>
      </Suspense>
    </div>
  );
}
