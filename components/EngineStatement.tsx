'use client';

import { useEffect, useRef } from 'react';
import { MoreLink } from '@/components/MoreLink';
import { RibbonStage } from '@/components/RibbonStage';
import { splitClauses } from '@/components/clauseWrap';
import type { HomeCopy } from '@/lib/copy';

interface EngineStatementProps {
  copy: HomeCopy['engine'];
}

/**
 * 首頁的 AI 引擎：只有一句話，完整說明在 /about#engine。
 * 整個舞台釘住（CSS sticky），標誌的緞帶以 3D 珠光呈現；往下捲時緞帶多轉半圈，
 * 句子逐字由淡轉實（opacity 由 CSS 的 --p 算，不重繪 React）。
 */
export function EngineStatement({ copy }: EngineStatementProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const clauses = splitClauses(copy.title);
  const charCount = Array.from(copy.title).length;
  let index = 0;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.style.setProperty('--p', '1');
      progressRef.current = 0.5;
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      // 舞台頂端碰到視窗頂端前就開始（-0.35 個視窗），讓字在釘住時已經開始浮現
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.35 - rect.top) / (travel + window.innerHeight * 0.35)));
      wrap.style.setProperty('--p', p.toFixed(4));
      progressRef.current = p;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="engine" className="relative bg-[#FAFAFA]">
      <div ref={wrapRef} className="relative h-[180vh] lg:h-[230vh]" style={{ ['--n' as string]: charCount }}>
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <RibbonStage progressRef={progressRef} className="absolute inset-0 h-full w-full" />
          {/* 字的後方壓一層淡淡的底，讓緞帶經過時字仍清楚 */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_30%_at_50%_50%,rgba(250,250,250,0.7)_0%,rgba(250,250,250,0)_100%)]"
            aria-hidden
          />

          <div className="relative z-10 px-6 text-center">
            <h2
              className="cjk-punct mx-auto max-w-[14ch] font-serif font-black leading-[1.12] tracking-[-0.02em] text-[#101828]"
              style={{ fontSize: 'clamp(2.5rem, 1rem + 6vw, 6.5rem)' }}
            >
              <span className="sr-only">{copy.title}</span>
              <span aria-hidden>
                {clauses.map((clause, c) => (
                  <span key={c} className="inline-block">
                    {Array.from(clause).map((ch) => {
                      const i = index++;
                      return (
                        <span key={i} className="scrub-char" style={{ ['--i' as string]: i }}>
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </span>
            </h2>
            <div className="scrub-late mt-10 md:mt-12">
              <MoreLink href="/about#engine">{copy.link}</MoreLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
