'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const easeApple = [0.25, 0.1, 0.25, 1.0] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const meshOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[140vh] bg-[#0A0A0B]"
      aria-label="Tryzeon hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0A0A0B]">
        <motion.div
          style={{ opacity: meshOpacity }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-[-10%] left-[-15%] w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(37,99,235,0.22)_0%,transparent_55%)] blur-3xl animate-mesh-float" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vh] bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,transparent_55%)] blur-3xl animate-mesh-float [animation-delay:6s]" />
          <div className="absolute top-[40%] right-[25%] w-[40vw] h-[40vh] bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_55%)] blur-3xl animate-mesh-float [animation-delay:11s]" />
          <div className="absolute inset-0 dot-grid-dark opacity-40" />
        </motion.div>

        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0A0B] via-[#0A0A0B]/70 to-transparent pointer-events-none z-[1]"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent pointer-events-none z-[1]"
          aria-hidden
        />

        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 max-w-[1600px] mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: easeApple }}
            className="flex items-center gap-3 mb-12 md:mb-16"
          >
            <span className="block w-6 h-px bg-white/35" />
            <span className="text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/50">
              AI × Fashion
            </span>
            <span className="block w-6 h-px bg-white/35" />
          </motion.div>

          <h1
            className="!text-white font-extrabold tracking-[-0.05em] leading-[0.9] mb-10 md:mb-14"
            style={{
              fontSize: 'clamp(3.5rem, 14vw, 13rem)',
              textShadow: '0 8px 60px rgba(0,0,0,0.4)',
            }}
          >
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.0, delay: 0.3, ease: easeApple }}
                className="block"
              >
                一張照片，
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.0, delay: 0.55, ease: easeApple }}
                className="block bg-gradient-to-br from-white via-[#93C5FD] to-[#06B6D4] bg-clip-text text-transparent pb-2"
              >
                立刻試穿。
              </motion.span>
            </span>
          </h1>

          <motion.p
            style={{ opacity: subOpacity }}
            className="text-base md:text-xl lg:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.95, ease: easeApple }}
              className="inline-block"
            >
              Tryzeon 用 AI 重新定義時尚購物體驗
            </motion.span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2, ease: easeApple }}
            style={{ opacity: subOpacity }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <Link
              href="/products/virtual-try-on"
              className="group inline-flex items-center justify-center px-9 py-4 bg-white text-[#0A0A0B] rounded-full font-semibold text-base hover:bg-white/95 transition-all duration-300 shadow-2xl shadow-white/10 hover:scale-[1.03] active:scale-[0.98]"
            >
              立即體驗
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/business"
              className="group inline-flex items-center justify-center px-9 py-4 bg-white/[0.06] backdrop-blur-xl text-white rounded-full font-semibold text-base hover:bg-white/12 transition-all duration-300 border border-white/[0.12] hover:border-white/30 hover:scale-[1.03] active:scale-[0.98]"
            >
              品牌合作方案
            </Link>
          </motion.div>
        </motion.div>

        <div
          className="absolute bottom-0 inset-x-0 px-6 md:px-12 lg:px-20 pb-6 md:pb-8 z-10 max-w-[1600px] mx-auto pointer-events-none"
          aria-hidden
        >
          <div className="flex items-end justify-between text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-white/35">
            <span>TRYZEON / 2026</span>
            <motion.span
              style={{ opacity: subOpacity }}
              className="flex items-center gap-2"
            >
              Scroll
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↓
              </motion.span>
            </motion.span>
            <span className="hidden md:inline">AI × FASHION × FUTURE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
