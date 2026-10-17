'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppScreen } from '@/components/AppScreen';
import { Magnetic } from '@/components/Magnetic';
import { PhoneBody } from '@/components/Phone3D';
import { SilkField } from '@/components/SilkField';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { trackCTA } from '@/lib/analytics';
import { APP_IMAGES } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { usePointerTilt } from '@/lib/use-pointer-tilt';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// 「輸入」小卡：白框、圓角、柔和陰影（模特全身照與商品平拍共用），寬度跟著父層
function InputCard({ name, sizes }: { name: 'modelA' | 'productWhiteShirt'; sizes: string }) {
  const image = APP_IMAGES[name];
  return (
    <div className="w-full overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-[0_18px_40px_rgba(16,24,40,0.16)]">
      <Image
        src={image.src}
        alt={siteCopy.images[name]}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

interface HeroCinemaProps {
  copy: HomeCopy['hero'];
}

/**
 * 首屏：左文右圖，右邊是一個 3D 舞台。
 * 試穿結果的實機畫面放在有厚度的手機裡，從斜後方轉進來落定；
 * 兩張「輸入」小卡（全身照＋商品平拍）浮在手機前方不同景深，游標一動整個舞台跟著微轉（±3°）。
 * 背後的 SilkField 是一塊白緞，有一道寬褶從商品圖垂到手機，開場時一道藍青光沿褶走到手機邊緣：
 * 讀起來是「一張全身照＋商品照 → 試穿結果」。
 * 文字欄用 CSS 的 hero-enter，手機的落定也是 CSS，第一次繪製就看得到（手機截圖是 LCP）。
 * 桌機往下捲離首屏時，整個舞台往後仰、退進深處（GSAP scrub，Lenis 驅動 ScrollTrigger）。
 */
export function HeroCinema({ copy }: HeroCinemaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLDivElement>(null);
  usePointerTilt(sectionRef, { max: 3 });

  useEffect(() => {
    const section = sectionRef.current;
    const exit = exitRef.current;
    if (!section || !exit) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to(exit, {
        rotateX: 18,
        rotateY: 8,
        y: 90,
        z: -160,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden bg-[#FAFAFA]">
      {/* CSS 底層：布面亮起前、或 WebGL 不可用時看到的兩團光暈 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-[-15%] top-[5%] h-[50vh] w-[80vw] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[5%] right-[-15%] h-[50vh] w-[80vw] bg-[radial-gradient(circle,rgba(6,182,212,0.07)_0%,transparent_60%)] blur-3xl" />
      </div>
      <SilkField routeFrom={plateRef} routeTo={phoneRef} introDelay={0.9} />
      {/* 可讀性遮罩只壓左半（文字欄），布面在右半完整露出 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_40%_at_50%_30%,rgba(250,250,250,0.88)_35%,rgba(250,250,250,0)_100%)] lg:bg-[radial-gradient(ellipse_at_27%_52%,rgba(250,250,250,0.9)_14%,rgba(250,250,250,0)_58%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-16 px-6 pt-28 pb-16 md:px-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 文字欄：手機版置中，桌機靠左 */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1
            className="hero-enter cjk-punct font-serif font-black tracking-[-0.02em] leading-[1.06] text-[#101828] mb-8 md:mb-10"
            style={{ fontSize: 'clamp(2.75rem, 1.6rem + 6vw, 6.75rem)' }}
          >
            {copy.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="hero-enter [animation-delay:0.15s] mb-0 max-w-xl text-base md:text-xl text-[#475467] font-medium leading-relaxed text-balance">
            {clauseWrap(copy.sub)}
          </p>

          <p className="hero-enter [animation-delay:0.2s] mt-4 mb-0 max-w-xl text-sm md:text-base text-[#475467] leading-relaxed text-balance">
            {keepRanges(copy.service)}
          </p>

          <div className="hero-enter [animation-delay:0.35s] mt-10 md:mt-12 flex w-full flex-col sm:w-auto sm:flex-row gap-3 md:gap-4">
            <Magnetic>
              <Link
                href="/business"
                onClick={() => trackCTA('hero_business')}
                className="btn-primary w-full text-base"
              >
                {copy.ctaPrimary}
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/download"
                onClick={() => trackCTA('hero_download')}
                className="focus-ring inline-flex w-full items-center justify-center px-9 py-4 bg-white/70 backdrop-blur-md text-[#101828] rounded-full font-semibold text-base hover:bg-white transition-colors duration-300 border border-[#101828]/10"
              >
                {copy.ctaSecondary}
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* 視覺欄：3D 舞台。perspective 在最外層，往內每層 preserve-3d；不可加 opacity／filter／overflow */}
        <div className="flex justify-center lg:justify-end">
          <div className="phone3d relative" style={{ ['--yaw' as string]: '-6deg' }}>
            <div ref={exitRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <div className="phone3d-pose relative">
                {/* 桌機：兩張小卡直排在手機左前方，商品照比全身照更靠近鏡頭 */}
                <div
                  className="absolute right-full top-1/2 hidden lg:block"
                  style={{ transform: 'translate3d(-2.25rem, -50%, 0)', transformStyle: 'preserve-3d' }}
                >
                  <div className="flex w-24 flex-col items-center xl:w-28" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="w-full" style={{ transform: 'translateZ(40px) rotateY(10deg)' }}>
                      <div className="plate-enter [animation-delay:0.75s]">
                        <InputCard name="modelA" sizes="112px" />
                      </div>
                    </div>
                    <span
                      className="plate-enter [animation-delay:0.9s] my-2 text-xl font-light leading-none text-[#2563EB]"
                      style={{ transform: 'translateZ(70px)' }}
                      aria-hidden
                    >
                      +
                    </span>
                    <div ref={plateRef} className="w-full" style={{ transform: 'translate3d(-12px, 0, 100px) rotateY(10deg)' }}>
                      <div className="plate-enter [animation-delay:0.95s]">
                        <InputCard name="productWhiteShirt" sizes="112px" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="phone3d-settle">
                  <PhoneBody
                    faceRef={phoneRef}
                    className="w-[64vw] max-w-[280px] lg:w-[min(300px,calc((100svh_-_15rem)_*_0.46))] lg:max-w-none xl:w-[min(330px,calc((100svh_-_15rem)_*_0.46))]"
                  >
                    <AppScreen
                      name="tryonSimple"
                      priority
                      framed={false}
                      sizes="(min-width: 1280px) 330px, (min-width: 1024px) 300px, min(64vw, 280px)"
                    />
                  </PhoneBody>
                </div>

                {/* 手機版：兩張小卡縮成手機上緣左右兩側的小圓角圖；往前推離手機正面，避免同平面閃爍 */}
                <div className="absolute -left-9 top-10 w-[72px] lg:hidden" style={{ transform: 'translateZ(30px)' }}>
                  <div className="plate-enter [animation-delay:0.75s]">
                    <InputCard name="modelA" sizes="72px" />
                  </div>
                </div>
                <div className="absolute -right-9 top-10 w-[72px] lg:hidden" style={{ transform: 'translateZ(30px)' }}>
                  <div className="plate-enter [animation-delay:0.85s]">
                    <InputCard name="productWhiteShirt" sizes="72px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
