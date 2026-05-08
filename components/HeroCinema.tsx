'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

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

function HeroDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (arrowRef.current && !reduceMotion) {
        gsap.to(arrowRef.current, {
          y: 4,
          duration: 0.9,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          pinSpacing: false,
          scrub: 1,
        },
      });

      tl.to(bgRef.current, { scale: 1.2, yPercent: 12, ease: 'none', duration: 1 }, 0);

      tl.to(overlayRef.current, { opacity: 0.6, ease: 'none', duration: 0.5 }, 0)
        .to(overlayRef.current, { opacity: 0.85, ease: 'none', duration: 0.5 }, 0.5);

      tl.to(meshRef.current, { opacity: 0.7, ease: 'none', duration: 0.5 }, 0)
        .to(meshRef.current, { opacity: 0.4, ease: 'none', duration: 0.5 }, 0.5);

      tl.to(stage1Ref.current, { opacity: 0, y: -60, ease: 'power2.in', duration: 0.10 }, 0.18);

      tl.fromTo(
        stage2Ref.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.10 },
        0.22,
      ).to(stage2Ref.current, { opacity: 0, y: -60, ease: 'power2.in', duration: 0.10 }, 0.55);

      tl.fromTo(
        stage3Ref.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0.60,
      );

      tl.to(scrollHintRef.current, { opacity: 0, ease: 'none', duration: 0.15 }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0B] hidden lg:block"
      style={{ height: '300vh' }}
      aria-label="Tryzeon hero cinema"
    >
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-[#0A0A0B] relative">
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform z-0"
          style={{ transform: 'scale(1) translate3d(0,0,0)' }}
        >
          <Image
            src="/images/slides/slide-6-global-vision-runway-4k.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#0A0A0B] pointer-events-none z-[1]"
          style={{ opacity: 0.45 }}
          aria-hidden
        />

        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/30 via-transparent to-[#0A0A0B] pointer-events-none z-[2]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/50 via-transparent to-[#0A0A0B]/20 pointer-events-none z-[2]"
          aria-hidden
        />

        <div
          ref={meshRef}
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{ opacity: 1 }}
          aria-hidden
        >
          <div className="absolute -top-[10%] left-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_60%)] blur-3xl animate-mesh-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vh] bg-[radial-gradient(circle,rgba(124,58,237,0.14)_0%,transparent_60%)] blur-3xl animate-mesh-float [animation-delay:7s]" />
        </div>

        <div
          ref={stage1Ref}
          className="absolute inset-0 z-10 flex flex-col justify-center items-start text-white px-6 md:px-12 lg:px-20 will-change-transform"
          style={{ opacity: 1 }}
        >
          <div className="w-full max-w-[1500px] mx-auto">
            <div className="flex items-center gap-3 mb-10 md:mb-14">
              <span className="block w-8 h-px bg-white/40" />
              <span className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/70">
                AI × Fashion
              </span>
            </div>
            <h1
              className="!text-white font-extrabold tracking-[-0.05em] leading-[0.9] mb-8 md:mb-10"
              style={{
                fontSize: 'clamp(3rem, 11vw, 10rem)',
                textShadow: '0 8px 60px rgba(0,0,0,0.5)',
              }}
            >
              重新定義
            </h1>
            <p className="text-base md:text-xl text-white/70 font-medium leading-relaxed max-w-xl">
              滾動繼續 → 看見時尚購物的下一個型態
            </p>
          </div>
        </div>

        <div
          ref={stage2Ref}
          className="absolute inset-0 z-10 flex flex-col justify-center items-start text-white px-6 md:px-12 lg:px-20 will-change-transform"
          style={{ opacity: 0, transform: 'translate3d(0,60px,0)' }}
        >
          <div className="w-full max-w-[1500px] mx-auto">
            <h2
              className="!text-white font-extrabold tracking-[-0.05em] leading-[0.92]"
              style={{
                fontSize: 'clamp(2.5rem, 9vw, 8rem)',
                textShadow: '0 8px 60px rgba(0,0,0,0.5)',
              }}
            >
              一張照片，<br />
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#06B6D4] to-[#60A5FA] bg-clip-text text-transparent">
                穿上任何衣服。
              </span>
            </h2>
            <p className="mt-8 md:mt-10 text-base md:text-xl text-white/65 font-medium leading-relaxed max-w-2xl">
              Tryzeon AI 把每一件實體服飾，<br className="hidden md:block" />
              變成你能立刻試穿的數位可能。
            </p>
          </div>
        </div>

        <div
          ref={stage3Ref}
          className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center text-white px-6 will-change-transform"
          style={{ opacity: 0, transform: 'translate3d(0,60px,0)' }}
        >
          <div className="w-full max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#60A5FA] mb-8 md:mb-10">
              <span className="block w-6 h-px bg-[#60A5FA]/60" />
              Now Available
              <span className="block w-6 h-px bg-[#60A5FA]/60" />
            </span>
            <h2
              className="!text-white font-extrabold tracking-[-0.04em] leading-[0.95] mb-12 md:mb-14"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
            >
              開始你的<br />AI 試穿。
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/products/virtual-try-on"
                className="group inline-flex items-center justify-center px-9 py-4 bg-white text-[#0A0A0B] rounded-full font-semibold text-base hover:bg-white/95 transition-all duration-300 shadow-2xl shadow-white/10 hover:scale-[1.03] active:scale-[0.98]"
              >
                立即體驗
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/business"
                className="group inline-flex items-center justify-center px-9 py-4 bg-white/[0.06] backdrop-blur-xl text-white rounded-full font-semibold text-base hover:bg-white/12 transition-all duration-300 border border-white/15 hover:border-white/30 hover:scale-[1.03] active:scale-[0.98]"
              >
                品牌合作方案
              </Link>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 inset-x-0 px-6 md:px-12 lg:px-20 pb-6 md:pb-8 z-30 max-w-[1600px] mx-auto pointer-events-none"
          aria-hidden
        >
          <div className="flex items-end justify-between text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-white/40">
            <span>TRYZEON / 2026</span>
            <span ref={scrollHintRef} className="hidden md:flex items-center gap-2" style={{ opacity: 1 }}>
              Scroll
              <span ref={arrowRef} className="inline-block">↓</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMobile() {
  return (
    <section
      className="relative lg:hidden bg-[#0A0A0B] min-h-[100svh] overflow-hidden"
      aria-label="Tryzeon hero"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/slides/slide-6-global-vision-runway-4k.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-[#0A0A0B]/65 pointer-events-none z-[1]" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/40 via-transparent to-[#0A0A0B] pointer-events-none z-[2]"
        aria-hidden
      />
      <div className="absolute inset-0 pointer-events-none z-[3]" aria-hidden>
        <div className="absolute -top-[10%] left-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(37,99,235,0.22)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col justify-between text-white px-6 pt-32 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-white/40" />
            <span className="text-[10px] font-mono font-semibold tracking-[0.4em] uppercase text-white/70">
              AI × Fashion
            </span>
          </div>
          <h1
            className="!text-white font-extrabold tracking-[-0.05em] leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(3rem, 14vw, 5rem)', textShadow: '0 8px 60px rgba(0,0,0,0.5)' }}
          >
            重新定義<br />你的時尚。
          </h1>
          <p className="text-base text-white/75 font-medium leading-relaxed max-w-md">
            一張照片，穿上任何衣服。<br />
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#06B6D4] to-[#60A5FA] bg-clip-text text-transparent font-semibold">
              Tryzeon AI 把實體服飾變成你能立刻試穿的數位可能。
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <Link
            href="/products/virtual-try-on"
            className="group inline-flex items-center justify-center px-8 py-4 bg-white text-[#0A0A0B] rounded-full font-semibold text-base hover:bg-white/95 transition-all duration-300 shadow-2xl shadow-white/10 active:scale-[0.98]"
          >
            立即體驗
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/business"
            className="group inline-flex items-center justify-center px-8 py-4 bg-white/[0.06] backdrop-blur-xl text-white rounded-full font-semibold text-base hover:bg-white/12 transition-all duration-300 border border-white/15 active:scale-[0.98]"
          >
            品牌合作方案
          </Link>
        </div>
      </div>
    </section>
  );
}
