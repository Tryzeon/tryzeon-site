'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MoreLink } from '@/components/MoreLink';
import type { HomeCopy } from '@/lib/copy';
import { MEDIA, gsap } from '@/lib/gsap';

const EngineParticles = dynamic(() => import('@/components/three/EngineParticles').then((m) => m.EngineParticles), {
  ssr: false,
});

interface EngineStatementProps {
  copy: HomeCopy['engine'];
}

/**
 * 首頁的 AI 引擎：只有一句話，但給它一整個畫面。
 * 區塊比視窗高，內容黏在中央；往下捲時字一個個由暗轉亮、對焦，
 * 背後散落的光點同步沿螺旋匯進中央的光環。完整說明在 /about#engine。
 */
export function EngineStatement({ copy }: EngineStatementProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const clauses = copy.title.split(/(?<=[，；：。])/).filter(Boolean);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia(section);
    mm.add({ any: MEDIA.any, reduce: MEDIA.reduce }, (ctx) => {
      if ((ctx.conditions as { reduce: boolean }).reduce) {
        progress.current = 1;
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        },
      });
      tl.fromTo(
        '[data-char]',
        { opacity: 0.1, filter: 'blur(8px)' },
        { opacity: 1, filter: 'blur(0px)', stagger: 0.1, duration: 0.5, ease: 'none' },
      );
      tl.from('[data-engine-link]', { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out' }, '-=0.1');
      tl.to({}, { duration: 0.4 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="engine" ref={sectionRef} className="relative h-[210vh] bg-night motion-reduce:h-auto">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden motion-reduce:relative">
        <EngineParticles progress={progress} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_32%_at_50%_50%,rgba(8,9,15,0.85),transparent)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" aria-hidden />

        <div className="relative z-10 px-6 text-center">
          <h2
            className="cjk-punct mx-auto max-w-[14ch] font-serif font-black leading-[1.15] tracking-[-0.01em] text-pearl"
            style={{ fontSize: 'clamp(2.6rem, 1rem + 5.6vw, 6.6rem)' }}
          >
            {clauses.map((clause) => (
              <span key={clause} className="inline-block whitespace-nowrap">
                {Array.from(clause).map((char, i) => (
                  <span key={i} data-char className="inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <div data-engine-link className="mt-10 md:mt-12">
            <MoreLink href="/about#engine">{copy.link}</MoreLink>
          </div>
        </div>
      </div>
    </section>
  );
}
