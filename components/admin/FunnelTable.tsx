'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Shirt, Store } from 'lucide-react';

import { formatCount, formatRate } from '@/lib/admin-analytics/rates';
import { compareSortValues, sortValue } from '@/lib/admin-analytics/table';
import type { CountColumn, FunnelLead, FunnelRow, RateColumn, SortDirection } from '@/lib/admin-analytics/table';
import { MeterBar } from './MeterBar';

interface FunnelTableProps {
  leadLabel: string;
  countColumns: readonly CountColumn[];
  rateColumns: readonly RateColumn[];
  rows: readonly FunnelRow[];
  defaultSortKey: string;
}

interface SortState {
  key: string;
  direction: SortDirection;
}

function LeadCell({ lead }: { lead: FunnelLead }) {
  const Icon = lead.icon === 'store' ? Store : Shirt;
  const content = (
    <span className="flex items-center gap-3">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neo-smoke bg-white">
        {lead.imageUrl ? (
          <Image src={lead.imageUrl} alt="" fill sizes="32px" className="object-cover" />
        ) : (
          <Icon className="h-4 w-4 text-neo-mist" aria-hidden="true" />
        )}
      </span>
      <span className={lead.muted ? 'text-neo-mist' : 'font-medium text-neo-ink'}>{lead.label}</span>
    </span>
  );

  return lead.href ? (
    <Link
      href={lead.href}
      className="inline-block rounded hover:text-neo-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan"
    >
      {content}
    </Link>
  ) : (
    content
  );
}

export function FunnelTable({ leadLabel, countColumns, rateColumns, rows, defaultSortKey }: FunnelTableProps) {
  const [sort, setSort] = useState<SortState>({ key: defaultSortKey, direction: 'desc' });

  const maxima = useMemo(
    () =>
      Object.fromEntries(
        countColumns.map((column) => [
          column.key,
          rows.reduce((max, row) => Math.max(max, row.counts[column.key] ?? 0), 0),
        ]),
      ),
    [countColumns, rows],
  );

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) =>
        compareSortValues(sortValue(a, sort.key), sortValue(b, sort.key), sort.direction),
      ),
    [rows, sort],
  );

  const toggle = (key: string) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'desc' ? 'asc' : 'desc' }
        : { key, direction: 'desc' },
    );

  const headerButton = (key: string, label: string, hint?: string) => {
    const active = sort.key === key;
    const Arrow = sort.direction === 'desc' ? ArrowDown : ArrowUp;
    return (
      <button
        type="button"
        onClick={() => toggle(key)}
        title={hint}
        className={`inline-flex items-center gap-1 rounded font-mono text-[11px] uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan ${
          active ? 'text-neo-blue' : 'text-neo-steel hover:text-neo-ink'
        }`}
      >
        {label}
        {active && <Arrow className="h-3 w-3" aria-hidden="true" />}
      </button>
    );
  };

  const ariaSort = (key: string): 'ascending' | 'descending' | 'none' =>
    sort.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/60 bg-white/70 shadow-neo backdrop-blur-xl">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-neo-smoke/70 text-left">
            <th scope="col" className="px-5 py-4 font-mono text-[11px] uppercase tracking-[0.15em] text-neo-steel">
              {leadLabel}
            </th>
            {countColumns.map((column) => (
              <th key={column.key} scope="col" aria-sort={ariaSort(column.key)} className="px-4 py-4 text-right">
                {headerButton(column.key, column.label)}
              </th>
            ))}
            {rateColumns.map((column) => (
              <th key={column.key} scope="col" aria-sort={ariaSort(column.key)} className="px-4 py-4 text-right">
                {headerButton(column.key, column.label, column.hint)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className="border-b border-neo-smoke/40 last:border-b-0">
              <td className="px-5 py-3">
                <LeadCell lead={row.lead} />
              </td>
              {countColumns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-right tabular-nums text-neo-ink">
                  <span className="block">{formatCount(row.counts[column.key] ?? 0)}</span>
                  <span className="mt-1 block w-20 ml-auto">
                    <MeterBar value={row.counts[column.key] ?? 0} max={maxima[column.key] ?? 0} />
                  </span>
                </td>
              ))}
              {rateColumns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-right tabular-nums text-neo-ink">
                  {formatRate(row.rates[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
