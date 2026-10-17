'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ChannelSync } from '@/components/ChannelSync';
import { ExperienceShowcase } from '@/components/ExperienceShowcase';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { HeroCinema } from '@/components/HeroCinema';
import { LineFlow } from '@/components/LineFlow';
import { Magnetic } from '@/components/Magnetic';
import { MoreLink } from '@/components/MoreLink';
import { Navigation } from '@/components/Navigation';
import { Section } from '@/components/Section';
import { SectionHeader } from '@/components/SectionHeader';
import { SilkField } from '@/components/SilkField';
import { keepRanges } from '@/components/clauseWrap';
import { trackCTA } from '@/lib/analytics';
import { copy } from '@/lib/copy';
import { faqItems } from '@/lib/faq-data';
import { EASE, fadeUpItem, inView } from '@/lib/motion';

// 與 clauseWrap 同一條切法：只在「，；：。」之後斷開，每段各自進場
function splitClauses(text: string): string[] {
  return text.split(/(?<=[，；：。])/).filter(Boolean);
}

const REVEAL_STAGGER = 0.15;
const REVEAL_DURATION = 0.9;

// 光之標題：每段 blur 12px → 0、y 24 → 0；sheen 時進場後再掃過一次藍-青光澤，停回純 ink。
// 背景寬 250%：position 100% 與 0% 時露出的都是漸層兩端的純 ink，只有掃的途中帶色。
// 減少動態：CSS motion-reduce 拿掉漸層、字回到純 ink #101828，光澤不會出現（不在 JS 分支，SSR/CSR 一致）；
// MotionConfig 只會拿掉 y 位移，opacity 與 blur 照常收斂到 1 / blur(0px)
const clause: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(12px)', backgroundPosition: '100% 0%' },
  show: ({ i, sheen }: { i: number; sheen: boolean }) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    backgroundPosition: sheen ? '0% 0%' : '100% 0%',
    transition: {
      duration: REVEAL_DURATION,
      ease: EASE,
      delay: i * REVEAL_STAGGER,
      backgroundPosition: { duration: 2.2, ease: [0.45, 0, 0.25, 1], delay: REVEAL_DURATION + i * 0.35 },
    },
  }),
};

// 標題之後的連結／按鈕：等標題揭露到一半再進場
const after: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number = 0.4) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } }),
};

interface LightHeadlineProps {
  text: string;
  className: string;
  /** 進場後掃一次光澤 */
  sheen?: boolean;
}

function LightHeadline({ text, className, sheen = false }: LightHeadlineProps) {
  return (
    <motion.h2 {...inView} className={`cjk-punct text-balance font-serif font-black text-[#101828] ${className}`}>
      {splitClauses(text).map((part, i) => (
        <motion.span
          key={i}
          variants={clause}
          custom={{ i, sheen }}
          className="inline-block bg-[linear-gradient(100deg,#101828_40%,#2563EB_47%,#06B6D4_53%,#101828_60%)] bg-[length:250%_100%] bg-clip-text text-transparent motion-reduce:bg-none motion-reduce:text-[#101828]"
        >
          {keepRanges(part)}
        </motion.span>
      ))}
    </motion.h2>
  );
}

// Engine 標題背後的 3D 軌道環（桌機才顯示，reduced motion 靜止）
function OrbitRing() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden items-center justify-center [perspective:1200px] lg:flex"
      aria-hidden
    >
      <div className="aspect-square w-[min(90vw,980px)] [transform:rotateX(72deg)]">
        <div className="relative h-full w-full rounded-full border border-[rgba(37,99,235,0.18)] motion-safe:animate-[spin_40s_linear_infinite]">
          <div className="absolute inset-[14%] rounded-full border border-[rgba(6,182,212,0.12)]" />
          <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#60A5FA] shadow-[0_0_24px_8px_rgba(37,99,235,0.35)]" />
        </div>
      </div>
    </div>
  );
}

export default function HomePageClient() {
  const { engine, faq, cta } = copy.home;

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] relative">
      <Navigation />

      <header className="relative">
        <HeroCinema copy={copy.home.hero} />
      </header>

      <ChannelSync copy={copy.home.brands} />
      <LineFlow copy={copy.home.line} />
      <ExperienceShowcase copy={copy.home.experience} />

      {/* AI 引擎：首頁只留一句「光之標題」，完整的說明與飛輪在 /about */}
      <Section id="engine" className="overflow-hidden bg-[#FAFAFA] py-28 md:py-40">
        <OrbitRing />
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <LightHeadline
            text={engine.title}
            sheen
            className="mx-auto mb-10 text-[clamp(2.4rem,1.4rem+4.5vw,5.5rem)] leading-[1.1] tracking-[-0.015em] md:mb-12"
          />
          <motion.div {...inView} variants={after} custom={0.4}>
            <MoreLink href="/about#engine">{engine.link}</MoreLink>
          </motion.div>
        </div>
      </Section>

      {/* 常見問題 */}
      <Section id="faq" className="bg-[#FAFAFA] py-24 md:py-36">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeader title={faq.title} lede={faq.lede} />
          <motion.div {...inView} variants={fadeUpItem} className="glass-panel p-2 md:p-4">
            <FAQ items={faqItems} />
          </motion.div>
        </div>
      </Section>

      {/* 結尾 CTA — 首頁第二個、也是最後一個絲綢光場 */}
      <Section id="contact" className="flex min-h-[70vh] items-center overflow-hidden bg-[#FAFAFA] py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <SilkField intensity={0.9} />
          {/* 上緣淡回畫布色（與 FAQ 無接縫），中央壓白保標題可讀 */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FAFAFA] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(250,250,250,0.85)_15%,rgba(250,250,250,0)_60%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
          <LightHeadline
            text={cta.title}
            className="mx-auto mb-12 max-w-[22ch] text-[clamp(2.25rem,1.3rem+3.4vw,4.5rem)] leading-[1.12] tracking-[-0.01em] md:mb-14"
          />
          <motion.div {...inView} variants={after} custom={0.35} className="flex justify-center">
            <Magnetic className="w-full md:w-auto">
              <Link
                href="/business"
                onClick={() => trackCTA('cta_business')}
                className="btn-primary group w-full text-base md:w-auto"
              >
                {cta.primary}
                <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
