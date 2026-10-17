import type { CSSProperties } from 'react';
import { keepRanges, splitClauses } from '@/components/clauseWrap';

interface HeroTitleProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * 子頁首屏的 H1：在中文子句後切開，每段從遮罩下方升起（CSS-only，SSR 第一個畫面就會跑）。
 * 每段是 inline-block，窄螢幕只會在「，」處換行。
 */
export function HeroTitle({ text, className = '', style }: HeroTitleProps) {
  return (
    <h1 className={className} style={style}>
      {splitClauses(text).map((part, i) => (
        <span key={i} className="clause-mask">
          <span style={{ animationDelay: `${0.1 + i * 0.12}s` }}>{keepRanges(part)}</span>
        </span>
      ))}
    </h1>
  );
}
