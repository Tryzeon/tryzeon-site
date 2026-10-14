interface AmbientGlowProps {
  /** hero：子頁首屏，光暈貼上下緣；center：區塊中段（CTA 等） */
  variant?: 'hero' | 'center';
}

const POSITIONS = {
  hero: ['top-[-10%] left-1/4 w-[520px] h-[520px]', 'bottom-[-20%] right-1/4 w-[420px] h-[420px]'],
  center: ['top-1/4 left-1/4 w-[500px] h-[500px]', 'bottom-1/4 right-1/4 w-[400px] h-[400px]'],
} as const;

/** blue + cyan 兩團緩慢漂移的光暈（ambient 層）。父層需 relative + overflow-hidden */
export function AmbientGlow({ variant = 'center' }: AmbientGlowProps) {
  const [blue, cyan] = POSITIONS[variant];
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className={`absolute ${blue} bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] animate-mesh-float`} />
      <div className={`absolute ${cyan} bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] animate-mesh-float [animation-delay:4s]`} />
    </div>
  );
}
