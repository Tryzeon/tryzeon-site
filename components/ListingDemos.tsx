'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, FileSpreadsheet, Loader2, Mic } from 'lucide-react';
import { ClothRipple } from '@/components/ClothRipple';
import { Magnetic } from '@/components/Magnetic';
import { useCopy } from '@/components/useCopy';
import { APP_IMAGES } from '@/lib/app-images';
import type { SiteCopy } from '@/lib/copy';
import { EASE } from '@/lib/motion';

type Demo = SiteCopy['business']['listing']['demo'];

/**
 * 每段示範共用的四個階段（由 ListingStudio 依時間推進）：
 * 0 素材就位 → 1 處理中 → 2 結果出來 → 3 手機畫面換成結果
 */
export type Phase = 0 | 1 | 2 | 3;

interface DemoProps {
  phase: Phase;
}

// 結果小籤：彈出時帶一點過衝，拖開放手會彈回原位
const POP = { type: 'spring', stiffness: 320, damping: 15, mass: 0.8 } as const;
const SNAP_BACK = { bounceStiffness: 380, bounceDamping: 11 } as const;

function Status({ busy, done, text }: { busy: boolean; done: boolean; text: string }) {
  return (
    <p className="mb-0 mt-3 flex h-5 items-center justify-center gap-1.5 text-xs font-semibold text-[#475467] md:text-sm" aria-live="polite">
      {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2563EB]" aria-hidden />}
      {done && <Check className="h-3.5 w-3.5 text-[#2563EB]" strokeWidth={2.5} aria-hidden />}
      {(busy || done) && text}
    </p>
  );
}

// 商品名稱、分類、售價；窄螢幕放不下三欄，分類先藏起來，名稱與售價保持完整
const COL_CLASS = ['', 'hidden w-[3.25rem] sm:table-cell', 'w-[3.75rem] text-right tabular-nums'] as const;

/** Excel：商品表逐列匯入，每列打勾 */
export function ExcelDemo({ phase, copy: demo }: { phase: Phase; copy: Demo['excel'] }) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-[#101828]/10 bg-white shadow-[0_24px_60px_rgba(16,24,40,0.12),0_6px_18px_rgba(16,24,40,0.06)]">
        <div className="flex items-center gap-2 border-b border-[#101828]/10 bg-[#F2F4F7] px-3 py-2.5 text-xs font-semibold text-[#344054] md:px-4">
          <FileSpreadsheet className="h-4 w-4 text-[#2563EB]" strokeWidth={1.75} aria-hidden />
          {demo.file}
        </div>
        <table className="w-full table-fixed text-left text-[11px] leading-snug text-[#344054] md:text-xs">
          <thead>
            <tr className="border-b border-[#101828]/10 text-[#667085]">
              {demo.columns.map((col, i) => (
                <th key={col} scope="col" className={`px-2.5 py-2 font-semibold md:px-3 ${COL_CLASS[i]}`}>
                  {col}
                </th>
              ))}
              <th className="w-7" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {demo.rows.map((row, i) => (
              <motion.tr
                key={row[0]}
                initial={false}
                animate={{ backgroundColor: phase >= 1 ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0)' }}
                transition={{ duration: 0.4, ease: EASE, delay: phase >= 1 ? 0.15 + i * 0.32 : 0 }}
                className="border-b border-[#101828]/5 last:border-0"
              >
                {row.map((cell, c) => (
                  <td key={c} className={`px-2.5 py-2.5 md:px-3 ${c === 0 ? 'truncate' : 'whitespace-nowrap'} ${COL_CLASS[c]}`}>
                    {cell}
                  </td>
                ))}
                <td className="pr-2">
                  <motion.span
                    initial={false}
                    animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ ...POP, delay: phase >= 1 ? 0.3 + i * 0.32 : 0 }}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4]"
                    aria-hidden
                  >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </motion.span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <Status busy={phase === 1} done={phase >= 2} text={phase === 1 ? demo.busy : demo.done} />
    </div>
  );
}

/** 拍照上傳：照片被掃描，AI 標註一顆顆彈出來；照片和標籤都能拖，放手會彈回去 */
export function PhotoDemo({ phase, copy: demo }: DemoProps & { copy: Demo['photo'] }) {
  const copy = useCopy();
  const image = APP_IMAGES.productTweed;

  return (
    <div className="w-full">
      <motion.div
        drag
        dragSnapToOrigin
        dragElastic={0.5}
        dragTransition={SNAP_BACK}
        whileHover={{ rotate: 0, scale: 1.02 }}
        whileDrag={{ rotate: 2, scale: 1.06, cursor: 'grabbing' }}
        initial={{ rotate: -3 }}
        animate={{ rotate: -3 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative mx-auto w-[72%] max-w-[200px] cursor-grab touch-none select-none overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-[0_20px_48px_rgba(16,24,40,0.16)]"
      >
        <ClothRipple src={image.src}>
          <Image
            src={image.src}
            alt={copy.images.productTweed}
            width={image.width}
            height={image.height}
            sizes="200px"
            draggable={false}
            className="pointer-events-none h-auto w-full"
          />
        </ClothRipple>
        {/* 掃描：一道藍青光帶由上往下掃過，光帶上方留下一層淡淡的網格 */}
        {phase === 1 && (
          <>
            <motion.span
              className="absolute inset-x-0 top-0 bg-[linear-gradient(rgba(37,99,235,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.14)_1px,transparent_1px)] bg-[size:14px_14px]"
              initial={{ height: '0%' }}
              animate={{ height: '100%' }}
              transition={{ duration: 1.3, ease: [0.45, 0, 0.2, 1] }}
              aria-hidden
            />
            <motion.span
              className="absolute inset-x-0 h-10 -translate-y-full bg-gradient-to-b from-transparent via-[#60A5FA]/40 to-[#06B6D4]/80 shadow-[0_8px_24px_rgba(6,182,212,0.6)]"
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 1.3, ease: [0.45, 0, 0.2, 1] }}
              aria-hidden
            />
          </>
        )}
      </motion.div>

      <Status busy={phase === 1} done={phase >= 2} text={phase === 1 ? demo.busy : demo.done} />

      <ul aria-label={demo.tagsLabel} className="mx-auto mt-3 flex min-h-[5.5rem] max-w-[260px] flex-wrap content-start justify-center gap-1.5 md:gap-2">
        {demo.tags.map((tag, i) => (
          <motion.li
            key={tag}
            drag
            dragSnapToOrigin
            dragElastic={0.9}
            dragTransition={SNAP_BACK}
            initial={false}
            animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.3, y: -70 }}
            transition={phase >= 2 ? { ...POP, delay: i * 0.06 } : { duration: 0 }}
            whileHover={{ scale: 1.08 }}
            whileDrag={{ scale: 1.15, boxShadow: '0 12px 28px rgba(37,99,235,0.25)' }}
            className="cursor-grab touch-none select-none rounded-full border border-[#2563EB]/20 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8] shadow-[0_4px_12px_rgba(16,24,40,0.08)] md:px-3 md:text-xs"
          >
            {tag}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// 聲波條的高度（0–1），錯開成不規則的起伏
const BARS = [0.35, 0.7, 0.5, 0.95, 0.6, 0.4, 0.85, 0.55, 1, 0.65, 0.45, 0.8, 0.5, 0.9, 0.4, 0.7, 0.55, 0.3];

// 唸稿逐字出現；數字以品牌藍標出來，看得出哪些被填進尺寸表
function Transcript({ text, shown }: { text: string; shown: number }) {
  let used = 0;
  return (
    <>
      {text.split(/(\d+(?:\.\d+)?)/).map((part, i) => {
        const visible = part.slice(0, Math.max(0, shown - used));
        used += part.length;
        if (!visible) return null;
        return /^\d/.test(part) ? (
          <span key={i} className="font-semibold text-[#1D4ED8]">
            {visible}
          </span>
        ) : (
          <span key={i}>{visible}</span>
        );
      })}
    </>
  );
}

/** 語音建檔：麥克風收音、聲波跳動，唸稿逐字打出來 */
export function VoiceDemo({ phase, onReplay, copy: demo }: DemoProps & { onReplay: () => void; copy: Demo['voice'] }) {
  const listening = phase === 1;
  const total = demo.transcript.length;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (phase === 0) setShown(0);
    if (phase >= 2) setShown(total);
    if (phase !== 1) return;
    const id = setInterval(() => setShown((n) => Math.min(total, n + 1)), 2600 / total);
    return () => clearInterval(id);
  }, [phase, total]);

  return (
    <div className="flex w-full flex-col items-center">
      <Magnetic strength={0.4}>
        <button
          type="button"
          onClick={onReplay}
          aria-label={demo.replay}
          className="focus-ring relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white shadow-[0_16px_40px_rgba(37,99,235,0.35)] md:h-20 md:w-20"
        >
          {listening &&
            [0, 0.6].map((delay) => (
              <span
                key={delay}
                className="absolute inset-0 rounded-full border-2 border-[#60A5FA]"
                style={{ animation: `pulseRing 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s infinite` }}
                aria-hidden
              />
            ))}
          <Mic className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.75} aria-hidden />
        </button>
      </Magnetic>

      {/* 聲波：收音時每條依自己的高度上下跳，其他時候壓成一條細線 */}
      <div className="mt-5 flex h-10 items-center gap-[3px]" aria-hidden>
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-[#2563EB] to-[#06B6D4]"
            initial={false}
            animate={listening ? { height: [6, 6 + h * 34, 8 + h * 12, 6 + h * 30, 6] } : { height: 4 }}
            transition={
              listening ? { duration: 0.9 + (i % 4) * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 } : { duration: 0.4, ease: EASE }
            }
          />
        ))}
      </div>

      <Status busy={listening} done={phase >= 2} text={listening ? demo.busy : demo.done} />

      <p className="mb-0 mt-3 min-h-[4.5rem] max-w-[260px] rounded-2xl rounded-tl-md border border-[#101828]/10 bg-white px-4 py-3 text-left text-xs leading-relaxed text-[#344054] shadow-[0_8px_24px_rgba(16,24,40,0.08)] md:text-sm">
        <span className="sr-only">{demo.transcript}</span>
        <span aria-hidden>
          <Transcript text={demo.transcript} shown={shown} />
          {listening && shown < total && <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-[#2563EB] align-middle" />}
        </span>
      </p>
      <p className="mb-0 mt-2 hidden text-center text-xs text-[#667085] md:block">{demo.hint}</p>
    </div>
  );
}
