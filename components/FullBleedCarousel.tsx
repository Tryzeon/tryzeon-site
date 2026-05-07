'use client';

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { type Slide } from "@/lib/constants";

function SlideImage({ src, alt, isActive, priority, index }: { src: string; alt: string; isActive: boolean; priority?: boolean; index: number }) {
  // 不同的 Ken Burns 效果方向
  const kenBurnsVariants = [
    { scale: [1, 1.08], x: [0, -20] },      // 放大 + 向左
    { scale: [1.05, 1], x: [20, 0] },       // 縮小 + 向右
    { scale: [1, 1.06], y: [0, -15] },      // 放大 + 向上
    { scale: [1.04, 1], y: [15, 0] },       // 縮小 + 向下
    { scale: [1, 1.07], x: [-15, 15] },     // 放大 + 左到右
    { scale: [1.03, 1.08], y: [-10, 10] },  // 放大 + 上到下
  ];

  const variant = kenBurnsVariants[index % kenBurnsVariants.length];

  return (
    <motion.div
      initial={{ scale: variant.scale[0], x: variant.x?.[0] || 0, y: variant.y?.[0] || 0 }}
      animate={isActive ? {
        scale: variant.scale[1],
        x: variant.x?.[1] || 0,
        y: variant.y?.[1] || 0
      } : {}}
      transition={{ duration: 12, ease: "linear" }}
      className="relative h-full w-full will-change-transform"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition: 'center center' }}
        priority={priority}
        sizes="100vw"
        quality={90}
      />
      {/* 電影感顆粒紋理覆蓋 */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />
    </motion.div>
  );
}

interface CarouselProps {
  slides: Slide[];
  auto?: boolean;
  interval?: number;
}

const DEFAULT_INTERVAL = 5000;
const CAROUSEL_INDEX_KEY = 'tryzeon_carousel_index';

export function FullBleedCarousel({ slides, auto = false, interval = DEFAULT_INTERVAL }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem(CAROUSEL_INDEX_KEY);
    if (saved) {
      const index = parseInt(saved, 10);
      if (!isNaN(index) && index >= 0 && index < slides.length) {
        setCurrentIndex(index);
      }
    }
  }, [slides.length]);

  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem(CAROUSEL_INDEX_KEY, currentIndex.toString());
    }
  }, [currentIndex, mounted]);

  useEffect(() => {
    if (!auto || hover || ctaHover || !slides || slides.length <= 1) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, interval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [auto, hover, ctaHover, interval, slides, slides.length]);

  const go = (i: number) => setCurrentIndex(i);
  const next = () => setCurrentIndex((i) => (i + 1) % slides.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + slides.length) % slides.length);

  const currentSlide = slides[currentIndex];

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="group relative w-full h-[92dvh] sm:h-[100dvh] overflow-hidden bg-black"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute inset-0 h-full w-full z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full"
          >
            {currentSlide.video ? (
              <div className="h-full w-full relative">
                <video
                  src={currentSlide.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover absolute inset-0"
                />
                {/* 影片覆蓋層 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
              </div>
            ) : (
              <SlideImage
                src={currentSlide.image}
                alt={currentSlide.title || `slide-${currentIndex}`}
                isActive={true}
                priority={currentIndex === 0}
                index={currentIndex}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Apple-style Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 左側漸層 - 電影感 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
        {/* 底部漸層 - 細膩的萲萲 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        {/* 頂部微妙暗角 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
      </div>

      {/* Content Area - Bottom-Left position to avoid covering image subjects */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end items-start text-left px-8 md:px-16 lg:px-24 pb-20 sm:pb-28">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentSlide?.kicker && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-white/90 font-display text-xs md:text-sm font-semibold tracking-[0.25em] mb-4 uppercase"
                >
                  {currentSlide.kicker}
                </motion.div>
              )}
              {currentSlide?.title && (
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-4 tracking-tight"
                  style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
                >
                  {currentSlide.title}
                </motion.h1>
              )}
              {currentSlide?.desc && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="max-w-lg text-white/85 text-base md:text-lg font-display font-medium leading-relaxed mb-8 text-balance"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                >
                  {currentSlide.desc}
                </motion.p>
              )}
              {currentSlide?.cta && (
                <div
                  className="flex space-x-4 justify-start items-center"
                  onMouseEnter={() => setCtaHover(true)}
                  onMouseLeave={() => setCtaHover(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Link
                      href={currentSlide.cta.href}
                      className="inline-flex items-center px-8 py-4 bg-white text-[#1D1D1F] rounded-full font-display font-bold text-base shadow-2xl btn-apple"
                      onClick={() => {
                        if (autoPlayRef.current) {
                          clearInterval(autoPlayRef.current);
                          autoPlayRef.current = null;
                        }
                      }}
                    >
                      {currentSlide.cta.label}
                      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows - Apple Style with Hover Reveal */}
      <div className="absolute right-8 md:right-12 bottom-28 sm:bottom-32 z-30 flex space-x-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/25 hover:scale-110 transition-all duration-300 text-white shadow-lg"
          aria-label="Previous slide"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/25 hover:scale-110 transition-all duration-300 text-white shadow-lg"
          aria-label="Next slide"
        >
          <ArrowRight size={22} strokeWidth={2} />
        </button>
      </div>

      {/* Navigation Dots - Apple Capsule Style */}
      <div className="absolute left-1/2 bottom-10 z-30 flex -translate-x-1/2 space-x-1 bg-black/40 rounded-full px-3 py-2.5" role="tablist" aria-label="Carousel navigation">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -my-1"
            aria-label={`Go to slide ${i + 1} of ${slides.length}`}
            aria-selected={i === currentIndex}
            role="tab"
          >
            <span className={`rounded-full transition-all duration-500 ease-out ${i === currentIndex
              ? 'w-8 h-2 bg-white shadow-lg'
              : 'w-2 h-2 bg-white/40 hover:bg-white/70 hover:scale-125'
              }`} />
          </button>
        ))}
      </div>

    </div>
  );
}

