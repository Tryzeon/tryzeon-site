'use client';

import Image from 'next/image';

import { PhoneFrame } from '@/components/PhoneFrame';
import { useCopy } from '@/components/useCopy';
import { APP_IMAGES, type AppImageName } from '@/lib/app-images';

interface AppScreenProps {
  name: AppImageName;
  /** next/image sizes，依實際顯示寬度填，例如 '(min-width: 1024px) 320px, 70vw' */
  sizes: string;
  priority?: boolean;
  /** false：不包手機外框，直接填滿父層（父層已經是 PhoneFrame 時用） */
  framed?: boolean;
  className?: string;
}

/** 一張實機截圖放進手機外框；alt 取自目前語言的 copy.images（與 APP_IMAGES 同一組 key）。server 頁面也會用，所以是 client 元件、自己從網址判斷語言 */
export function AppScreen({ name, sizes, priority = false, framed = true, className = '' }: AppScreenProps) {
  const copy = useCopy();
  const image = APP_IMAGES[name];
  const screen = (
    <Image
      src={image.src}
      alt={copy.images[name]}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      className="h-full w-full object-cover"
    />
  );
  return framed ? <PhoneFrame className={className}>{screen}</PhoneFrame> : screen;
}
