'use client';

import { useEffect, useRef } from 'react';
import { MEDIA, gsap } from '@/lib/gsap';

interface ScrubTextProps {
  text: string;
  className?: string;
}

/**
 * 長段落的「閱讀光」：捲動經過時，字從暗到亮一個個點亮，像有一道光從段首掃到段尾。
 * 拆成單字 span（中文逐字、英數連在一起），順序與原文相同，螢幕閱讀器照常讀。
 * 偏好減少動態時整段直接是亮的。
 */
export function ScrubText({ text, className = '' }: ScrubTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  // 「15–20」「LINE 官方帳號」整組不拆（同 clauseWrap 的 keepRanges）；英數詞連在一起，不逐字母發亮
  const tokens = text
    .split(/(\d+–\d+|LINE 官方帳號)/)
    .flatMap((part, i) => (i % 2 === 1 ? [part] : (part.match(/[A-Za-z0-9/\-.]+|\s+|./gu) ?? [])));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    mm.add({ any: MEDIA.any, reduce: MEDIA.reduce }, (ctx) => {
      if ((ctx.conditions as { reduce: boolean }).reduce) return;
      gsap.fromTo(
        el.querySelectorAll('[data-t]'),
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, i) =>
        /^\s+$/.test(token) ? (
          token
        ) : (
          <span key={i} data-t className={token.length > 1 ? 'whitespace-nowrap' : undefined}>
            {token}
          </span>
        ),
      )}
    </p>
  );
}
