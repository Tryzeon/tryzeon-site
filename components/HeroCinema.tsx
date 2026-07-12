'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { GradientWave } from '@/components/GradientWave';
import { Magnetic } from '@/components/Magnetic';

const AURORA = ['#FAFAFA', '#E0E7FF', '#E0F2FE', '#CFFAFE', '#FAFAFA'];
const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroCinema() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}

/**
 * KineticHeading — per-character clip-up reveal (COS / Lusion editorial type).
 * Each glyph rises out of an overflow-hidden mask, staggered.
 */
function KineticHeading({
  text,
  baseDelay = 0,
  className,
}: {
  text: string;
  baseDelay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: baseDelay + i * 0.055 }}
          >
            {c === ' ' ? ' ' : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: d },
  }),
};

function HeroDesktop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const reduced = useReducedMotion();

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.play();
      setIsPlaying(true);
      if (v.requestFullscreen) v.requestFullscreen();
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      className="relative bg-[#FAFAFA] hidden lg:block overflow-hidden"
      aria-label="Tryzeon hero"
    >
      {/* Aurora WebGL backdrop (blue/cyan only — system aligned) */}
      <div className="absolute inset-0 opacity-70 pointer-events-none" aria-hidden>
        <GradientWave colors={AURORA} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/55 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" aria-hidden />

      {/* Editorial top markers — 矮視窗會撞到置中內容的 kicker，gate 在 800px 高 */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.9}
        className="absolute top-28 inset-x-0 z-10 hidden [@media(min-width:1280px)_and_(min-height:800px)]:flex justify-between px-20 font-mono text-[10px] tracking-[0.4em] uppercase text-[#475467]/70"
      >
        <span>N°01 — Try-On Infrastructure</span>
        <span>Taipei · Est. 2024</span>
      </motion.div>

      <div className="relative z-10 min-h-[100svh] flex items-center px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Kinetic typography */}
          <div className="col-span-7">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.45}
              className="flex items-center gap-3 mb-10"
            >
              <span className="block w-8 h-px bg-[#101828]/40" />
              <span className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#475467]">
                Tryzeon · AI Try-On Infrastructure
              </span>
            </motion.div>

            <h1
              className="cjk-punct font-serif font-black tracking-[-0.02em] leading-[1.06] text-[#101828] mb-10"
              style={{ fontSize: 'clamp(2.75rem, 7.8vw, 6.75rem)' }}
            >
              <KineticHeading text="重新定義" baseDelay={0.6} />
              <br />
              <KineticHeading text="你的時尚。" baseDelay={0.85} />
            </h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1.5}
              className="text-lg md:text-xl lg:text-2xl text-[#475467] font-medium leading-relaxed max-w-2xl mb-12"
            >
              一張照片，穿上任何衣服。<br />
              無論線上、實體門市、品牌官網——Tryzeon 把實體服飾即時變成數位試穿。
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1.7}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Magnetic>
                <Link
                  href="/products/virtual-try-on"
                  className="group inline-flex items-center justify-center px-9 py-4 bg-[#101828] text-white rounded-full font-semibold text-base hover:bg-[#1D2939] transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  立即體驗
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/business"
                  className="group inline-flex items-center justify-center px-9 py-4 bg-white/70 backdrop-blur-md text-[#101828] rounded-full font-semibold text-base hover:bg-white transition-colors duration-300 border border-white/60"
                >
                  品牌合作方案
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          {/* Right: Video in floating glass frame */}
          <motion.div
            className="col-span-5"
            initial={reduced ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
          >
            <div className="relative p-2 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_30px_80px_rgba(16,24,40,0.12)]">
              <div
                className="relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  src="/videos/hero-runway.mp4"
                  poster="/images/hero-runway-poster.jpg"
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
                      <Play className="w-7 h-7 md:w-9 md:h-9 text-[#101828] fill-[#101828] ml-1" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 p-6 text-white pointer-events-none">
                  <span className="block text-[10px] font-mono font-semibold tracking-[0.4em] uppercase opacity-80 mb-2">
                    Hero Demo · 8s
                  </span>
                  <p className="text-sm md:text-base font-medium leading-snug">
                    從照片到上身，<br />一鍵看見。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint — 編排最後一拍，等舞台就緒才出現。
          置中放外層：framer 的 inline transform 會蓋掉 -translate-x-1/2 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2.3}
          className="flex flex-col items-center gap-2 text-[#475467]/60"
        >
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase">Scroll</span>
          <span className="text-xl animate-scroll-drift">↓</span>
        </motion.div>
      </div>
    </section>
  );
}

function HeroMobile() {
  return (
    <section
      className="relative lg:hidden bg-[#FAFAFA] min-h-[100svh] overflow-hidden"
      aria-label="Tryzeon hero"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[5%] left-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[5%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 dot-grid opacity-40" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col px-6 pt-32 pb-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.25}
          className="flex items-center gap-3 mb-8"
        >
          <span className="block w-8 h-px bg-[#101828]/40" />
          <span className="text-[10px] font-mono font-semibold tracking-[0.4em] uppercase text-[#475467]">
            Tryzeon · 2026
          </span>
        </motion.div>

        <h1
          className="cjk-punct font-serif font-black tracking-[-0.02em] leading-[1.08] text-[#101828] mb-6"
          style={{ fontSize: 'clamp(2.75rem, 12.5vw, 4.6rem)' }}
        >
          <KineticHeading text="重新定義" baseDelay={0.5} />
          <br />
          <KineticHeading text="你的時尚。" baseDelay={0.75} />
        </h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.3}
          className="text-base text-[#475467] font-medium leading-relaxed max-w-md mb-8"
        >
          一張照片，穿上任何衣服。<br />
          線上、實體門市、品牌官網都能即時試穿。
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.5}
          className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl mb-8"
        >
          <Image
            src="/images/slides/slide-6-global-vision-runway-4k.jpg"
            alt="Tryzeon AI runway"
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl">
              <Play className="w-5 h-5 text-[#101828] fill-[#101828] ml-0.5" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.75}
          className="flex flex-col gap-3 mt-auto"
        >
          <Link
            href="/products/virtual-try-on"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#101828] text-white rounded-full font-semibold text-base hover:bg-[#1D2939] transition-all duration-300 shadow-lg active:scale-[0.98]"
          >
            立即體驗
            <span className="ml-2">→</span>
          </Link>
          <Link
            href="/business"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#101828] rounded-full font-semibold text-base hover:bg-[#F2F4F7] transition-all duration-300 border border-[#101828]/10 active:scale-[0.98]"
          >
            品牌合作方案
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
