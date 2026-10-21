'use client';

import { useEffect, useRef, useState } from 'react';
import { PhoneFrame } from '@/components/PhoneFrame';
import { TRYON_VIDEOS, type TryOnVideoName } from '@/lib/app-images';
import { copy } from '@/lib/copy';

interface TryOnVideoProps {
  /** 哪一支影片：TRYON_VIDEOS 的 key */
  video?: TryOnVideoName;
  /** false：不包手機外框，直接填滿父層（父層已經是 PhoneFrame 時用） */
  framed?: boolean;
  className?: string;
}

/**
 * 動態試穿短片：靠近視窗才開始載入與播放，之後一直循環、不暫停，也沒有重播鍵。
 * preload="none"＋不用 autoPlay：隱藏的那份（桌機上的手機版 DOM）永遠不會相交，就不會抓影片。
 */
export function TryOnVideo({ video: name = 'street', framed = true, className = '' }: TryOnVideoProps) {
  const source = TRYON_VIDEOS[name];
  const ref = useRef<HTMLVideoElement>(null);
  // display:none 擋不住 poster 下載：隱藏的那份永遠不會相交，也就不會抓圖
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowPoster(true);
          // 自動播放被瀏覽器擋下時停在 poster，不另外處理
          void video.play().catch(() => {});
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const screen = (
    <video
      ref={ref}
      src={source.src}
      poster={showPoster ? source.poster : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={copy.videos[name]}
      className="h-full w-full object-cover"
    />
  );

  if (!framed) return <div className={`absolute inset-0 ${className}`}>{screen}</div>;
  return <PhoneFrame className={className}>{screen}</PhoneFrame>;
}
