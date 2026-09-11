interface MeterBarProps {
  value: number;
  max: number;
}

export function MeterBar({ value, max }: MeterBarProps) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <span className="block h-1 w-full overflow-hidden rounded-full bg-neo-smoke/70" aria-hidden="true">
      <span
        className="block h-full rounded-full bg-gradient-to-r from-neo-blue to-neo-cyan transition-[width] duration-500"
        style={{ width: `${width}%` }}
      />
    </span>
  );
}
