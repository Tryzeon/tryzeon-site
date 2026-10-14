'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarDays } from 'lucide-react';

import type { PeriodOption } from '@/lib/admin-analytics/period';
import { usePeriodTransition } from './PeriodTransition';

interface PeriodSelectorProps {
  value: string;
  options: readonly PeriodOption[];
}

export function PeriodSelector({ value, options }: PeriodSelectorProps) {
  const pathname = usePathname();
  const { pending, navigate } = usePeriodTransition();
  const [selected, setSelected] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  if (syncedValue !== value) {
    setSyncedValue(value);
    setSelected(value);
  }

  return (
    <label
      aria-busy={pending}
      className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 py-1.5 pl-4 pr-2 text-sm text-neo-steel backdrop-blur-xl"
    >
      <CalendarDays className="h-4 w-4 text-neo-blue" aria-hidden="true" />
      <span>期間</span>
      <select
        value={selected}
        onChange={(event) => {
          const next = event.target.value;
          setSelected(next);
          navigate(`${pathname}?period=${next}`);
        }}
        className="rounded bg-transparent py-1 pr-6 font-medium text-neo-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
