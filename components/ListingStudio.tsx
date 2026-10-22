'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Camera, FileSpreadsheet, Mic } from 'lucide-react';
import { ExcelDemo, PhotoDemo, VoiceDemo, type Phase } from '@/components/ListingDemos';
import { PhoneFrame } from '@/components/PhoneFrame';
import { TiltStage } from '@/components/TiltStage';
import { APP_IMAGES, type AppImageName } from '@/lib/app-images';
import { copy } from '@/lib/copy';
import { EASE, fadeUpItem, inView } from '@/lib/motion';

const listing = copy.business.listing;

// 順序對應 copy.business.listing.items
const ICONS = [FileSpreadsheet, Camera, Mic] as const;
// 每段示範進到階段 1、2、3 的時間（毫秒，從這一段開始算）
const TIMELINE = [
  [500, 1900, 2500],
  [500, 1900, 2700],
  [400, 3200, 3600],
] as const;
// 滑過分頁停留這麼久才切換：游標斜著劃過其他分頁時不會一路切過去
const HOVER_INTENT_MS = 120;
const FOCUS_RING = 'focus-ring focus-visible:ring-offset-[#FAFAFA]';
const FADE = { duration: 0.5, ease: EASE } as const;

/**
 * 三種上架方式的互動示範。左邊（手機版在上方）是 tablist，右邊是一座小舞台：
 * 品牌手上的素材（商品表、商品照、一段語音）→ 一道光 → 品牌後台的實機畫面。
 * 捲進畫面時演第一種；之後不自動輪播，滑鼠停在分頁上（觸控是點分頁）才切到那一段開始演。
 * 照片、標籤可以拖，放手會彈回原位；按麥克風會重播語音那一段。
 */
export function ListingStudio() {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState<{ key: string; phase: Phase }>({ key: '', phase: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const visible = useInView(stageRef, { amount: 0.4 });
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const count = listing.items.length;

  // 換段或重播時 key 會變；在新一段的計時器推進之前，phase 一律當成 0（不沿用上一段的結束狀態）
  const runKey = `${active}-${run}`;
  const phase = progress.key === runKey ? progress.phase : 0;

  useEffect(() => {
    if (!visible) return;
    const timers = TIMELINE[active].map((ms, i) => setTimeout(() => setProgress({ key: runKey, phase: (i + 1) as Phase }), ms));
    return () => timers.forEach(clearTimeout);
  }, [active, runKey, visible]);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  useEffect(() => cancelHover, []);

  const select = (i: number) => {
    cancelHover();
    setActive(i);
    setRun((r) => r + 1);
  };

  // 滑鼠停在分頁上就切過去開始演，不必點擊；已經在演的那一段不重來
  const onTabHover = (i: number) => {
    cancelHover();
    if (i === active) return;
    hoverTimer.current = setTimeout(() => select(i), HOVER_INTENT_MS);
  };
  const replay = () => setRun((r) => r + 1);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (active + 1) % count
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? (active - 1 + count) % count
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? count - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <motion.div
      variants={fadeUpItem}
      {...inView}
      className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16"
    >
      <div>
        <h3 className="text-center text-sm font-semibold text-[#475467] lg:text-left">{listing.label}</h3>
        <div
          role="tablist"
          aria-label={listing.label}
          className="mt-4 grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-[#101828]/10 lg:border-y lg:border-[#101828]/10"
        >
          {listing.items.map((entry, i) => {
            const Icon = ICONS[i];
            const isActive = i === active;
            return (
              <button
                key={entry.title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(i)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && onTabHover(i)}
                onPointerLeave={cancelHover}
                onKeyDown={onTabKeyDown}
                className={`group relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center transition-colors duration-300 lg:flex-row lg:items-start lg:gap-5 lg:rounded-none lg:px-0 lg:py-6 lg:text-left ${
                  isActive ? 'bg-white/80 shadow-[0_8px_24px_rgba(16,24,40,0.06)] lg:bg-transparent lg:shadow-none' : 'hover:bg-white/60 lg:hover:bg-transparent'
                } ${FOCUS_RING}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-500 ${
                    isActive
                      ? 'border-transparent bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white shadow-[0_10px_24px_rgba(37,99,235,0.3)]'
                      : 'border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10 text-[#2563EB]'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="block lg:flex-1 lg:pt-1">
                  <span
                    className={`block whitespace-nowrap text-[13px] font-semibold transition-colors duration-300 sm:text-sm md:text-base lg:whitespace-normal lg:text-lg ${
                      isActive ? 'text-[#101828]' : 'text-[#475467] group-hover:text-[#101828]'
                    }`}
                  >
                    {entry.title}
                  </span>
                  <span className="mt-1 hidden text-balance text-base leading-relaxed text-[#475467] lg:block">{entry.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
        {/* 手機版 tab 只放標題，選中項的說明放在下方 */}
        <p className="mx-auto mb-0 mt-5 max-w-sm text-balance text-center text-sm leading-relaxed text-[#475467] lg:hidden" aria-live="polite">
          {listing.items[active].desc}
        </p>
      </div>

      <div ref={stageRef} role="tabpanel" id={panelId} aria-labelledby={`${baseId}-tab-${active}`} className="relative">
        <span
          className="pointer-events-none absolute -inset-y-16 inset-x-0 bg-[radial-gradient(closest-side,rgba(96,165,250,0.22)_0%,rgba(6,182,212,0.1)_55%,transparent)] blur-2xl"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-[600px] items-center justify-center gap-3 sm:gap-4">
          {/* 素材：三段疊在同一格，換段時交叉淡入淡出 */}
          <div className="grid w-[52%] max-w-[300px] items-center">
            <AnimatePresence initial={false}>
              <motion.div
                key={runKey}
                className="[grid-area:1/1]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={FADE}
              >
                {active === 0 && <ExcelDemo phase={phase} copy={listing.demo.excel} />}
                {active === 1 && <PhotoDemo phase={phase} copy={listing.demo.photo} />}
                {active === 2 && <VoiceDemo phase={phase} onReplay={replay} copy={listing.demo.voice} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 素材 → 手機：結果出來時一道光沿連接線送進手機 */}
          <span className="relative hidden h-[2px] w-10 shrink-0 overflow-hidden rounded-full bg-[#101828]/10 sm:block" aria-hidden>
            {phase === 2 && (
              <motion.span
                key={runKey}
                className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-[#2563EB] to-[#06B6D4]"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.7, ease: [0.45, 0, 0.2, 1] }}
              />
            )}
          </span>

          <TiltStage max={6} trackRef={stageRef} className="w-[44%] max-w-[250px] shrink-0">
            <PhoneFrame className="w-full">
              <AnimatePresence initial={false}>
                <motion.div key={runKey} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={FADE}>
                  <PhoneScreens active={active} phase={phase} />
                </motion.div>
              </AnimatePresence>
              <span className="tilt-glare pointer-events-none absolute inset-0" aria-hidden />
            </PhoneFrame>
          </TiltStage>
        </div>
      </div>
    </motion.div>
  );
}

function Screen({ name, className = '' }: { name: AppImageName; className?: string }) {
  const image = APP_IMAGES[name];
  return (
    <Image
      src={image.src}
      alt={copy.images[name]}
      width={image.width}
      height={image.height}
      sizes="250px"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

/**
 * 手機裡的品牌後台畫面（都是實機截圖，不重畫介面）：
 * Excel → 店面由上往下逐列出現；拍照 → 「AI 分析中」換成標註好的表單；語音 → 尺寸表從模糊對焦成清楚。
 */
function PhoneScreens({ active, phase }: { active: number; phase: Phase }) {
  if (active === 0) {
    return (
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ clipPath: phase >= 2 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }}
        transition={{ duration: phase >= 2 ? 1.4 : 0, ease: EASE }}
      >
        <Screen name="storePage" />
      </motion.div>
    );
  }
  if (active === 1) {
    return (
      <>
        <Screen name="aiTagBefore" />
        <motion.div className="absolute inset-0" initial={false} animate={{ opacity: phase >= 3 ? 1 : 0 }} transition={phase >= 3 ? FADE : { duration: 0 }}>
          <Screen name="aiTagAfterTags" />
        </motion.div>
      </>
    );
  }
  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ filter: phase >= 2 ? 'blur(0px)' : 'blur(8px)', opacity: phase >= 2 ? 1 : 0.45 }}
      transition={phase >= 2 ? { duration: 0.9, ease: EASE } : { duration: 0 }}
    >
      <Screen name="voiceSizeShirt" />
    </motion.div>
  );
}
