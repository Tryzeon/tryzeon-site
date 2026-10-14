'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { PhoneFrame } from '@/components/PhoneFrame';
import { APP_IMAGES, TRYON_VIDEO } from '@/lib/app-images';
import { copy } from '@/lib/copy';

interface TryOnVideoProps {
  replayLabel: string;
  /** false：不包手機外框，直接填滿父層（父層已經是 PhoneFrame 時用） */
  framed?: boolean;
  className?: string;
}

/**
 * 動態試穿短片：進入視窗才播一次、不循環，結束後顯示重播鍵。
 * prefers-reduced-motion 時不自動播放（只顯示 poster 與播放鍵）。
 * preload="none"：隱藏的那份（桌機上的手機版 DOM）不會先抓影片，play() 時才載入。
 */
export function TryOnVideo({ replayLabel, framed = true, className = '' }: TryOnVideoProps) {
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
  }, []);

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
        src={TRYON_VIDEO.src}
        poster={showPoster ? APP_IMAGES[TRYON_VIDEO.poster].src : undefined}
        muted
        playsInline
        preload="none"
        aria-label={copy.images[TRYON_VIDEO.poster]}
        onEnded={() => setEnded(true)}
        className="h-full w-full object-cover"
      />
      {ended && (
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
