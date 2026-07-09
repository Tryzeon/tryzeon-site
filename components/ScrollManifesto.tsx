'use client';

import {
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

const enWords = [
  'Fashion',
  'is',
  'no',
  'longer',
  'about',
  'trying',
  'it',
  'on.',
  "It's",
  'about',
  'living',
  'it.',
];

const zhClauses = ['時尚的未來，', '不是試衣間，', '是基礎建設。'];

// 中文宋體主句 — clause 逐句浮現
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// 英文 Playfair italic 副句 — 主句落定後逐字跟上
const enContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: zhClauses.length * 0.16 + 0.55,
    },
  },
};

const zhClauseVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: zhClauses.length * 0.16 + enWords.length * 0.05 + 0.85,
    },
  },
};

const kickerVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ScrollManifesto() {
  const reducedRaw = useReducedMotion();
  const reduced = reducedRaw ?? false;

  const viewport = { once: true, amount: 0.35 };

  return (
    <section
      id="statement"
      className="relative bg-white py-28 md:py-48 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[8%] right-[10%] w-[640px] h-[640px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[8%] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={viewport}
          variants={kickerVariants}
          className="flex justify-between items-start mb-14 md:mb-24"
        >
          <div className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#475467] flex items-center gap-3">
            <span className="block w-8 h-px bg-[#101828]/40" />
            <span>N°02 — Manifesto</span>
          </div>
          <div className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#475467] text-right hidden sm:block">
            2026 — Tryzeon Editorial
          </div>
        </motion.div>

        <h2 className="sr-only">
          Fashion is no longer about trying it on. It&apos;s about living it.
          時尚的未來，不是試衣間，是基礎建設。
        </h2>

        {/* 主句 — 中文宋體 editorial 大標（不用 italic，CJK 假斜體會醜） */}
        <motion.p
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={viewport}
          variants={containerVariants}
          className="font-serif font-black text-[#101828] tracking-[-0.01em] leading-[1.2] flex flex-wrap gap-y-3 mb-8 md:mb-12"
          style={{ fontSize: 'clamp(2.4rem, 5.8vw, 5.25rem)' }}
          aria-hidden
        >
          {zhClauses.map((clause, i) => (
            <motion.span
              key={`zh-${i}`}
              variants={wordVariants}
              className={`inline-block ${i === zhClauses.length - 1 ? 'text-[#2563EB]' : ''}`}
            >
              {clause}
            </motion.span>
          ))}
        </motion.p>

        {/* 副句 — 英文 Playfair italic，雜誌 pull-quote 感 */}
        <motion.p
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={viewport}
          variants={enContainerVariants}
          className="font-serif italic text-[#475467] tracking-[-0.01em] leading-[1.35] flex flex-wrap gap-x-[0.26em] gap-y-1"
          style={{ fontSize: 'clamp(1.2rem, 2.1vw, 1.9rem)' }}
          aria-hidden
        >
          {enWords.map((word, i) => (
            <motion.span
              key={`en-${i}`}
              variants={zhClauseVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        <motion.div
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={viewport}
          variants={ctaVariants}
          className="mt-14 md:mt-24 flex flex-wrap items-end justify-between gap-6"
        >
          <div className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#101828]/40 flex items-center gap-3">
            <span className="block w-12 h-px bg-[#101828]/30" />
            <span>Signed · Tryzeon Editorial</span>
          </div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 font-sans text-base md:text-lg font-medium text-[#2563EB] hover:text-[#06B6D4] transition-colors"
          >
            <span>立即開始這場進化</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
