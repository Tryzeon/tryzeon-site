import type { LucideIcon } from 'lucide-react';

interface IconCardItem {
  title: string;
  desc: string;
}

interface IconCardGridProps {
  items: readonly IconCardItem[];
  /** 與 items 同順序 */
  icons: readonly LucideIcon[];
}

/**
 * 三欄玻璃卡：右下角壓一枚放大的淡色圖示當浮水印，左上是漸層底的圖示框。
 * /business「適合這樣的品牌」與 /download「你的照片，由你掌控」共用。
 */
export function IconCardGrid({ items, icons }: IconCardGridProps) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map((entry, i) => {
        const Icon = icons[i];
        return (
          <li key={entry.title} className="glass-panel relative overflow-hidden p-7 md:p-9">
            <Icon className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 text-[#2563EB]/[0.06]" strokeWidth={1} aria-hidden />
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-[#2563EB]/15 to-[#06B6D4]/10 text-[#1D4ED8]">
              <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </span>
            <h3 className="relative mt-6 text-lg md:text-xl font-semibold text-[#101828]">{entry.title}</h3>
            <p className="relative mb-0 mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{entry.desc}</p>
          </li>
        );
      })}
    </ul>
  );
}
