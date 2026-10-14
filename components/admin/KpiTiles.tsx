import type { KpiTile } from '@/lib/admin-analytics/tiles';

interface KpiTilesProps {
  tiles: readonly KpiTile[];
}

export function KpiTiles({ tiles }: KpiTilesProps) {
  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-2xl border border-white/60 bg-white/70 px-4 py-4 shadow-neo backdrop-blur-xl"
        >
          <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-neo-steel">{tile.label}</dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums text-neo-ink">{tile.value}</dd>
          {tile.hint && <dd className="mt-1 text-xs text-neo-mist">{tile.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}
