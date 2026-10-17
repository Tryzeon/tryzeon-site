'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { SectionHeader } from '@/components/SectionHeader';
import { keepRanges } from '@/components/clauseWrap';
import { LINE_OA_QR_SRC } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { MEDIA, gsap } from '@/lib/gsap';

// 桌機橫向軌道的左右留白：對齊全站 1360px 內容欄
const TRACK_PAD = 'lg:px-[max(3rem,calc((100vw_-_1360px)/2_+_3rem))]';

interface LineFlowProps {
  copy: HomeCopy['line'];
}

/**
 * LINE 試穿流程。
 * 桌機：整段釘住，往下捲時五個步驟由右往左滑過（GSAP pin + scrub），
 * 經過畫面中央的那張點亮、巨大的描邊數字填上蛋白石色，底部進度軌跟著走。
 * 手機與偏好減少動態：直排時間軸（桌機減少動態時，軌道改成可以橫向捲動）。
 */
export function LineFlow({ copy }: LineFlowProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const mm = gsap.matchMedia(pin);
    mm.add({ any: MEDIA.any, desktop: MEDIA.desktop, reduce: MEDIA.reduce }, (ctx) => {
      const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
      if (!desktop || reduce) return;
      pin.dataset.pinned = '1';
      const steps = Array.from(track.querySelectorAll<HTMLElement>('[data-step]'));
      const cards = steps.map((step) => step.querySelector<HTMLElement>('[data-card]'));
      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      const paint = (progress: number) => {
        if (railRef.current) railRef.current.style.transform = `scaleX(${progress})`;
        const mid = window.innerWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        steps.forEach((step, i) => {
          const r = step.getBoundingClientRect();
          const offset = (r.left + r.width / 2 - mid) / window.innerWidth;
          const dist = Math.abs(offset);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
          const card = cards[i];
          if (card) {
            card.style.transform = `perspective(1400px) rotateY(${(offset * -14).toFixed(2)}deg) scale(${(1 - Math.min(dist, 0.6) * 0.12).toFixed(3)})`;
            card.style.opacity = (1 - Math.min(dist, 0.7) * 0.6).toFixed(3);
          }
        });
        setActive((prev) => (prev === best ? prev : best));
      };

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        // scrub 會讓軌道在捲動停下後再滑一小段：跟著 tween 每一格重畫，不跟 scroll 事件
        onUpdate() {
          paint(this.progress());
        },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: (self) => paint(self.progress),
        },
      });

      return () => {
        delete pin.dataset.pinned;
        cards.forEach((card) => {
          if (!card) return;
          card.style.transform = '';
          card.style.opacity = '';
        });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="line" className="relative bg-night">
      <div
        ref={pinRef}
        className="group/pin relative py-28 md:py-40 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-x-auto lg:py-0 lg:data-[pinned]:overflow-hidden"
      >
        {/* 背景：一道很淡的對角光，讓釘住的畫面不是一片死黑 */}
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(60%_50%_at_70%_40%,rgba(185,167,255,0.08),transparent),radial-gradient(40%_40%_at_20%_80%,rgba(110,231,240,0.06),transparent)] lg:block"
          aria-hidden
        />

        <ol
          ref={trackRef}
          className={`relative mx-auto grid max-w-xl gap-6 px-6 md:px-12 lg:mx-0 lg:flex lg:w-max lg:max-w-none lg:items-stretch lg:gap-6 ${TRACK_PAD}`}
        >
          {/* 開場：標題與 lede 也在軌道上，捲動時一起滑走 */}
          <li className="lg:flex lg:w-[min(38rem,40vw)] lg:shrink-0 lg:items-center lg:pr-10">
            <SectionHeader align="left" title={copy.title} lede={copy.lede} spacing="mb-6 lg:mb-0" />
          </li>

          {copy.steps.map((step, i) => {
            const isActive = active === i;
            return (
              <li key={step.title} data-step className="relative lg:w-[min(26rem,29vw)] lg:shrink-0">
                <div
                  data-card
                  className="spotlight glass-panel relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 will-change-transform md:p-9 lg:h-[min(62vh,540px)] lg:p-10"
                >
                  {/* 巨大的描邊數字：經過畫面中央時填上蛋白石色 */}
                  <span
                    className={`pointer-events-none absolute right-5 top-1 select-none lg:right-7 lg:top-3 font-serif font-black leading-none transition-opacity duration-700 text-outline text-[9rem] lg:text-[13rem] ${
                      isActive ? 'lg:opacity-0' : ''
                    }`}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`pointer-events-none absolute right-5 top-1 select-none lg:right-7 lg:top-3 font-serif font-black leading-none opal-text text-[9rem] transition-opacity duration-700 lg:text-[13rem] ${
                      isActive ? 'lg:opacity-100' : 'lg:opacity-0'
                    } opacity-0`}
                    aria-hidden
                  >
                    {i + 1}
                  </span>

                  <span
                    className={`relative mb-auto inline-flex h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                      isActive ? 'bg-aqua shadow-[0_0_14px_4px_rgba(110,231,240,0.6)]' : 'bg-white/25'
                    }`}
                    aria-hidden
                  />
                  <div className="relative mt-16 lg:mt-0">
                    <h3 className="text-xl font-semibold text-pearl md:text-2xl">{step.title}</h3>
                    {step.quote && (
                      <p className="cjk-punct mb-0 mt-4 font-serif text-2xl font-semibold leading-snug text-pearl md:text-3xl">
                        {step.quote}
                      </p>
                    )}
                    <p className="mb-0 mt-3 text-balance text-sm leading-relaxed text-haze md:text-base">{keepRanges(step.desc)}</p>
                  </div>
                </div>
              </li>
            );
          })}

          {/* 收尾：親自試試（桌機附 QR Code——電腦上點連結無法加好友） */}
          <li data-step className="relative lg:flex lg:w-[min(30rem,34vw)] lg:shrink-0 lg:items-center">
            <div
              data-card
              className="opal-border relative flex w-full flex-col items-start gap-6 overflow-hidden rounded-[2rem] bg-white/[0.04] p-7 backdrop-blur-xl md:p-9 lg:h-[min(62vh,540px)] lg:justify-between lg:p-10"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(185,167,255,0.3),transparent)] blur-2xl" aria-hidden />
              <figure className="relative hidden rounded-2xl bg-white p-3 shadow-[0_0_50px_-10px_rgba(185,167,255,0.6)] lg:block">
                <Image src={LINE_OA_QR_SRC} width={120} height={120} alt={copy.tryIt.qrAlt} unoptimized />
                <figcaption className="mt-2 text-center text-xs text-night/70">{copy.tryIt.qrCaption}</figcaption>
              </figure>
              <div className="relative">
                <h3 className="text-2xl font-semibold text-pearl md:text-3xl">{copy.tryIt.title}</h3>
                <p className="mb-0 mt-3 text-balance text-sm leading-relaxed text-haze md:text-base">{copy.tryIt.desc}</p>
                <a
                  href={siteCopy.contact.lineOa.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6 gap-2 text-base"
                >
                  {copy.tryIt.cta}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </li>
        </ol>

        {/* 進度軌（桌機）：五站的名稱＋跟著捲動填滿的光 */}
        <div className={`relative mt-12 hidden lg:block ${TRACK_PAD}`} aria-hidden>
          <div className="relative h-px bg-white/10">
            <span
              ref={railRef}
              className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-lilac via-ice to-aqua shadow-[0_0_12px_rgba(185,167,255,0.7)]"
            />
          </div>
          <div className="mt-4 grid grid-cols-5 text-xs">
            {copy.steps.map((step, i) => (
              <span key={step.title} className={`transition-colors duration-500 ${active >= i ? 'text-pearl' : 'text-dim'}`}>
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-6 pb-28 md:px-12 md:pb-36 lg:pt-16">
        <MoreLink href="/business">{copy.link}</MoreLink>
      </div>
    </section>
  );
}
