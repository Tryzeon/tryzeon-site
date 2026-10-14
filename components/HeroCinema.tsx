'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { GradientWave } from '@/components/GradientWave';
import { Magnetic } from '@/components/Magnetic';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { trackCTA } from '@/lib/analytics';
import { APP_IMAGES } from '@/lib/app-images';
import { copy as siteCopy, type HomeCopy } from '@/lib/copy';
import { EASE } from '@/lib/motion';

const AURORA = ['#FAFAFA', '#E0E7FF', '#E0F2FE', '#CFFAFE', '#FAFAFA'];

// 「輸入」小卡：白框、圓角、柔和陰影（模特全身照與商品平拍共用），寬度跟著父層
function InputCard({ name, sizes }: { name: 'modelA' | 'productWhiteShirt'; sizes: string }) {
  const image = APP_IMAGES[name];
  return (
    <div className="w-full overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-[0_12px_32px_rgba(16,24,40,0.14)]">
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

// 輸入小卡、「+」與連接線的進場時間：排在文字（CSS hero-enter，最晚 0.35s 開始）之後
const VISUAL_START = 0.6;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: d },
  }),
};

// 手機主圖是 LCP：與 H1 同時開始淡入（SSR 時是 opacity 0，延遲越長 LCP 越晚）
const phoneEnter: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.2 } },
};

interface HeroCinemaProps {
  copy: HomeCopy['hero'];
}

/**
 * 定位：左文右圖。右邊是試穿結果的實機畫面，左側疊兩張「輸入」小卡
 * （全身照 + 商品平拍），讀起來是「一張全身照＋商品照 → 試穿結果」。
 */
export function HeroCinema({ copy }: HeroCinemaProps) {
  // reduced motion 交給 MotionConfig（不在這裡分支，避免 SSR/client hydration mismatch）
  const enter = { variants: fadeUp, initial: 'hidden' as const, animate: 'show' as const };
  // 文字欄用 CSS 的 hero-enter（globals.css）：SSR HTML 就帶著動畫，不等 hydration，主張在第一眼就讀得到。
  // 輸入小卡、「+」與連接線排在文字後面（手機主圖不等：它是 LCP，用 phoneEnter 與 H1 一起進場）

  return (
    <section className="relative min-h-[100svh] bg-[#FAFAFA] overflow-hidden">
      <div className="absolute inset-0 hidden lg:block opacity-70 pointer-events-none" aria-hidden>
        <GradientWave colors={AURORA} />
      </div>
      <div className="absolute inset-0 lg:hidden pointer-events-none" aria-hidden>
        <div className="absolute top-[5%] left-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[5%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] blur-3xl" />
      </div>
      {/* 可讀性遮罩只壓左半（文字欄），右邊的手機留在 aurora 裡 */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_50%,#FAFAFA_25%,rgba(250,250,250,0)_70%)]"
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

        {/* 視覺欄：輸入小卡 → 試穿結果 */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* 桌機：兩張小卡直排在手機左側，中間「+」，再用一條細線接到手機。
                定位與位移放外層，進場動畫放內層（framer 的 y 會覆寫 transform class） */}
            <div className="absolute right-full top-1/2 hidden -translate-y-1/2 lg:block">
              <motion.div {...enter} custom={VISUAL_START + 0.15} className="mr-8 xl:mr-12">
                <div className="flex w-24 flex-col items-center xl:w-28">
                  <InputCard name="modelA" sizes="112px" />
                  {/* 「+」那一列往右拉出細線接到手機：全身照＋商品照 → 試穿結果 */}
                  <span className="relative my-2 flex w-full justify-center" aria-hidden>
                    <span className="text-xl font-light leading-none text-[#2563EB]">+</span>
                    <span className="absolute left-full top-1/2 h-px w-8 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] xl:w-12">
                      <span className="absolute -right-0.5 -top-[3px] h-[7px] w-[7px] rounded-full bg-[#06B6D4]" />
                    </span>
                  </span>
                  <InputCard name="productWhiteShirt" sizes="112px" />
                </div>
              </motion.div>
            </div>

            <motion.div variants={phoneEnter} initial="hidden" animate="show">
              <AppScreen
                name="tryonSimple"
                priority
                sizes="(min-width: 1280px) 330px, (min-width: 1024px) 300px, min(64vw, 280px)"
                className="w-[64vw] max-w-[280px] lg:w-[min(300px,calc((100svh_-_15rem)_*_0.46))] lg:max-w-none xl:w-[min(330px,calc((100svh_-_15rem)_*_0.46))]"
              />
            </motion.div>

            {/* 手機版：兩張小卡縮成手機上緣左右兩側的小圓角圖，不畫連接線 */}
            <motion.div {...enter} custom={VISUAL_START + 0.15} className="absolute -left-9 top-10 w-[72px] lg:hidden">
              <InputCard name="modelA" sizes="72px" />
            </motion.div>
            <motion.div {...enter} custom={VISUAL_START + 0.25} className="absolute -right-9 top-10 w-[72px] lg:hidden">
              <InputCard name="productWhiteShirt" sizes="72px" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
