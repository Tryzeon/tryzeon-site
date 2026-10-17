import { AmbientGlow } from '@/components/AmbientGlow';
import { SilkField } from '@/components/SilkField';
import { keepRanges } from '@/components/clauseWrap';

// 每一段幕簾的錯開時間（Tailwind 要看得到完整 class 字串，所以列死）
const LINE_DELAYS = ['', '[animation-delay:0.12s]', '[animation-delay:0.24s]', '[animation-delay:0.36s]'] as const;

interface HeroTitleLinesProps {
  text: string;
}

/**
 * 子頁 H1 的幕簾揭露：與 clauseWrap 同一條切法（只在「，；：。」之後斷開），
 * 每段是 inline-block 的 `.hero-line`，依序由下往上拉開。斷行行為與 clauseWrap 相同，字不變。
 * 純 CSS（globals.css 的 heroLine），SSR HTML 就帶著動畫；server／client 元件都能用。
 */
export function HeroTitleLines({ text }: HeroTitleLinesProps) {
  const parts = text.split(/(?<=[，；：。])/).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={`hero-line inline-block ${LINE_DELAYS[Math.min(i, LINE_DELAYS.length - 1)]}`}>
          {keepRanges(part)}
        </span>
      ))}
    </>
  );
}

interface SubpageBackdropProps {
  /** center：置中文字（白色遮罩壓中央）；left：桌機左文右圖（遮罩壓左半） */
  mask?: 'center' | 'left';
  /** SilkField 強度，hero 0.55 */
  intensity?: number;
  /** 光暈位置：hero 貼上下緣、center 在區塊中段 */
  glow?: 'hero' | 'center';
  /** 上緣也淡回畫布色（頁中段的 CTA 用；hero 在頁頂不需要） */
  fadeTop?: boolean;
}

const MASKS = {
  center: 'bg-[radial-gradient(ellipse_at_50%_45%,rgba(250,250,250,0.9)_22%,rgba(250,250,250,0)_72%)]',
  left: 'bg-[radial-gradient(ellipse_at_50%_35%,rgba(250,250,250,0.9)_22%,rgba(250,250,250,0)_72%)] lg:bg-[radial-gradient(ellipse_at_30%_50%,rgba(250,250,250,0.92)_25%,rgba(250,250,250,0)_68%)]',
} as const;

/**
 * 子頁 hero／CTA 的背景：CSS 光暈墊底（WebGL 不可用時露出）＋ 絲綢光場 ＋ 保文字可讀的白色遮罩，
 * 上下緣淡回畫布色，與相鄰區塊無接縫。父層需 relative + overflow-hidden。
 */
export function SubpageBackdrop({ mask = 'center', intensity = 0.55, glow = 'hero', fadeTop = false }: SubpageBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <AmbientGlow variant={glow} />
      <SilkField intensity={intensity} />
      <div className={`absolute inset-0 ${MASKS[mask]}`} />
      {fadeTop && <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FAFAFA] to-transparent" />}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#FAFAFA]" />
    </div>
  );
}
