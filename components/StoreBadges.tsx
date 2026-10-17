import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/lib/app-links';

interface StoreBadgesProps {
  className?: string;
}

const BADGE =
  'focus-ring spotlight inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] px-8 py-4 font-semibold text-pearl backdrop-blur-md transition-[background,border-color,box-shadow] duration-500 hover:border-white/30 hover:bg-white/[0.09] hover:shadow-[0_0_40px_-8px_rgba(185,167,255,0.6)]';

/** App Store／Google Play 兩顆下載鈕；網址只從 lib/app-links 取 */
export function StoreBadges({ className = '' }: StoreBadgesProps) {
  return (
    <div className={`flex flex-col justify-center gap-4 sm:flex-row ${className}`}>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className={BADGE}>
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className="mb-1 text-[10px] text-pearl/70">Download on the</span>
          <span className="-mt-1 text-lg font-semibold">App Store</span>
        </span>
      </a>

      <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" className={BADGE}>
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.832L19.8 12l-2.102 1.125-2.538-2.538 2.538-2.538v.826zM5.864 2.658l10.937 6.333-2.302 2.302-8.635-8.635z" />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className="mb-1 text-[10px] text-pearl/70">GET IT ON</span>
          <span className="-mt-1 text-lg font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
