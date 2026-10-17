'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { Magnetic } from '@/components/Magnetic';
import { PhoneFrame } from '@/components/PhoneFrame';
import { SilkBackdrop } from '@/components/SilkBackdrop';
import { TiltStage } from '@/components/TiltStage';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { trackCTA } from '@/lib/analytics';
import { APP_IMAGES } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { EASE } from '@/lib/motion';

// 「輸入」小卡：白框、圓角、柔和陰影（模特全身照與商品平拍共用），寬度跟著父層
function InputCard({ name, sizes }: { name: 'modelA' | 'productWhiteShirt'; sizes: string }) {
  const image = APP_IMAGES[name];
  return (
    <div className="w-full overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-[0_24px_48px_-12px_rgba(16,24,40,0.28)]">
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

// 輸入小卡在文字與手機之後進場（手機是 LCP，與 H1 一起出來）
const VISUAL_START = 1.0;
// 掃描動畫一次的長度（與 globals.css 的 scanVeil / scanLine 一致）
const SCAN_MS = 2400;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE, delay: d },
  }),
};

const phoneEnter: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE, delay: 0.15 } },
};

interface HeroCinemaProps {
  copy: HomeCopy['hero'];
}

/**
 * 首屏：整片會動的珠光絲綢（WebGL，游標會壓出凹痕、點擊盪出波紋）。
 * 左邊大標逐行從遮罩升起；右邊是 3D 傾斜的試穿畫面——全身照與商品平拍浮在前景，
 * 中間一道光把它們送進手機，手機畫面由一道掃描光「生成」出試穿結果（滑過手機會重播）。
 */
export function HeroCinema({ copy }: HeroCinemaProps) {
  const enter = { variants: fadeUp, initial: 'hidden' as const, animate: 'show' as const };
  const [scan, setScan] = useState({ key: 0, delay: '0.9s' });
  const lastScan = useRef(0);

  const replayScan = () => {
    const now = performance.now();
    if (now - lastScan.current < SCAN_MS + 1200) return;
    lastScan.current = now;
    setScan((prev) => ({ key: prev.key + 1, delay: '0s' }));
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#FAFAFA]">
      <SilkBackdrop scrollDrift />
      {/* 文字欄的可讀性遮罩：左側壓白，右側讓絲綢透出來 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_80%_at_50%_42%,rgba(250,250,250,0.88)_0%,rgba(250,250,250,0.55)_45%,rgba(250,250,250,0)_78%)] lg:bg-[radial-gradient(ellipse_50%_72%_at_18%_52%,rgba(250,250,250,0.92)_0%,rgba(250,250,250,0.6)_50%,rgba(250,250,250,0)_82%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#FAFAFA]" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-16 px-6 pb-20 pt-28 md:px-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 文字欄：手機版置中，桌機靠左 */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1
            className="cjk-punct mb-8 font-serif font-black leading-[1.06] tracking-[-0.02em] text-[#101828] md:mb-10"
            style={{ fontSize: 'clamp(2.75rem, 1.6rem + 6vw, 6.75rem)' }}
          >
            {copy.titleLines.map((line, i) => (
              <span key={line} className="line-mask">
                <span style={{ animationDelay: `${0.1 + i * 0.14}s` }}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="hero-enter mb-0 max-w-xl text-balance text-base font-medium leading-relaxed text-[#344054] [animation-delay:0.45s] md:text-xl">
            {clauseWrap(copy.sub)}
          </p>

          <p className="hero-enter mb-0 mt-4 max-w-xl text-balance text-sm leading-relaxed text-[#475467] [animation-delay:0.55s] md:text-base">
            {keepRanges(copy.service)}
          </p>

          <div className="hero-enter mt-10 flex w-full flex-col gap-3 [animation-delay:0.7s] sm:w-auto sm:flex-row md:mt-12 md:gap-4">
            <Magnetic>
              <Link href="/business" onClick={() => trackCTA('hero_business')} className="btn-primary w-full text-base">
                {copy.ctaPrimary}
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/download" onClick={() => trackCTA('hero_download')} className="btn-glass w-full text-base">
                {copy.ctaSecondary}
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* 視覺欄：輸入小卡 → 試穿結果，整組跟著游標 3D 傾斜 */}
        <div className="flex justify-center lg:justify-end">
          <TiltStage className="relative">
            {/* 手機後方的珠光暈，排在最深的一層 */}
            <div
              className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.35)_0%,rgba(96,165,250,0.18)_40%,transparent_70%)] blur-2xl [transform:translateZ(-140px)]"
              aria-hidden
            />

            <motion.div variants={phoneEnter} initial="hidden" animate="show" onMouseEnter={replayScan}>
              <PhoneFrame className="w-[64vw] max-w-[280px] lg:w-[min(300px,calc((100svh_-_15rem)_*_0.46))] lg:max-w-none xl:w-[min(330px,calc((100svh_-_15rem)_*_0.46))]">
                <Image
                  src={APP_IMAGES.tryonSimple.src}
                  alt={siteCopy.images.tryonSimple}
                  width={APP_IMAGES.tryonSimple.width}
                  height={APP_IMAGES.tryonSimple.height}
                  sizes="(min-width: 1280px) 330px, (min-width: 1024px) 300px, min(64vw, 280px)"
                  priority
                  className="h-full w-full object-cover"
                />
                <span key={`veil-${scan.key}`} className="scan-veil" style={{ ['--scan-delay' as string]: scan.delay }} aria-hidden />
                <span key={`line-${scan.key}`} className="scan-line" style={{ ['--scan-delay' as string]: scan.delay }} aria-hidden />
              </PhoneFrame>
            </motion.div>

            {/* 桌機：兩張小卡浮在手機左前方（translateZ），中間「+」，一道光沿細線送進手機 */}
            <div className="absolute right-full top-1/2 hidden [transform:translate3d(0,-50%,110px)] lg:block">
              <motion.div {...enter} custom={VISUAL_START} className="mr-8 xl:mr-12">
                <div className="float-y flex w-24 flex-col items-center xl:w-28">
                  <InputCard name="modelA" sizes="112px" />
                  <span className="relative my-2 flex w-full justify-center" aria-hidden>
                    <span className="text-xl font-light leading-none text-[#5B45D6]">+</span>
                    <span className="absolute left-full top-1/2 h-px w-8 overflow-hidden bg-gradient-to-r from-[#A78BFA]/60 to-[#22D3EE]/60 xl:w-12">
                      <span className="thread-pulse absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent" />
                    </span>
                    <span className="absolute left-[calc(100%+2rem)] top-1/2 -mt-[3px] h-[7px] w-[7px] rounded-full bg-[#22D3EE] shadow-[0_0_12px_2px_rgba(34,211,238,0.6)] xl:left-[calc(100%+3rem)]" />
                  </span>
                  <InputCard name="productWhiteShirt" sizes="112px" />
                </div>
              </motion.div>
            </div>

            {/* 手機版：兩張小卡縮成手機上緣左右兩側的小圓角圖 */}
            <motion.div {...enter} custom={VISUAL_START} className="absolute -left-9 top-10 w-[72px] lg:hidden">
              <InputCard name="modelA" sizes="72px" />
            </motion.div>
            <motion.div {...enter} custom={VISUAL_START + 0.1} className="absolute -right-9 top-10 w-[72px] lg:hidden">
              <InputCard name="productWhiteShirt" sizes="72px" />
            </motion.div>
          </TiltStage>
        </div>
      </div>

      {/* 往下捲的提示：一條細線裡有一顆光點往下走 */}
      <div className="hero-enter pointer-events-none absolute bottom-8 left-1/2 -ml-px hidden h-12 w-px overflow-hidden bg-[#101828]/10 [animation-delay:1.4s] md:block" aria-hidden>
        <span className="scroll-cue absolute left-0 top-0 h-4 w-px bg-gradient-to-b from-transparent via-[#5B45D6] to-transparent" />
      </div>
    </section>
  );
}
