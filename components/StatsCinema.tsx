'use client';

import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface StatItem {
  value: string;
  label: string;
  desc: string;
  accent: string;
}

const stats: StatItem[] = [
  {
    value: '84%',
    label: 'AR Interest',
    desc: '消費者對 AR 試用功能展現高度興趣，這是時尚產業的下一個典範轉移。',
    accent: '#60A5FA',
  },
  {
    value: '71%',
    label: 'Frequency',
    desc: '虛擬試穿讓消費者顯著提升選購頻率，從偶爾購買變成日常探索。',
    accent: '#06B6D4',
  },
  {
    value: '+30%',
    label: 'Conversion',
    desc: '導入虛擬試穿後，電商轉換率穩定提升，把瀏覽轉化為實際購買。',
    accent: '#FBBF24',
  },
];

interface StatSceneProps {
  stat: StatItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function StatScene({ stat, index, total, progress }: StatSceneProps) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const fadeIn = start + segment * 0.1;
  const hold = start + segment * 0.55;
  const fadeOut = end - segment * 0.1;

  const opacity = useTransform(
    progress,
    [start, fadeIn, hold, fadeOut, end],
    [0, 1, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    ['18%', '0%', '0%', '-12%'],
  );
  const scale = useTransform(progress, [start, fadeIn, fadeOut, end], [1.06, 1, 1, 0.96]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col justify-center items-start text-left max-w-5xl"
    >
      <div className="flex items-center gap-3 mb-6 md:mb-10">
        <span className="block w-6 h-px" style={{ backgroundColor: stat.accent, opacity: 0.6 }} />
        <span
          className="text-[10px] md:text-xs font-mono font-semibold tracking-[0.35em] uppercase"
          style={{ color: stat.accent }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {stat.label}
        </span>
      </div>

      <div
        className="font-extrabold tracking-[-0.06em] leading-[0.85] mb-8 md:mb-10 !text-white"
        style={{
          fontSize: 'clamp(5rem, 22vw, 22rem)',
          textShadow: '0 8px 80px rgba(0,0,0,0.5)',
        }}
      >
        {stat.value}
      </div>

      <p className="text-base md:text-2xl text-white/65 font-medium leading-relaxed max-w-2xl">
        {stat.desc}
      </p>
    </motion.div>
  );
}

interface ProgressBarProps {
  progress: MotionValue<number>;
  total: number;
  index: number;
}

function ProgressBar({ progress, total, index }: ProgressBarProps) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const localProgress = useTransform(progress, [start, end], [0, 1]);
  const scaleX = useTransform(localProgress, (v) => Math.max(0, Math.min(1, v)));

  return (
    <div className="flex-1 h-px bg-white/10 origin-left overflow-hidden">
      <motion.div
        style={{ scaleX }}
        className="h-full bg-white/60 origin-left"
      />
    </div>
  );
}

export function StatsCinema() {
  return (
    <>
      <StatsMobile />
      <StatsDesktop />
    </>
  );
}

function StatsDesktop() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      id="stats"
      className="relative bg-[#0A0A0B] text-white hidden lg:block"
      style={{ height: `${stats.length * 100}vh` }}
      aria-label="Tryzeon market validation"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0A0A0B]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <motion.div
            style={{
              opacity: useTransform(
                scrollYProgress,
                [0, 0.25, 0.5, 0.75, 1],
                [0.45, 0.6, 0.7, 0.55, 0.4],
              ),
            }}
            className="absolute inset-0"
          >
            <div className="absolute top-[-20%] left-[-15%] w-[70vw] h-[70vh] bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_60%)] blur-3xl" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(circle,rgba(124,58,237,0.16)_0%,transparent_60%)] blur-3xl" />
          </motion.div>
          <div className="absolute inset-0 dot-grid-dark opacity-30" />
        </div>

        <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto">
          <div className="absolute top-[14vh] md:top-[12vh] left-6 md:left-12 lg:left-20 z-20">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-white/45">
              <span className="block w-6 h-px bg-white/35" />
              Market Signal
            </span>
            <h2 className="mt-4 md:mt-6 text-3xl md:text-5xl font-extrabold tracking-[-0.03em] !text-white">
              改變正在發生。
            </h2>
          </div>

          <div className="relative w-full h-[60vh]">
            {stats.map((stat, i) => (
              <StatScene
                key={stat.label}
                stat={stat}
                index={i}
                total={stats.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 px-6 md:px-12 lg:px-20 pb-6 md:pb-8 z-20 max-w-[1600px] mx-auto pointer-events-none">
          <div className="flex items-center gap-3 md:gap-5">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3 md:gap-5 flex-1">
                <ProgressBar progress={scrollYProgress} total={stats.length} index={i} />
                {i < stats.length - 1 && <span className="text-white/20 text-xs">/</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsMobile() {
  return (
    <section
      id="stats"
      className="relative lg:hidden bg-[#0A0A0B] text-white py-20 overflow-hidden"
      aria-label="Tryzeon market validation"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-10%] left-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[80vw] h-[40vh] bg-[radial-gradient(circle,rgba(124,58,237,0.16)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 dot-grid-dark opacity-25" />
      </div>

      <div className="relative z-10 px-6 max-w-md mx-auto">
        <div className="mb-12">
          <span className="inline-flex items-center gap-3 text-[10px] font-mono font-semibold tracking-[0.4em] uppercase text-white/45 mb-4">
            <span className="block w-6 h-px bg-white/35" />
            Market Signal
          </span>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] !text-white">
            改變正在發生。
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 overflow-hidden"
            >
              <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-25 blur-2xl"
                style={{ backgroundColor: stat.accent }}
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="block w-5 h-px"
                    style={{ backgroundColor: stat.accent, opacity: 0.7 }}
                  />
                  <span
                    className="text-[9px] font-mono font-semibold tracking-[0.3em] uppercase"
                    style={{ color: stat.accent }}
                  >
                    {String(i + 1).padStart(2, '0')} · {stat.label}
                  </span>
                </div>
                <div
                  className="font-extrabold tracking-[-0.05em] leading-[0.85] mb-4 !text-white"
                  style={{ fontSize: 'clamp(3rem, 16vw, 4.5rem)' }}
                >
                  {stat.value}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

