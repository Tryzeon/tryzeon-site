'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { GradientWave } from '@/components/GradientWave';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroCinema() {
  return (
    <>
      <HeroMobile />
      <HeroDesktop />
    </>
  );
}

/**
 * HeroDesktop — ORYZO/Lusion-style light cinematic hero.
 *
 * Layout (1 viewport):
 *  Left  ~58% : kicker + 巨型黑字標題 + 副標 + 2 CTA
 *  Right ~42% : video thumbnail with PLAY button overlay → fullscreen video
 *
 * No sticky cinema 3-stage anymore — Hero is a single confident statement,
 * not a scroll-controlled narrative. The cinema scroll narrative happens
 * in subsequent sections (Stats / Features).
 */
function HeroDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(
        [kickerRef.current, headingRef.current, subheadRef.current, ctaRef.current, thumbRef.current],
        { opacity: 0, y: 30 },
      );
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
      tl.to(kickerRef.current, { opacity: 1, y: 0 }, 0.15)
        .to(headingRef.current, { opacity: 1, y: 0, duration: 1.1 }, 0.25)
        .to(subheadRef.current, { opacity: 1, y: 0 }, 0.55)
        .to(ctaRef.current, { opacity: 1, y: 0 }, 0.75)
        .to(thumbRef.current, { opacity: 1, y: 0, duration: 1.1 }, 0.4);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
      ref={sectionRef}
      className="relative bg-[#FAFAFA] hidden lg:block overflow-hidden"
      aria-label="Tryzeon hero"
    >
      {/* Stripe-style WebGL gradient wave (21st.dev Gradient Wave adapted) */}
      <div className="absolute inset-0 opacity-50 pointer-events-none" aria-hidden>
        <GradientWave colors={['#FAFAFA', '#E0E7FF', '#FEF3C7', '#FFE4E6', '#E0F2FE']} />
      </div>
      {/* Soft white wash to keep typography readable */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent"
        aria-hidden
      />
      {/* Subtle dot grid texture */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden />

      <div className="relative z-10 min-h-[100svh] flex items-center px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Typography */}
          <div className="col-span-7">
            <div ref={kickerRef} className="flex items-center gap-3 mb-10">
              <span className="block w-8 h-px bg-[#101828]/40" />
              <span className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#475467]">
                Tryzeon · AI Try-On Infrastructure
              </span>
            </div>

            <h1
              ref={headingRef}
              className="font-extrabold tracking-[-0.05em] leading-[0.88] text-[#101828] mb-10"
              style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}
            >
              重新定義<br />
              <span className="bg-gradient-to-r from-[#101828] via-[#101828] to-[#475467] bg-clip-text text-transparent">
                你的時尚。
              </span>
            </h1>

            <p
              ref={subheadRef}
              className="text-lg md:text-xl lg:text-2xl text-[#475467] font-medium leading-relaxed max-w-2xl mb-12"
            >
              一張照片，穿上任何衣服。<br />
              無論線上、實體門市、品牌官網——Tryzeon 把實體服飾即時變成數位試穿。
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link
                href="/products/virtual-try-on"
                className="group inline-flex items-center justify-center px-9 py-4 bg-[#101828] text-white rounded-full font-semibold text-base hover:bg-[#1D2939] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                立即體驗
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/business"
                className="group inline-flex items-center justify-center px-9 py-4 bg-white text-[#101828] rounded-full font-semibold text-base hover:bg-[#F2F4F7] transition-all duration-300 border border-[#101828]/10 hover:border-[#101828]/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                品牌合作方案
              </Link>
            </div>
          </div>

          {/* Right: Video thumbnail with PLAY */}
          <div className="col-span-5">
            <div
              ref={thumbRef}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src="/videos/hero-runway.mp4"
                muted
                loop
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden
              />
              {/* Subtle vignette to give edge contrast on light page */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

              {/* PLAY button overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
                    <Play className="w-7 h-7 md:w-9 md:h-9 text-[#101828] fill-[#101828] ml-1" />
                  </div>
                </div>
              )}

              {/* Caption strip */}
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
        </div>
      </div>

      {/* Scroll hint at bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#475467]/60 pointer-events-none">
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase">Scroll</span>
        <span className="text-xl animate-bounce">↓</span>
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
        <div className="absolute bottom-[5%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(124,58,237,0.06)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 dot-grid opacity-40" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col px-6 pt-32 pb-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="block w-8 h-px bg-[#101828]/40" />
          <span className="text-[10px] font-mono font-semibold tracking-[0.4em] uppercase text-[#475467]">
            Tryzeon · 2026
          </span>
        </div>

        <h1
          className="font-extrabold tracking-[-0.05em] leading-[0.9] text-[#101828] mb-6"
          style={{ fontSize: 'clamp(3rem, 14vw, 5rem)' }}
        >
          重新定義<br />
          你的時尚。
        </h1>

        <p className="text-base text-[#475467] font-medium leading-relaxed max-w-md mb-8">
          一張照片，穿上任何衣服。<br />
          線上、實體門市、品牌官網都能即時試穿。
        </p>

        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl mb-8">
          <Image
            src="/images/slides/slide-6-global-vision-runway-4k.jpg"
            alt="Tryzeon AI runway"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl">
              <Play className="w-5 h-5 text-[#101828] fill-[#101828] ml-0.5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
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
        </div>
      </div>
    </section>
  );
}
