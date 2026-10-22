'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { AppScreen } from '@/components/AppScreen';
import { ClothRipple } from '@/components/ClothRipple';
import { GradientWave } from '@/components/GradientWave';
import { Magnetic } from '@/components/Magnetic';
import { TiltStage } from '@/components/TiltStage';
import { clauseWrap, keepRanges } from '@/components/clauseWrap';
import { useCopy, useLocale } from '@/components/useCopy';
import { trackCTA } from '@/lib/analytics';
import { APP_IMAGES } from '@/lib/app-images';
import type { HomeCopy } from '@/lib/copy';
import { localePath } from '@/lib/i18n';
import { EASE } from '@/lib/motion';

const AURORA = ['#FAFAFA', '#E0E7FF', '#E0F2FE', '#CFFAFE', '#FAFAFA'];

// 「輸入」小卡：白框、圓角、柔和陰影（模特全身照與商品平拍共用），寬度跟著父層
// 商品平拍那張，游標劃過會像布一樣起波紋；全身照是人像，不套
function InputCard({ name, sizes }: { name: 'modelA' | 'productHero'; sizes: string }) {
  const siteCopy = useCopy();
  const image = APP_IMAGES[name];
  const photo = (
    <Image
      src={image.src}
      alt={siteCopy.images[name]}
      width={image.width}
      height={image.height}
      sizes={sizes}
      className="h-auto w-full"
    />
  );
  return (
    <div className="w-full overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-[0_12px_32px_rgba(16,24,40,0.14)]">
      {name === 'productHero' ? <ClothRipple src={image.src}>{photo}</ClothRipple> : photo}
    </div>
  );
}

// 輸入小卡、「+」與連接線的進場時間：排在大標（line-mask，0.15s 起逐行升起）之後
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
 *
 * 首屏的一段編排：大標逐行從遮罩下升起 → 小卡進場 → 一道光沿連接線送進手機。
 * 整組視覺是一個 3D 舞台：游標在 hero 內移動，手機與浮在前景的小卡
 * 依景深轉向游標，螢幕上的反光點跟著走。
 */
export function HeroCinema({ copy }: HeroCinemaProps) {
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const enter = { variants: fadeUp, initial: 'hidden' as const, animate: 'show' as const };
  // 文字欄用 CSS 的 hero-enter（globals.css）：SSR HTML 就帶著動畫，不等 hydration，主張在第一眼就讀得到。
  // 輸入小卡、「+」與連接線排在文字後面（手機主圖不等：它是 LCP，用 phoneEnter 與 H1 一起進場）

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] bg-[#FAFAFA] overflow-hidden">
      <div className="absolute inset-0 hidden lg:block opacity-70 pointer-events-none" aria-hidden>
        <GradientWave colors={AURORA} />
      </div>
      <div className="absolute inset-0 lg:hidden pointer-events-none" aria-hidden>
        <div className="absolute top-[5%] left-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[5%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] blur-3xl" />
      </div>
      {/* 下緣淡出到畫布底色：aurora 不在 hero 底部切出一條硬邊（MASTER：一張連續的畫布） */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-b from-transparent to-[#FAFAFA]" aria-hidden />
      {/* 可讀性遮罩只壓左半（文字欄），右邊的手機留在 aurora 裡 */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_50%,#FAFAFA_25%,rgba(250,250,250,0)_70%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-16 px-6 pt-28 pb-16 md:px-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 文字欄：手機版置中，桌機靠左 */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* 大標逐行從遮罩下升起（.line-mask，CSS-only）：SSR HTML 就帶著動畫，不等 hydration */}
          <h1
            className="cjk-punct font-serif font-black tracking-[-0.02em] leading-[1.04] text-[#101828] mb-8 md:mb-10"
            style={{ fontSize: 'clamp(3rem, 1.4rem + 6.6vw, 7.6rem)' }}
          >
            {copy.titleLines.map((line, i) => (
              <span key={line} className="line-mask">
                <span style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="hero-enter [animation-delay:0.45s] mb-0 max-w-xl text-base md:text-xl text-[#475467] font-medium leading-relaxed text-balance">
            {clauseWrap(copy.sub)}
          </p>

          <p className="hero-enter [animation-delay:0.55s] mt-4 mb-0 max-w-xl text-sm md:text-base text-[#475467] leading-relaxed text-balance">
            {keepRanges(copy.service)}
          </p>

          <div className="hero-enter [animation-delay:0.7s] mt-10 md:mt-12 flex w-full flex-col sm:w-auto sm:flex-row gap-3 md:gap-4">
            <Magnetic>
              <Link
                href={localePath(locale, '/business')}
                onClick={() => trackCTA('hero_business')}
                className="btn-primary w-full text-base"
              >
                {copy.ctaPrimary}
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href={localePath(locale, '/download')}
                onClick={() => trackCTA('hero_download')}
                className="focus-ring inline-flex w-full items-center justify-center px-9 py-4 bg-white/70 backdrop-blur-md text-[#101828] rounded-full font-semibold text-base hover:bg-white transition-colors duration-300 border border-[#101828]/10"
              >
                {copy.ctaSecondary}
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* 視覺欄：輸入小卡 → 試穿結果，整組是跟著游標轉的 3D 舞台 */}
        <div className="flex justify-center lg:justify-end">
          <TiltStage trackRef={sectionRef} max={7} className="relative">
            {/* 落在地面的柔影：舞台轉動時留在原地，景深更明確 */}
            <span
              className="pointer-events-none absolute -bottom-8 left-1/2 h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent)] blur-xl"
              aria-hidden
            />

            {/* 桌機：兩張小卡直排在手機左側、浮在前景（translateZ），中間「+」，再用一條細線接到手機。
                定位與位移放外層，進場動畫放內層（framer 的 y 會覆寫 transform class） */}
            <div className="absolute right-full top-1/2 hidden [transform:translate3d(0,-50%,90px)] lg:block">
              <motion.div {...enter} custom={VISUAL_START + 0.15} className="mr-8 xl:mr-12">
                <div className="flex w-24 flex-col items-center xl:w-28">
                  <InputCard name="modelA" sizes="112px" />
                  {/* 「+」那一列往右拉出細線接到手機：全身照＋商品照 → 試穿結果；一道光沿線送進手機 */}
                  <span className="relative my-2 flex w-full justify-center" aria-hidden>
                    <span className="text-xl font-light leading-none text-[#2563EB]">+</span>
                    <span className="absolute left-full top-1/2 h-px w-8 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] xl:w-12">
                      <span className="hero-feed absolute -top-[2px] left-0 h-[5px] w-4 rounded-full bg-[linear-gradient(90deg,transparent,#60A5FA,#06B6D4)] shadow-[0_0_12px_2px_rgba(6,182,212,0.6)]" />
                      <span className="absolute -right-0.5 -top-[3px] h-[7px] w-[7px] rounded-full bg-[#06B6D4]" />
                    </span>
                  </span>
                  <InputCard name="productHero" sizes="112px" />
                </div>
              </motion.div>
            </div>

            <motion.div variants={phoneEnter} initial="hidden" animate="show" className="relative">
              <AppScreen
                name="tryonHero"
                priority
                sizes="(min-width: 1280px) 330px, (min-width: 1024px) 300px, min(64vw, 280px)"
                className="w-[64vw] max-w-[280px] lg:w-[min(300px,calc((100svh_-_15rem)_*_0.46))] lg:max-w-none xl:w-[min(330px,calc((100svh_-_15rem)_*_0.46))]"
              />
              {/* 螢幕上的反光點，跟著舞台的傾斜走（globals.css） */}
              <span className="pointer-events-none absolute inset-[7px] overflow-hidden rounded-[2.2rem]" aria-hidden>
                <span className="tilt-glare absolute inset-0" />
              </span>
            </motion.div>

            {/* 手機版：兩張小卡縮成手機上緣左右兩側的小圓角圖，不畫連接線 */}
            <motion.div {...enter} custom={VISUAL_START + 0.15} className="absolute -left-9 top-10 w-[72px] lg:hidden">
              <InputCard name="modelA" sizes="72px" />
            </motion.div>
            <motion.div {...enter} custom={VISUAL_START + 0.25} className="absolute -right-9 top-10 w-[72px] lg:hidden">
              <InputCard name="productHero" sizes="72px" />
            </motion.div>
          </TiltStage>
        </div>
      </div>
    </section>
  );
}
