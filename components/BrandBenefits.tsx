import { BarChart3, Clapperboard, ScanLine, Sparkles } from 'lucide-react';
import { AppScreen } from '@/components/AppScreen';
import { TryOnVideo } from '@/components/TryOnVideo';
import { keepRanges } from '@/components/clauseWrap';
import { copy } from '@/lib/copy';

// 順序對應 copy.business.features.items
const FEATURE_ICONS = [Sparkles, ScanLine, BarChart3, Clapperboard] as const;

// 手機畫面一律完整呈現（MASTER：截圖不裁切）
const PHONE = 'w-[38vw] max-w-[200px] md:w-[200px] xl:w-[220px] md:max-w-none';
const PHONE_SIZES = '(min-width: 1280px) 220px, (min-width: 768px) 200px, 38vw';
const TILE = 'glass-panel flex flex-col p-6 md:p-8';
// 試穿率後台那格比旁邊的影片格寬，畫面放大一級，讓兩格的手機同高、格子不留大塊空白
const WIDE_PHONE = 'w-[38vw] max-w-[200px] md:w-[200px] lg:w-[240px] xl:w-[260px] md:max-w-none';
const WIDE_PHONE_SIZES = '(min-width: 1280px) 260px, (min-width: 1024px) 240px, (min-width: 768px) 200px, 38vw';

interface TileTextProps {
  /** copy.business.features.items 的索引 */
  index: number;
}

/** 每格的圖示＋標題＋說明；說明較長，不用 text-balance（會把行寬縮窄、斷在詞中間） */
function TileText({ index }: TileTextProps) {
  const entry = copy.business.features.items[index];
  const Icon = FEATURE_ICONS[index];
  return (
    <div>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-[#2563EB]/15 to-[#06B6D4]/10 text-[#1D4ED8]">
        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </span>
      <h3 className="mt-5 text-lg md:text-xl font-semibold text-[#101828]">{entry.title}</h3>
      <p className="mb-0 mt-2 text-sm md:text-base leading-relaxed text-[#475467]">{keepRanges(entry.desc)}</p>
    </div>
  );
}

/**
 * /business「接上之後，你的品牌拿到這些」：四項效益排成兩列交錯的 bento（寬窄 → 窄寬）。
 * 第一列：試穿（兩種身形，佔兩格）＋穿搭推薦；第二列：試穿影片＋試穿率後台（佔兩格，文字在左、畫面在右）。
 * 平板兩欄、手機單欄直排。
 */
export function BrandBenefits() {
  const { features } = copy.business;

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 顧客先看見上身：同一件洋裝的兩種身形 */}
      <li className={`${TILE} md:col-span-2`}>
        <TileText index={0} />
        <div className="mt-8 flex flex-1 items-end justify-center gap-4 md:gap-8">
          {(['tryonHero', 'tryonCurvy'] as const).map((name, j) => (
            <figure key={name} className="m-0">
              <AppScreen name={name} sizes={PHONE_SIZES} className={PHONE} />
              <figcaption className="mt-3 text-center text-sm font-semibold text-[#475467]">{features.fitNotes[j]}</figcaption>
            </figure>
          ))}
        </div>
      </li>

      {/* 單品搭成整套 */}
      <li className={TILE}>
        <TileText index={1} />
        <div className="mt-8 flex flex-1 items-end justify-center">
          <AppScreen name="agentWardrobe" sizes={PHONE_SIZES} className={PHONE} />
        </div>
      </li>

      {/* 試穿影片就是素材 */}
      <li className={TILE}>
        <TileText index={3} />
        <div className="mt-8 flex flex-1 items-end justify-center">
          <TryOnVideo video="office" replayLabel={copy.home.experience.replay} className={PHONE} />
        </div>
      </li>

      {/* 知道該補什麼貨：文字在左上、後台畫面在右，手機與其他格一樣貼齊底部 */}
      <li className={`${TILE} md:col-span-2 sm:flex-row sm:items-end sm:gap-10`}>
        <div className="sm:flex-1 sm:self-start">
          <TileText index={2} />
        </div>
        <div className="mt-8 flex justify-center sm:mt-0">
          <AppScreen name="dashboardRanking" sizes={WIDE_PHONE_SIZES} className={WIDE_PHONE} />
        </div>
      </li>
    </ul>
  );
}
