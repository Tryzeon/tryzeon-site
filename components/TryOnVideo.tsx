'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { PhoneFrame } from '@/components/PhoneFrame';
import { TRYON_VIDEOS, type TryOnVideoName } from '@/lib/app-images';
import { copy } from '@/lib/copy';

interface TryOnVideoProps {
  /** 哪一支影片：TRYON_VIDEOS 的 key */
  video?: TryOnVideoName;
  replayLabel: string;
  /** false：不包手機外框，直接填滿父層（父層已經是 PhoneFrame 時用） */
  framed?: boolean;
  /** 由父層控制播放（輪播裡的那支手機）：true 時從頭播一次，false 時暫停；不給則進入視窗自動播一次 */
  active?: boolean;
  className?: string;
}

/**
 * 動態試穿短片：進入視窗才播一次、不循環，結束後顯示重播鍵。
 * prefers-reduced-motion 時不自動播放（只顯示 poster 與播放鍵）。
 * preload="none"：隱藏的那份（桌機上的手機版 DOM）不會先抓影片，play() 時才載入。
 */
export function TryOnVideo({ video: name = 'street', replayLabel, framed = true, active, className = '' }: TryOnVideoProps) {
  const source = TRYON_VIDEOS[name];
  const ref = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  // display:none 擋不住 poster 下載：隱藏的那份（桌機上的手機版 DOM）永遠不會相交，也就不會抓圖
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const posterObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowPoster(true);
          posterObserver.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    posterObserver.observe(video);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnded(true);
      return () => posterObserver.disconnect();
    }
    // 播放交給父層（active）控制
    if (active !== undefined) return () => posterObserver.disconnect();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => setEnded(true));
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => {
      posterObserver.disconnect();
      observer.disconnect();
    };
    // active 是否受控只看第一次 render
  }, []);

  // 受控模式：輪到這支手機時從頭播一次，輪走時暫停
  useEffect(() => {
    const video = ref.current;
    if (!video || active === undefined) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (active) {
      setShowPoster(true);
      video.currentTime = 0;
      setEnded(false);
      void video.play().catch(() => setEnded(true));
    } else {
      video.pause();
    }
  }, [active]);

  const replay = () => {
    const video = ref.current;
    if (!video) return;
    video.currentTime = 0;
    setEnded(false);
    void video.play().catch(() => setEnded(true));
  };

  const screen = (
    <>
      <video
        ref={ref}
        src={source.src}
        poster={showPoster ? source.poster : undefined}
        muted
        playsInline
        preload="none"
        aria-label={copy.videos[name]}
        onEnded={() => setEnded(true)}
        className="h-full w-full object-cover"
      />
      {ended && active !== false && (
        <button
          type="button"
          onClick={replay}
          className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[#101828] shadow-lg backdrop-blur-xl transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          {replayLabel}
        </button>
      )}
    </>
  );

  if (!framed) return <div className={`absolute inset-0 ${className}`}>{screen}</div>;
  return <PhoneFrame className={className}>{screen}</PhoneFrame>;
}
